require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = Number(process.env.NOTIFICATIONS_PORT || process.env.PORT || 4010);
const MAX_EVENTS = Number(process.env.NOTIFICATIONS_MAX_EVENTS || 100);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://ibex.ccjira.io"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));

app.use(express.json({ limit: "1mb" }));

const notifications = [];

function addNotification(payload) {
  const notification = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: payload.type || "system.event",
    title: payload.title || "IBEX notification",
    message: payload.message || "Event received",
    source: payload.source || "unknown",
    entity: payload.entity || null,
    createdAt: new Date().toISOString()
  };

  notifications.unshift(notification);

  if (notifications.length > MAX_EVENTS) {
    notifications.splice(MAX_EVENTS);
  }

  return notification;
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "IBEX Notifications Service",
    version: "1.0.0",
    maxEvents: MAX_EVENTS,
    storedEvents: notifications.length,
    timestamp: new Date().toISOString()
  });
});

app.get("/notifications", (req, res) => {
  res.json({
    ok: true,
    count: notifications.length,
    notifications
  });
});

app.post("/notifications", (req, res) => {
  const notification = addNotification(req.body || {});
  res.status(201).json({
    ok: true,
    notification
  });
});

app.post("/events", (req, res) => {
  const notification = addNotification({
    type: req.body?.type || "app.event",
    title: req.body?.title || "Application event",
    message: req.body?.message || "Application event received",
    source: req.body?.source || "backend",
    entity: req.body?.entity || null
  });

  res.status(201).json({
    ok: true,
    notification
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "not_found",
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`IBEX Notifications Service listening on port ${PORT}`);
});
