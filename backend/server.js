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

const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL || "http://localhost:4010";
const NOTIFICATIONS_SERVICE_ENABLED = process.env.NOTIFICATIONS_SERVICE_ENABLED !== "false";

async function publishNotificationEvent(event) {
  if (!NOTIFICATIONS_SERVICE_ENABLED) {
    return { ok: false, skipped: true, reason: "notifications_disabled" };
  }

  try {
    const response = await fetch(`${NOTIFICATIONS_SERVICE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        source: event.source || "ibex-main-backend"
      })
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.warn("notifications_service_unavailable", error.message);
    return { ok: false, error: error.message };
  }
}



const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsOriginDelegate(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error(`CORS blocked origin: ${origin}`));
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOriginDelegate,
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

app.use(cors({
  origin: corsOriginDelegate,
  credentials: true
}));
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


app.post("/api/t4/notify", async (req, res) => {
  const payload = req.body || {};
  const event = {
    type: payload.type || "t4.manual",
    title: payload.title || "T4 integration event",
    message: payload.message || "Backend sent event to notifications service",
    source: "ibex-main-backend",
    entity: payload.entity || {
      module: "t4",
      integration: "backend-notifications-service"
    }
  };

  const result = await publishNotificationEvent(event);

  if (io) {
    io.emit("ibex:event", {
      ...event,
      realtime: true,
      createdAt: new Date().toISOString()
    });
  }

  res.status(result.ok ? 201 : 202).json({
    ok: true,
    forwardedToNotificationsService: result.ok,
    notificationResult: result,
    event
  });
});


app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    service: "IBEX Carwash Fase I API",
    realtime: "Socket.IO enabled",
    notificationsService: {
      enabled: NOTIFICATIONS_SERVICE_ENABLED,
      url: NOTIFICATIONS_SERVICE_URL
    },
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
  const seedData = {
    clients: [
      {
        name: "Cliente demo",
        phone: "555-0100",
        email: "cliente.demo@example.com"
      },
      {
        name: "María López",
        phone: "555-0120",
        email: "maria.lopez@example.com"
      },
      {
        name: "Carlos Gómez",
        phone: "555-0130",
        email: "carlos.gomez@example.com"
      }
    ],
    guardians: [
      {
        name: "Tutor demo",
        phone: "555-0110",
        email: "tutor.demo@example.com"
      },
      {
        name: "Ana Rodríguez",
        phone: "555-0140",
        email: "ana.rodriguez@example.com"
      },
      {
        name: "Luis Hernández",
        phone: "555-0150",
        email: "luis.hernandez@example.com"
      }
    ],
    students: [
      {
        name: "Estudiante demo",
        guardianName: "Tutor demo",
        status: "activo",
        skills: "Puntualidad, atención al cliente"
      },
      {
        name: "Sofía Martínez",
        guardianName: "Ana Rodríguez",
        status: "activo",
        skills: "Trabajo en equipo, secado exterior"
      },
      {
        name: "Diego Pérez",
        guardianName: "Luis Hernández",
        status: "activo",
        skills: "Organización, preparación de material"
      }
    ],
    vehicles: [
      {
        clientName: "Cliente demo",
        description: "SUV gris",
        plate: "DEMO-001"
      },
      {
        clientName: "María López",
        description: "Sedán blanco",
        plate: "ML-204"
      },
      {
        clientName: "Carlos Gómez",
        description: "Pickup negra",
        plate: "CG-318"
      }
    ],
    projects: [
      {
        name: "Jornada IBEX Sábado",
        date: "2026-02-07",
        status: "planeada",
        objective: "Coordinar slots de lavado exterior"
      },
      {
        name: "Jornada IBEX Domingo",
        date: "2026-02-08",
        status: "planeada",
        objective: "Atender reservas de práctica prelaboral"
      },
      {
        name: "Campaña Comunidad IBEX",
        date: "2026-02-14",
        status: "activa",
        objective: "Validar operación con más clientes y estudiantes"
      }
    ],
    tasks: [
      {
        title: "Preparar material de lavado",
        projectName: "Jornada IBEX Sábado",
        assignedTo: "Estudiante demo",
        status: "pendiente",
        priority: "media"
      },
      {
        title: "Recibir cliente y confirmar reserva",
        projectName: "Jornada IBEX Domingo",
        assignedTo: "Sofía Martínez",
        status: "en progreso",
        priority: "alta"
      },
      {
        title: "Organizar área de secado",
        projectName: "Campaña Comunidad IBEX",
        assignedTo: "Diego Pérez",
        status: "pendiente",
        priority: "media"
      }
    ],
    slots: [
      {
        date: "2026-02-07",
        startTime: "09:00",
        durationMinutes: "30",
        capacity: "3",
        location: "IBEX Carwash"
      },
      {
        date: "2026-02-07",
        startTime: "09:30",
        durationMinutes: "30",
        capacity: "3",
        location: "IBEX Carwash"
      },
      {
        date: "2026-02-07",
        startTime: "10:00",
        durationMinutes: "60",
        capacity: "2",
        location: "IBEX Carwash"
      }
    ],
    bookings: [
      {
        clientName: "Cliente demo",
        vehicleDescription: "SUV gris",
        slotLabel: "2026-02-07 09:00",
        serviceName: "Lavado exterior",
        status: "confirmada"
      },
      {
        clientName: "María López",
        vehicleDescription: "Sedán blanco",
        slotLabel: "2026-02-07 09:30",
        serviceName: "Lavado exterior",
        status: "confirmada"
      },
      {
        clientName: "Carlos Gómez",
        vehicleDescription: "Pickup negra",
        slotLabel: "2026-02-07 10:00",
        serviceName: "Lavado exterior",
        status: "en proceso"
      }
    ]
  };

  let inserted = 0;

  for (const [resource, records] of Object.entries(seedData)) {
    const existingRecords = await listRecords(resource);
    const existingLabels = new Set(
      existingRecords.map((item) =>
        item.name ||
        item.title ||
        item.description ||
        `${item.date || ""} ${item.startTime || ""}`.trim() ||
        `${item.clientName || ""}-${item.slotLabel || ""}`
      )
    );

    for (const record of records) {
      const label =
        record.name ||
        record.title ||
        record.description ||
        `${record.date || ""} ${record.startTime || ""}`.trim() ||
        `${record.clientName || ""}-${record.slotLabel || ""}`;

      if (!existingLabels.has(label)) {
        await insertRecord(resource, record);
        inserted += 1;
      }
    }
  }

  if (inserted > 0) {
    await addActivity("system:seeded", `Datos iniciales enriquecidos: ${inserted} registros agregados`);
  }
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
