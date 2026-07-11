# Guion de video T4

## 1. Introducción

Qué decir:
Esta es la Fase II del proyecto IBEX Carwash. En esta fase extendí la aplicación original con microservicios, notificaciones en tiempo real, Docker Compose y pruebas de rendimiento.

Qué mostrar:
Repositorio en GitHub rama t4.
Frontend o demo realtime.

## 2. Arquitectura

Qué decir:
La arquitectura conserva frontend React, backend Express y MongoDB Atlas. Para Fase II se agregó un microservicio llamado notifications-service. El backend principal mantiene la lógica de negocio y el microservicio se encarga de recibir y registrar eventos.

Qué mostrar:
Estructura del proyecto.
docs/t4/01-arquitectura-t4.md.
services/notifications-service.

## 3. Realtime

Qué decir:
La demo realtime muestra Socket.IO conectado. Al presionar el botón, el backend recibe un evento, lo emite por Socket.IO y también lo reenvía al microservicio de notificaciones.

Qué mostrar:
http://localhost:4000/t4-realtime-demo
Botón Disparar evento realtime T4.
Evento recibido.
Status 201 y forwarded true.

## 4. Microservicio de notificaciones

Qué decir:
Notifications Service expone endpoints de health, eventos y notificaciones. La prueba de integración confirma que el backend puede enviar eventos y que el microservicio los recibe.

Qué mostrar:
docs/t4/backend-notifications-integration-test.txt.
services/notifications-service/server.js.

## 5. Docker Compose

Qué decir:
Docker Compose levanta tres servicios: backend, frontend y notifications-service. El backend se conecta a MongoDB Atlas mediante variables de entorno y se comunica internamente con el microservicio.

Qué mostrar:
docker-compose.yml.
docker compose ps.
docs/t4/docker-check-results.txt.

## 6. Rendimiento

Qué decir:
Se ejecutaron pruebas de carga contra health, dashboard, notifications-service y el flujo backend a notificaciones. En total se ejecutaron 190 requests con 0 fallos.

Qué mostrar:
docs/t4/performance-results.txt.

## 7. Cierre

Qué decir:
Con esto se cumple la separación por microservicios, notificaciones en tiempo real, contenerización con Docker y validación de rendimiento. El código está versionado en GitHub en la rama t4.

Qué mostrar:
GitHub rama t4.
Capturas en assets/screenshots/t4.
