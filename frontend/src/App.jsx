import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { createResource, deleteResource, getDashboard, updateResource, SOCKET_URL } from "./services/api";

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
  slots: { date: "", startTime: "", durationMinutes: 30, capacity: 3, location: "IBEX Carwash" },
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
            con CRUD full stack y eventos en tiempo real.
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

function ResourceForm({ resource, form, setForm, onSubmit, isSaving }) {
  const fields = Object.keys(initialForms[resource]);

  return (
    <form className="formCard" onSubmit={onSubmit}>
      <h2>Crear {resources.find((item) => item.key === resource)?.label}</h2>
      <div className="formGrid">
        {fields.map((field) => (
          <label key={field}>
            <span>{fieldLabels[field] || field}</span>
            <input
              required={["name", "phone", "guardianName", "clientName", "description", "date", "startTime", "title", "projectName", "assignedTo", "vehicleDescription", "slotLabel", "serviceName"].includes(field)}
              value={form[field] ?? ""}
              type={field === "date" ? "date" : field === "capacity" || field === "durationMinutes" ? "number" : "text"}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={fieldLabels[field] || field}
            />
          </label>
        ))}
      </div>
      <button className="primaryButton" disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar registro"}
      </button>
    </form>
  );
}

function ResourceTable({ resource, items, onDelete, onStatusChange }) {
  const columns = Object.keys(initialForms[resource]);

  return (
    <section className="tableCard">
      <h2>{resources.find((item) => item.key === resource)?.label} registrados</h2>
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
                <tr key={item.id || item._id}>
                  {columns.slice(0, 4).map((column) => (
                    <td key={column}>{String(item[column] ?? "-")}</td>
                  ))}
                  <td className="actions">
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
                      onClick={() => onDelete(item.id || item._id)}
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

export default function App() {
  const [activeResource, setActiveResource] = useState("clients");
  const [dashboard, setDashboard] = useState({});
  const [activities, setActivities] = useState([]);
  const [forms, setForms] = useState(initialForms);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    socket.on("activity:new", (activity) => {
      setActivities((current) => [activity, ...current].slice(0, 20));
      loadDashboard().catch(() => {});
    });

    return () => socket.disconnect();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await createResource(activeResource, forms[activeResource]);
      setForms((current) => ({ ...current, [activeResource]: initialForms[activeResource] }));
      await loadDashboard();
      setMessage("Registro creado correctamente.");
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
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleStatusChange(task) {
    const order = ["pendiente", "en progreso", "completada"];
    const currentIndex = order.indexOf(task.status);
    const nextStatus = order[(currentIndex + 1) % order.length];

    try {
      await updateResource("tasks", task.id, { status: nextStatus });
      await loadDashboard();
      setMessage(`Tarea actualizada a: ${nextStatus}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <Header stats={stats} />
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
          />
          <ResourceTable
            resource={activeResource}
            items={dashboard[activeResource] || []}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </section>

        <LiveFeed activities={activities} />
      </main>
    </>
  );
}
