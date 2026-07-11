# T4 - Evidencia Docker

## Servicios contenerizados

Backend principal:
Contenedor ibex-backend.
Puerto local 4000.
Endpoint de verificación /api/health.
Responsabilidad: API principal, MongoDB Atlas, Socket.IO y envío de eventos al microservicio.

Notifications Service:
Contenedor ibex-notifications-service.
Puerto local 4010.
Endpoint de verificación /health.
Responsabilidad: recepción y almacenamiento temporal de eventos de notificación.

Frontend:
Contenedor ibex-frontend.
Puerto local 4173.
Responsabilidad: interfaz React/Vite compilada y servida como build de producción.

## Orquestación

Docker Compose levanta los tres servicios y define dependencias entre ellos. El backend depende del microservicio de notificaciones y el frontend depende del backend.

## Variables

MONGODB_URI se toma del ambiente local para evitar subir secretos al repositorio.
DB_NAME usa ibex_carwash_fase1 por defecto.
NOTIFICATIONS_SERVICE_URL apunta a http://notifications-service:4010 dentro de la red de Docker Compose.

## Evidencia esperada

docker compose config --quiet debe pasar.
docker compose up --build debe levantar tres contenedores.
http://localhost:4000/api/health debe responder ok.
http://localhost:4010/health debe responder ok.
http://localhost:4173 debe responder HTTP 200.
POST /api/t4/notify debe registrar evento en notifications-service.
