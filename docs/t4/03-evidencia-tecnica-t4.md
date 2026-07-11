# T4 - Evidencia técnica consolidada

## Resumen de implementación

IBEX Carwash Fase II extiende la aplicación de Fase I con arquitectura modular, microservicio de notificaciones, eventos en tiempo real, Docker Compose y pruebas de rendimiento.

La solución conserva la plataforma desplegada en producción y agrega una arquitectura reproducible localmente con Docker.

## Evidencia por rúbrica

### RUB01 - Arquitectura de microservicios

Implementación:

Backend principal Express.
Notifications Service como microservicio separado.
MongoDB Atlas como base de datos NoSQL administrada.
Comunicación backend -> notifications-service por HTTP interno.
Docker Compose para orquestar servicios.

Archivos:

backend/server.js
services/notifications-service/server.js
services/notifications-service/package.json
docker-compose.yml
docs/t4/01-arquitectura-t4.md
docs/t4/backend-notifications-integration-test.txt

Evidencia generada:

El backend principal envía un evento al microservicio de notificaciones.
El microservicio registra el evento.
El backend sigue funcionando aunque la integración esté separada.

Resultado clave:

BACKEND_NOTIFICATIONS_INTEGRATION_TESTS_OK

### RUB02 - Notificaciones en tiempo real

Implementación:

Socket.IO en backend.
socket.io-client en frontend.
Evento activity:new para actividad general.
Evento ibex:event para demostración T4.
Panel visual T4 en frontend.
Botón para disparar evento realtime.
Endpoint /api/t4/notify.

Archivos:

frontend/src/App.jsx
frontend/src/services/api.js
frontend/src/styles/main.css
backend/server.js
docs/t4/frontend-realtime-ui-test.txt

Evidencia generada:

El frontend tiene panel de notificaciones en tiempo real.
El panel muestra estado de Socket.IO.
El panel permite disparar evento T4.
El backend emite ibex:event al frontend.
El backend reenvía el evento al notifications-service.

Resultado clave:

FRONTEND_BUILD_OK

### RUB03 - Docker y despliegue

Implementación:

Dockerfile para backend.
Dockerfile para frontend.
Dockerfile para notifications-service.
docker-compose.yml con tres servicios.
Health checks para backend y notifications-service.
Variables de entorno externas para MongoDB Atlas.

Archivos:

backend/Dockerfile
frontend/Dockerfile
services/notifications-service/Dockerfile
docker-compose.yml
.dockerignore
scripts/t4/docker-check.sh
docs/t4/docker-check-results.txt
docs/t4/docker-evidence-plan.md

Evidencia generada:

Docker Compose construyó las imágenes.
Los tres contenedores levantaron.
Backend y notifications-service quedaron healthy.
Frontend respondió HTTP 200.
Backend container envió evento al notifications-service container.

Resultado clave:

T4_DOCKER_CHECK_DONE
DOCKER_EVIDENCE_OK

### RUB04 - Rendimiento y escalabilidad

Implementación:

Script de prueba de carga con Node.
Pruebas contra backend health.
Pruebas contra dashboard.
Pruebas contra notifications-service.
Pruebas del flujo backend -> notifications-service.

Archivos:

scripts/t4/load-test.mjs
docs/t4/performance-results.txt
docs/t4/performance-analysis.md

Resultados:

backend_health:
60 requests, 0 fallos, p95 13.38 ms.

backend_dashboard:
40 requests, 0 fallos, p95 822.25 ms.

notifications_health:
60 requests, 0 fallos, p95 10.84 ms.

backend_to_notifications_event:
30 requests, 0 fallos, p95 42.07 ms.

Resumen:
190 requests totales.
0 fallos.
SUMMARY ok true.
PERFORMANCE_TEST_OK.

## Capturas necesarias

### 01_frontend_realtime.png

Mostrar frontend local o producción con panel T4 de notificaciones en tiempo real.
Debe verse el estado Socket.IO y el panel de eventos.

