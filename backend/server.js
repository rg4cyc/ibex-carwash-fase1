require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { randomUUID } = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");
const { Server } = require("socket.io");

const PORT = Number(process.env.PORT || 8080);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "ibex_carwash_fase1";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const allowedResources = [
  "clients",
  "guardians",
  "students",
  "vehicles",
  "projects",
  "tasks",
  "slots",
  "bookings"
];

const memory = {
  clients: [],
  guardians: [],
  students: [],
  vehicles: [],
  projects: [],
  tasks: [],
  slots: [],
  bookings: [],
  activities: []
};

let db = null;
let mongoClient = null;

function nowIso() {
  return new Date().toISOString();
}

function normalizeRecord(record) {
  if (!record) return record;
  const copy = { ...record };
  if (copy._id) {
    copy.id = String(copy._id);
    delete copy._id;
  }
  return copy;
}

function createRecord(payload) {
  return {
    id: randomUUID(),
    ...payload,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

async function collection(name) {
  if (!db) return null;
  return db.collection(name);
}

async function listRecords(resource) {
  const col = await collection(resource);
  if (!col) return memory[resource];
  const rows = await col.find({}).sort({ createdAt: -1 }).toArray();
  return rows.map(normalizeRecord);
}

async function findRecord(resource, id) {
  const col = await collection(resource);
  if (!col) return memory[resource].find((item) => item.id === id);
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  return normalizeRecord(await col.findOne(query));
}

async function insertRecord(resource, payload) {
  const record = createRecord(payload);
  const col = await collection(resource);
  if (!col) {
    memory[resource].unshift(record);
    return record;
  }
  const result = await col.insertOne(record);
  return { ...record, id: String(result.insertedId) };
}

async function updateRecord(resource, id, payload) {
  const changes = { ...payload, updatedAt: nowIso() };
  const col = await collection(resource);

  if (!col) {
    const index = memory[resource].findIndex((item) => item.id === id);
    if (index === -1) return null;
    memory[resource][index] = { ...memory[resource][index], ...changes };
    return memory[resource][index];
  }

  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  await col.updateOne(query, { $set: changes });
  return findRecord(resource, id);
}

async function deleteRecord(resource, id) {
  const col = await collection(resource);

  if (!col) {
    const before = memory[resource].length;
    memory[resource] = memory[resource].filter((item) => item.id !== id);
    return before !== memory[resource].length;
  }

  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await col.deleteOne(query);
  return result.deletedCount > 0;
}

async function addActivity(type, message, meta = {}) {
  const activity = createRecord({ type, message, meta });
  const col = await collection("activities");

  if (!col) {
    memory.activities.unshift(activity);
    memory.activities = memory.activities.slice(0, 50);
  } else {
    await col.insertOne(activity);
  }

  io.emit("activity:new", activity);
  return activity;
}

function requireResource(req, res, next) {
  const { resource } = req.params;
  if (!allowedResources.includes(resource)) {
    return res.status(404).json({ error: "Resource not supported" });
  }
  return next();
}

function validateRequired(payload, requiredFields) {
  return requiredFields.filter((field) => !String(payload[field] || "").trim());
}

const requiredByResource = {
  clients: ["name", "phone"],
  guardians: ["name", "phone"],
  students: ["name", "guardianName"],
  vehicles: ["clientName", "description"],
  projects: ["name", "date"],
  tasks: ["title", "projectName", "assignedTo"],
  slots: ["date", "startTime", "capacity"],
  bookings: ["clientName", "vehicleDescription", "slotLabel", "serviceName"]
};

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    service: "IBEX Carwash Fase I API",
    realtime: "Socket.IO enabled",
    database: db ? "mongodb" : "memory-fallback",
    timestamp: nowIso()
  });
});

app.get("/api/dashboard", async (_req, res) => {
  const result = {};
  for (const resource of allowedResources) {
    result[resource] = await listRecords(resource);
  }
  result.activities = db
    ? (await db.collection("activities").find({}).sort({ createdAt: -1 }).limit(20).toArray()).map(normalizeRecord)
    : memory.activities.slice(0, 20);
  res.json(result);
});

app.get("/api/:resource", requireResource, async (req, res) => {
  res.json(await listRecords(req.params.resource));
});

app.post("/api/:resource", requireResource, async (req, res) => {
  const { resource } = req.params;
  const missing = validateRequired(req.body, requiredByResource[resource] || []);

  if (missing.length) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  const record = await insertRecord(resource, req.body);
  await addActivity(`${resource}:created`, `Nuevo registro creado en ${resource}`, {
    resource,
    id: record.id,
    label: record.name || record.title || record.clientName || "registro"
  });

  res.status(201).json(record);
});

app.patch("/api/:resource/:id", requireResource, async (req, res) => {
  const record = await updateRecord(req.params.resource, req.params.id, req.body);

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  await addActivity(`${req.params.resource}:updated`, `Registro actualizado en ${req.params.resource}`, {
    resource: req.params.resource,
    id: record.id
  });

  res.json(record);
});

app.delete("/api/:resource/:id", requireResource, async (req, res) => {
  const deleted = await deleteRecord(req.params.resource, req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Record not found" });
  }

  await addActivity(`${req.params.resource}:deleted`, `Registro eliminado en ${req.params.resource}`, {
    resource: req.params.resource,
    id: req.params.id
  });

  res.json({ ok: true });
});

io.on("connection", (socket) => {
  socket.emit("activity:new", {
    id: randomUUID(),
    type: "system:connected",
    message: "Cliente conectado al feed en tiempo real",
    createdAt: nowIso()
  });
});

async function seedIfEmpty() {
  const clients = await listRecords("clients");
  if (clients.length > 0) return;

  await insertRecord("clients", {
    name: "Cliente demo",
    phone: "555-0100",
    email: "cliente.demo@example.com"
  });

  await insertRecord("guardians", {
    name: "Tutor demo",
    phone: "555-0110",
    email: "tutor.demo@example.com"
  });

  await insertRecord("students", {
    name: "Estudiante demo",
    guardianName: "Tutor demo",
    status: "activo",
    skills: "Puntualidad, atención al cliente"
  });

  await insertRecord("vehicles", {
    clientName: "Cliente demo",
    description: "SUV gris",
    plate: "DEMO-001"
  });

  await insertRecord("projects", {
    name: "Jornada IBEX Sábado",
    date: "2026-02-07",
    status: "planeada",
    objective: "Coordinar slots de lavado exterior"
  });

  await insertRecord("tasks", {
    title: "Preparar material de lavado",
    projectName: "Jornada IBEX Sábado",
    assignedTo: "Estudiante demo",
    status: "pendiente",
    priority: "media"
  });

  await insertRecord("slots", {
    date: "2026-02-07",
    startTime: "09:00",
    durationMinutes: 30,
    capacity: 3,
    location: "IBEX Carwash"
  });

  await insertRecord("bookings", {
    clientName: "Cliente demo",
    vehicleDescription: "SUV gris",
    slotLabel: "2026-02-07 09:00",
    serviceName: "Lavado exterior",
    status: "confirmada"
  });

  await addActivity("system:seeded", "Datos iniciales cargados para demostración");
}

async function start() {
  if (MONGODB_URI) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    console.log(`MongoDB connected: ${DB_NAME}`);
  } else {
    console.log("MONGODB_URI not configured. Using memory fallback.");
  }

  await seedIfEmpty();

  server.listen(PORT, () => {
    console.log(`IBEX Fase I API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});
