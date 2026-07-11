import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { createResource, deleteResource, getDashboard, sendT4Notification, updateResource, SOCKET_URL } from "./services/api";

const resources = [
  { key: "clients", label: "Clientes" },
  { key: "guardians", label: "Tutores" },
  { key: "students", label: "Estudiantes" },
  { key: "vehicles", label: "Vehículos" },
  { key: "projects", label: "Jornadas" },
  { key: "tasks", label: "Tareas" },
  { key: "slots", label: "Slots" },
  { key: "bookings", label: "Reservas" }
];

const initialForms = {
  clients: { name: "", phone: "", email: "" },
  guardians: { name: "", phone: "", email: "" },
  students: { name: "", guardianName: "", status: "activo", skills: "" },
  vehicles: { clientName: "", description: "", plate: "" },
  projects: { name: "", date: "", status: "planeada", objective: "" },
  tasks: { title: "", projectName: "", assignedTo: "", status: "pendiente", priority: "media" },
  slots: { date: "", startTime: "09:00", durationMinutes: "30", capacity: "3", location: "IBEX Carwash" },
  bookings: { clientName: "", vehicleDescription: "", slotLabel: "", serviceName: "Lavado exterior", status: "confirmada" }
};

const fieldLabels = {
  name: "Nombre",
  phone: "Teléfono",
  email: "Email",
  guardianName: "Tutor",
  status: "Estado",
  skills: "Habilidades",
  clientName: "Cliente",
  description: "Descripción",
  plate: "Placa",
  date: "Fecha",
  objective: "Objetivo",
  title: "Título",
  projectName: "Jornada",
  assignedTo: "Asignado a",
  priority: "Prioridad",
  startTime: "Hora inicio",
  durationMinutes: "Duración",
  capacity: "Cupo",
  location: "Ubicación",
  vehicleDescription: "Vehículo",
  slotLabel: "Slot",
  serviceName: "Servicio"
};

const requiredFields = [
  "name",
  "phone",
  "guardianName",
  "clientName",
  "description",
  "date",
  "startTime",
  "title",
  "projectName",
  "assignedTo",
  "vehicleDescription",
  "slotLabel",
  "serviceName"
];

const timeOptions = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00"
];

function getRecordId(item) {
  return item.id || item._id;
}

function Header({ stats }) {
  return (
    <header className="hero">
      <nav className="nav">
        <span className="brand">IBEX Carwash Fase I</span>
        <span className="pill">React + Express + MongoDB + Socket.IO</span>
      </nav>

      <section className="heroGrid">
        <div>
          <p className="eyebrow">Sistema de gestión operativa</p>
          <h1>Gestión de jornadas, tareas, estudiantes, clientes y reservas</h1>
          <p className="heroText">
            Major release de IBEX Carwash Slots para administrar el programa prelaboral
            con CRUD full stack, catálogos relacionados y eventos en tiempo real.
          </p>
        </div>

        <div className="statsCard">
          <strong>{stats.tasks || 0}</strong>
          <span>Tareas</span>
          <strong>{stats.students || 0}</strong>
          <span>Estudiantes</span>
          <strong>{stats.bookings || 0}</strong>
          <span>Reservas</span>
        </div>
      </section>
    </header>
  );
}

function ResourceTabs({ active, setActive }) {
  return (
    <div className="tabs">
      {resources.map((resource) => (
        <button
          key={resource.key}
          className={active === resource.key ? "tab active" : "tab"}
          onClick={() => setActive(resource.key)}
        >
          {resource.label}
        </button>
      ))}
    </div>
  );
}