Uso en reporte:
Evidencia de WebSockets, UI dinámica y notificaciones en tiempo real.

Uso en video:
Mostrar el panel y explicar que el frontend escucha eventos de Socket.IO.

### 02_microservices_structure.png

Mostrar árbol del proyecto con backend, frontend y services/notifications-service.

Uso en reporte:
Evidencia visual de separación por servicios.

Uso en video:
Explicar separación backend principal y notifications-service.

### 03_backend_notifications_integration.png

Mostrar docs/t4/backend-notifications-integration-test.txt o terminal con prueba exitosa.

Uso en reporte:
Evidencia de comunicación backend -> microservicio.

Uso en video:
Explicar que el backend reenvía eventos sin acoplar la responsabilidad de notificaciones.

### 04_docker_compose_file.png

Mostrar docker-compose.yml.

Uso en reporte:
Evidencia de orquestación Docker.

Uso en video:
Explicar servicios, puertos, health checks y dependencias.

### 05_docker_compose_up.png

Mostrar docker compose ps con los tres contenedores.

Uso en reporte:
Evidencia de contenedores corriendo.

Uso en video:
Mostrar backend, frontend y notifications-service.

### 06_docker_check_results.png

Mostrar docs/t4/docker-check-results.txt.

Uso en reporte:
Evidencia de health checks, frontend HTTP 200 e integración Docker.

Uso en video:
Mostrar que el backend container mandó evento al microservicio.

### 07_performance_results.png

Mostrar docs/t4/performance-results.txt.

Uso en reporte:
Evidencia de pruebas de carga.

Uso en video:
Mostrar 190 requests, 0 fallos y SUMMARY ok true.

### 08_github_t4_branch.png

Mostrar GitHub en rama t4 con commits.

Uso en reporte:
Evidencia de control de versiones y repositorio público.

Uso en video:
Mostrar rama y archivos principales.

### 09_git_log_tags.png

Mostrar terminal con git log y tags.

Uso en reporte:
Evidencia de versionamiento final.

Uso en video:
Mostrar t4-submit cuando exista.

## Guion breve de video

### Parte 1 - Introducción

Qué decir:
Esta es la Fase II de IBEX Carwash. La aplicación de Fase I fue extendida con microservicios, notificaciones en tiempo real, Docker Compose y pruebas de rendimiento.

Qué mostrar:
Frontend y repositorio.

### Parte 2 - Arquitectura

Qué decir:
La aplicación ahora separa frontend, backend principal y notifications-service. MongoDB Atlas se mantiene como base administrada y los servicios de aplicación se orquestan con Docker Compose.

Qué mostrar:
docs/t4/01-arquitectura-t4.md y estructura de carpetas.

### Parte 3 - Realtime

Qué decir:
El frontend escucha eventos por Socket.IO. El botón T4 dispara un evento al backend, el backend lo emite al frontend y también lo manda al microservicio de notificaciones.

Qué mostrar:
Panel T4 realtime en frontend.

### Parte 4 - Microservicio

Qué decir:
Notifications Service recibe eventos desde el backend, guarda un historial temporal y expone endpoints /health y /notifications.

Qué mostrar:
services/notifications-service/server.js y prueba backend-notifications-integration-test.txt.

### Parte 5 - Docker

Qué decir:
Docker Compose levanta backend, frontend y notifications-service. Los health checks validan disponibilidad antes de continuar.

Qué mostrar:
docker-compose.yml y docker compose ps.

### Parte 6 - Rendimiento

Qué decir:
Se ejecutó una prueba de carga con 190 requests contra cuatro endpoints. Todos terminaron sin fallos.

Qué mostrar:
docs/t4/performance-results.txt.

### Parte 7 - Cierre

Qué decir:
La solución cumple microservicios, realtime, Docker y rendimiento, manteniendo producción estable y usando Git para control de versiones.

Qué mostrar:
GitHub branch t4, commit log y tag t4-submit cuando exista.