function buildOptions(resource, field, dashboard, currentValue) {
  let options = [];

  const relationFields = new Set([
    "guardianName",
    "clientName",
    "vehicleDescription",
    "projectName",
    "assignedTo",
    "slotLabel",
    "serviceName"
  ]);

  const controlledFields = new Set([
    "startTime",
    "durationMinutes",
    "status",
    "priority"
  ]);

  if (!relationFields.has(field) && !controlledFields.has(field)) {
    return [];
  }

  if (field === "clientName") {
    options = (dashboard.clients || []).map((client) => client.name).filter(Boolean);
  }

  if (field === "guardianName") {
    options = (dashboard.guardians || []).map((guardian) => guardian.name).filter(Boolean);
  }

  if (field === "vehicleDescription") {
    options = (dashboard.vehicles || []).map((vehicle) => vehicle.description).filter(Boolean);
  }

  if (field === "projectName") {
    options = (dashboard.projects || []).map((project) => project.name).filter(Boolean);
  }

  if (field === "assignedTo") {
    options = (dashboard.students || []).map((student) => student.name).filter(Boolean);
  }

  if (field === "slotLabel") {
    options = (dashboard.slots || [])
      .map((slot) => `${slot.date || ""} ${slot.startTime || ""}`.trim())
      .filter(Boolean);
  }

  if (field === "serviceName") {
    options = ["Lavado exterior"];
  }

  if (field === "startTime" && resource === "slots") {
    options = timeOptions;
  }

  if (field === "durationMinutes" && resource === "slots") {
    options = ["30", "60"];
  }

  if (field === "status" && resource === "tasks") {
    options = ["pendiente", "en progreso", "completada"];
  }

  if (field === "status" && resource === "bookings") {
    options = ["confirmada", "en proceso", "completada", "cancelada"];
  }

  if (field === "status" && resource === "projects") {
    options = ["planeada", "activa", "cerrada"];
  }

  if (field === "status" && resource === "students") {
    options = ["activo", "inactivo"];
  }

  if (field === "priority") {
    options = ["baja", "media", "alta"];
  }

  const unique = [...new Set(options)];
  if (currentValue && relationFields.has(field) && !unique.includes(String(currentValue))) {
    unique.unshift(String(currentValue));
  }

  return unique;
}

function ResourceForm({
  resource,
  form,
  setForm,
  onSubmit,
  isSaving,
  dashboard,
  editingRecord,
  onCancelEdit
}) {
  const fields = Object.keys(initialForms[resource]);
  const resourceLabel = resources.find((item) => item.key === resource)?.label;

  function renderField(field) {
    const value = form[field] ?? "";
    const options = buildOptions(resource, field, dashboard, value);
    const isRequired = requiredFields.includes(field);

    if (options.length > 0) {
      return (
        <select
          required={isRequired}
          value={String(value)}
          onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
        >
          <option value="">Selecciona {fieldLabels[field] || field}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        required={isRequired}
        value={value}
        type={field === "date" ? "date" : field === "capacity" ? "number" : "text"}
        min={field === "capacity" ? "1" : undefined}
        onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
        placeholder={fieldLabels[field] || field}
      />
    );
  }

  return (
    <form className="formCard" onSubmit={onSubmit}>
      <div className="formHeader">
        <div>
          <h2>{editingRecord ? `Editar ${resourceLabel}` : `Crear ${resourceLabel}`}</h2>
          {resource === "bookings" && (
            <p className="helperText">
              Selecciona cliente, vehículo y slot desde catálogos existentes. La reserva ya no se captura manualmente.
            </p>
          )}
          {resource === "tasks" && (
            <p className="helperText">
              Asigna tareas a una jornada y a un estudiante registrado.
            </p>
          )}
          {resource === "slots" && (
            <p className="helperText">
              La hora solo permite bloques de media hora. La duración actual permitida es 30 o 60 minutos.
            </p>
          )}
        </div>

        {editingRecord && (
          <button type="button" className="secondaryButton" onClick={onCancelEdit}>
            Cancelar edición
          </button>
        )}
      </div>

      <div className="formGrid">
        {fields.map((field) => (
          <label key={field}>
            <span>{fieldLabels[field] || field}</span>
            {renderField(field)}
          </label>
        ))}
      </div>

      <button className="primaryButton" disabled={isSaving}>
        {isSaving ? "Guardando..." : editingRecord ? "Actualizar registro" : "Guardar registro"}
      </button>
    </form>
  );
}

function ResourceTable({ resource, items, onEdit, onDelete, onStatusChange }) {
  const columns = Object.keys(initialForms[resource]);
  const resourceLabel = resources.find((item) => item.key === resource)?.label;

  return (
    <section className="tableCard">
      <h2>{resourceLabel} registrados</h2>
      {items.length === 0 ? (
        <p className="muted">No hay registros todavía.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                {columns.slice(0, 4).map((column) => (
                  <th key={column}>{fieldLabels[column] || column}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={getRecordId(item)}>
                  {columns.slice(0, 4).map((column) => (
                    <td key={column}>{String(item[column] ?? "-")}</td>
                  ))}
                  <td className="actions">
                    <button
                      className="editButton"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                    {resource === "tasks" && (
                      <button
                        className="smallButton"
                        onClick={() => onStatusChange(item)}
                      >
                        Avanzar estado
                      </button>
                    )}
                    <button
                      className="dangerButton"
                      onClick={() => onDelete(getRecordId(item))}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function LiveFeed({ activities }) {
  return (
    <aside className="feedCard">
      <h2>Feed en tiempo real</h2>
      <p className="muted">Eventos recibidos con Socket.IO.</p>
      <div className="feed">
        {activities.slice(0, 10).map((activity) => (
          <article key={activity.id || activity.createdAt} className="feedItem">
            <strong>{activity.type}</strong>
            <span>{activity.message}</span>
            <small>{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ""}</small>
          </article>
        ))}
      </div>
    </aside>
  );
}

function ArchitecturePanel() {
  return (
    <section className="architecture">
      <h2>Arquitectura Fase I</h2>
      <div className="archGrid">
        <div>React + Vite<br /><span>ibex.ccjira.io</span></div>
        <div>Fetch API</div>
        <div>Node.js + Express<br /><span>api-ibex.ccjira.io</span></div>
        <div>Socket.IO<br /><span>Eventos en tiempo real</span></div>
        <div>MongoDB Atlas<br /><span>Base de datos</span></div>
      </div>
    </section>
  );
}

export default 
function T4RealtimePanel({ status, notifications, onSendTestEvent, isSending }) {
  const statusLabel = {
    connected: "Conectado",
    connecting: "Conectando",
    disconnected: "Desconectado"
  }[status] || status;

  return (
    <section className="t4RealtimePanel">
      <div className="t4RealtimeHeader">
        <div>
          <p className="eyebrow">T4 / Fase II</p>
          <h2>Notificaciones en tiempo real</h2>
          <p className="muted">
            Panel de evidencia para WebSockets, eventos dinámicos y separación con notifications-service.
          </p>
        </div>

        <div className={`socketStatus ${status}`}>
          Socket.IO: {statusLabel}
        </div>
      </div>

      <div className="t4RealtimeActions">
        <button type="button" onClick={onSendTestEvent} disabled={isSending}>
          {isSending ? "Enviando evento..." : "Disparar evento realtime T4"}
        </button>
        <span>
          El backend publica el evento, Socket.IO lo entrega al frontend y el microservicio registra la notificación.
        </span>
      </div>

      <div className="t4NotificationList">
        {notifications.length === 0 ? (
          <p className="muted">Aún no hay eventos T4 recibidos en esta sesión.</p>
        ) : (
          notifications.map((item) => (
            <article key={item.id || item.createdAt} className="t4NotificationItem">
              <strong>{item.title || item.type || "Evento realtime"}</strong>
              <span>{item.message || "Evento recibido por Socket.IO"}</span>
              <small>{item.createdAt || "timestamp pendiente"}</small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}


function App() {
  const [activeResource, setActiveResource] = useState("clients");
  const [dashboard, setDashboard] = useState({});
  const [activities, setActivities] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [isSendingT4Event, setIsSendingT4Event] = useState(false);
  const [forms, setForms] = useState(initialForms);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const stats = useMemo(() => {
    return resources.reduce((acc, resource) => {
      acc[resource.key] = dashboard[resource.key]?.length || 0;
      return acc;
    }, {});
  }, [dashboard]);

  async function loadDashboard() {
    const data = await getDashboard();
    setDashboard(data);
    setActivities(data.activities || []);
  }

  useEffect(() => {
    loadDashboard().catch((error) => setMessage(error.message));

    const socket = io(SOCKET_URL);

    setRealtimeStatus("connecting");

    socket.on("connect", () => {
      setRealtimeStatus("connected");
    });

    socket.on("disconnect", () => {
      setRealtimeStatus("disconnected");
    });
    socket.on("activity:new", (activity) => {
      setActivities((current) => [activity, ...current].slice(0, 20));
      loadDashboard().catch(() => {});
    });

    
    socket.on("ibex:event", (event) => {
      setRealtimeNotifications((current) => [
        {
          id: `${event.type || "ibex:event"}-${event.createdAt || Date.now()}`,
          title: event.title || "Evento realtime T4",
          message: event.message || "Evento recibido por Socket.IO",
          createdAt: event.createdAt || new Date().toISOString(),
          type: event.type || "ibex:event"
        },
        ...current
      ].slice(0, 5));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    setEditingRecord(null);
    setForms((current) => ({ ...current, [activeResource]: initialForms[activeResource] }));
  }, [activeResource]);

  function handleEdit(item) {
    const cleanForm = { ...initialForms[activeResource] };
    Object.keys(cleanForm).forEach((field) => {
      cleanForm[field] = item[field] ?? cleanForm[field];
    });

    setEditingRecord(item);
    setForms((current) => ({ ...current, [activeResource]: cleanForm }));
    window.scrollTo({ top: 260, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingRecord(null);
    setForms((current) => ({ ...current, [activeResource]: initialForms[activeResource] }));
  }

  
  async function handleSendT4RealtimeEvent() {
    setIsSendingT4Event(true);

    try {
      await sendT4Notification({
        type: "t4.frontend.demo",
        title: "Evento realtime T4",
        message: "Evento disparado desde la interfaz para demostrar WebSockets y notifications-service",
        entity: {
          module: "frontend",
          feature: "realtime-notifications",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      setRealtimeNotifications((current) => [
        {
          id: `t4-error-${Date.now()}`,
          title: "Error al enviar evento T4",
          message: error.message,
          createdAt: new Date().toISOString(),
          type: "t4.error"
        },
        ...current
      ].slice(0, 5));
    } finally {
      setIsSendingT4Event(false);
    }
  }

async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (editingRecord) {
        await updateResource(activeResource, getRecordId(editingRecord), forms[activeResource]);
        setMessage("Registro actualizado correctamente.");
      } else {
        await createResource(activeResource, forms[activeResource]);
        setMessage("Registro creado correctamente.");
      }

      setEditingRecord(null);
      setForms((current) => ({ ...current, [activeResource]: initialForms[activeResource] }));
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    setMessage("");

    try {
      await deleteResource(activeResource, id);
      await loadDashboard();
      setMessage("Registro eliminado correctamente.");

      if (editingRecord && getRecordId(editingRecord) === id) {
        handleCancelEdit();
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleStatusChange(task) {
    const order = ["pendiente", "en progreso", "completada"];
    const currentIndex = order.indexOf(task.status);
    const nextStatus = order[(currentIndex + 1) % order.length];

    try {
      await updateResource("tasks", getRecordId(task), { status: nextStatus });
      await loadDashboard();
      setMessage(`Tarea actualizada a: ${nextStatus}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <Header stats={stats} />
      

      <T4RealtimePanel

        status={realtimeStatus}

        notifications={realtimeNotifications}

        onSendTestEvent={handleSendT4RealtimeEvent}

        isSending={isSendingT4Event}

      />
<main className="layout">
        <section>
          <ArchitecturePanel />
          <ResourceTabs active={activeResource} setActive={setActiveResource} />
          {message && <p className="message">{message}</p>}
          <ResourceForm
            resource={activeResource}
            form={forms[activeResource]}
            setForm={(updater) =>
              setForms((current) => ({
                ...current,
                [activeResource]:
                  typeof updater === "function" ? updater(current[activeResource]) : updater
              }))
            }
            onSubmit={handleSubmit}
            isSaving={isSaving}
            dashboard={dashboard}
            editingRecord={editingRecord}
            onCancelEdit={handleCancelEdit}
          />
          <ResourceTable
            resource={activeResource}
            items={dashboard[activeResource] || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </section>

        <LiveFeed activities={activities} />
      </main>
    </>
  );
}
