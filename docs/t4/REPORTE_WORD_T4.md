# Tarea 4. Fase II del proyecto IBEX Carwash

## Datos generales

Materia: Desarrollo Full Stack  
Proyecto: IBEX Carwash Fase II  
Repositorio público: https://github.com/rg4cyc/ibex-carwash-fase1  
Rama de trabajo: t4  
Frontend público: https://ibex.ccjira.io  
API pública: https://api-ibex.ccjira.io  
Demo local Docker: http://localhost:4000/t4-realtime-demo  

## Introducción

IBEX Carwash Fase II extiende la aplicación construida en Fase I mediante una arquitectura más modular, integración de microservicios, notificaciones en tiempo real, contenerización con Docker y pruebas de rendimiento.

El objetivo de esta fase fue escalar la solución sin romper la versión productiva existente. Para lograrlo, se mantuvo el frontend React/Vite, el backend Node.js/Express, MongoDB Atlas y Socket.IO, y se agregó un microservicio separado de notificaciones junto con Docker Compose para orquestar los servicios de aplicación.

La implementación conserva la base funcional del sistema y agrega evidencia técnica verificable para microservicios, realtime, Docker y rendimiento.

## Objetivos

El primer objetivo fue separar responsabilidades mediante un microservicio independiente para notificaciones. El segundo objetivo fue demostrar eventos en tiempo real usando Socket.IO. El tercer objetivo fue contenerizar la aplicación con Docker y Docker Compose. El cuarto objetivo fue validar la solución mediante pruebas de integración y rendimiento.

## Arquitectura general

La arquitectura de Fase II está compuesta por los siguientes elementos:

Frontend React/Vite.  
Backend principal Node.js/Express.  
Microservicio Notifications Service.  
Socket.IO para comunicación en tiempo real.  
MongoDB Atlas como base de datos NoSQL administrada.  
Docker Compose para orquestación local.  
GitHub como repositorio público y control de versiones.

El flujo principal es el siguiente:

Frontend  
→ Backend principal Express  
→ MongoDB Atlas  
→ Notifications Service  
→ Socket.IO  
→ Frontend con evento visible  

El backend principal mantiene la lógica de negocio de la aplicación. El microservicio de notificaciones se encarga de recibir eventos, guardarlos temporalmente y exponer endpoints de consulta. Esta separación permite que la responsabilidad de notificaciones no quede mezclada con la lógica principal del sistema.

## Microservicios implementados

### Backend principal

El backend principal está en la carpeta `backend`. Sus responsabilidades son recibir peticiones del frontend, consultar y modificar información en MongoDB Atlas, emitir eventos por Socket.IO y reenviar eventos importantes al microservicio de notificaciones.

Archivos principales:

`backend/server.js`  
`backend/Dockerfile`  
`backend/.env.example`  

El backend expone endpoints como `/api/health`, `/api/dashboard` y `/api/t4/notify`.

### Notifications Service

El microservicio de notificaciones está en la carpeta `services/notifications-service`. Su responsabilidad es recibir eventos desde el backend principal, almacenarlos temporalmente y exponer endpoints de verificación y consulta.

Archivos principales:

`services/notifications-service/server.js`  
`services/notifications-service/package.json`  
`services/notifications-service/Dockerfile`  

Endpoints principales:

`GET /health`  
`GET /notifications`  
`POST /events`  
`POST /notifications`  

La prueba aislada del microservicio se documentó en:

`docs/t4/notifications-service-test.txt`

Resultado clave:

`NOTIFICATIONS_SERVICE_TESTS_OK`

## Justificación de microservicios

La separación del servicio de notificaciones mejora la mantenibilidad porque reduce la responsabilidad del backend principal. También mejora la escalabilidad porque el servicio de notificaciones puede escalarse de manera independiente si el volumen de eventos crece.

Esta arquitectura también mejora la tolerancia a fallos. Si el servicio de notificaciones no está disponible, el backend principal puede continuar operando sus funciones esenciales. El backend fue diseñado para intentar publicar eventos y continuar funcionando aunque el microservicio no responda.

En una evolución futura, este servicio podría conectarse con Redis Pub/Sub, una cola de mensajes o una base de datos propia para persistencia extendida.

## Implementación de notificaciones en tiempo real

La aplicación usa Socket.IO para entregar eventos en tiempo real. El backend emite eventos de actividad y eventos T4 mediante `ibex:event`. El frontend o demo visual recibe el evento y lo muestra como notificación.

Para la evidencia T4 se agregó una demo estable servida desde el backend:

`http://localhost:4000/t4-realtime-demo`

Esta demo muestra el estado de Socket.IO, el health del backend, el resultado del envío del evento y la lista de eventos recibidos.

Flujo validado:

Usuario presiona el botón “Disparar evento realtime T4”.  
El navegador llama a `/api/t4/notify`.  
El backend recibe el evento.  
El backend emite el evento con Socket.IO.  
El backend reenvía el evento al Notifications Service.  
La UI muestra el evento recibido.  

La prueba técnica de Socket.IO se documentó en:

`docs/t4/socketio-realtime-test.txt`

Resultado clave:

`SOCKET_CONNECTED`  
`SOCKET_IBEX_EVENT_RECEIVED`  
`POST_STATUS=201`  
`POST_FORWARDED=true`  
`SOCKETIO_REALTIME_TEST_OK`

## Docker y Docker Compose

Se agregaron Dockerfiles para los tres servicios principales:

`backend/Dockerfile`  
`frontend/Dockerfile`  
`services/notifications-service/Dockerfile`  

También se agregó:

`docker-compose.yml`  
`.dockerignore`  
`scripts/t4/docker-check.sh`  

Docker Compose levanta los siguientes contenedores:

`ibex-backend` en el puerto 4000.  
`ibex-notifications-service` en el puerto 4010.  
`ibex-frontend` en el puerto 4173.  

El archivo `docker-compose.yml` define dependencias entre servicios, variables de entorno y health checks. El backend depende del microservicio de notificaciones. El frontend depende del backend.

MongoDB Atlas se mantiene como base de datos administrada externa. Esto evita exponer secretos o duplicar datos en un contenedor local. El backend toma `MONGODB_URI` desde el ambiente local y se conecta a la base real.

La evidencia Docker está en:

`docs/t4/docker-check-results.txt`

Resultados clave:

`COMPOSE_CONFIG_OK`  
Backend health correcto.  
Notifications health correcto.  
Frontend HTTP 200.  
Evento backend → notifications-service exitoso.  
`T4_DOCKER_CHECK_DONE`  

## Base de datos

La base de datos utilizada es MongoDB Atlas. Se conserva como servicio NoSQL administrado para mantener disponibilidad, respaldo y separación entre infraestructura de datos y servicios de aplicación.

El backend dentro del contenedor se conecta a MongoDB Atlas usando variables de entorno. Esta decisión protege credenciales y evita subir secretos al repositorio.

La evidencia del backend en Docker muestra:

`database":"mongodb"`

y también muestra conexión correcta en logs:

`MongoDB connected: ibex_carwash_fase1`

## Pruebas de integración

Se realizaron pruebas de integración entre backend principal y Notifications Service.

Archivo:

`docs/t4/backend-notifications-integration-test.txt`

La prueba validó:

Backend health correcto.  
Notifications Service health correcto.  
El backend reenvió un evento al microservicio.  
El microservicio recibió y registró el evento.  

Resultados clave:

`TEST_1_BACKEND_HEALTH_OK`  
`TEST_2_NOTIFICATIONS_HEALTH_OK`  
`TEST_3_BACKEND_FORWARDED_EVENT_OK`  
`TEST_4_NOTIFICATIONS_RECEIVED_BACKEND_EVENT_OK`  
`BACKEND_NOTIFICATIONS_INTEGRATION_TESTS_OK`  

## Pruebas de rendimiento

Se creó el script:

`scripts/t4/load-test.mjs`

El objetivo fue validar carga moderada sobre endpoints principales y sobre el flujo backend → notifications-service. La prueba se ejecutó con Docker Compose activo.

Archivo de resultados:

`docs/t4/performance-results.txt`

Resumen de resultados:

Backend health: 60 requests, 0 fallos, p95 de 13.38 ms.  
Backend dashboard: 40 requests, 0 fallos, p95 de 822.25 ms.  
Notifications health: 60 requests, 0 fallos, p95 de 10.84 ms.  
Backend to notifications event: 30 requests, 0 fallos, p95 de 42.07 ms.  

Total:

190 requests.  
0 fallos.  
`SUMMARY ok true`.  
`PERFORMANCE_TEST_OK`.  

## Análisis de rendimiento

Los endpoints de health respondieron con baja latencia porque ejecutan lógica ligera. El endpoint dashboard presentó mayor latencia porque consulta varias colecciones de MongoDB Atlas. Esto es esperado, ya que depende de acceso a base de datos y de la cantidad de colecciones consultadas.

El flujo backend → notifications-service respondió sin fallos. Esto demuestra que la separación de servicios no impidió la operación del sistema y que la comunicación entre contenedores funciona correctamente bajo carga moderada.

La arquitectura permite mejoras futuras como caché para dashboard, índices adicionales en MongoDB, Redis Adapter para Socket.IO y observabilidad centralizada.

## Seguridad y variables de entorno

No se subieron secretos al repositorio. La variable `MONGODB_URI` se maneja mediante `.env` local y está excluida por `.gitignore` y `.dockerignore`.

La configuración pública se documenta en archivos `.env.example`. Docker Compose usa variables externas para evitar exponer credenciales.

## Evidencia visual

Las capturas se guardaron en:

`assets/screenshots/t4/`

Capturas incluidas:

`01_frontend_realtime.png`  
Evidencia de demo realtime con Socket.IO conectado, evento T4, status 201 y forwarded true.

`02_microservices_structure.png`  
Evidencia de estructura con backend, frontend y services/notifications-service.

`03_backend_notifications_integration.png`  
Evidencia de prueba backend → notifications-service.

`04_docker_compose_file.png`  
Evidencia del archivo docker-compose.yml.

`05_docker_compose_up.png`  
Evidencia de contenedores levantados.

`06_docker_check_results.png`  
Evidencia de health checks e integración Docker.

`07_performance_results.png`  
Evidencia de pruebas de rendimiento.

`08_socketio_realtime_test.png`  
Evidencia de prueba técnica Socket.IO real.

`09_github_t4_branch.png`  
Evidencia del repositorio en rama t4.

## Instrucciones para ejecutar localmente

Primero se debe clonar el repositorio:

`git clone https://github.com/rg4cyc/ibex-carwash-fase1.git`

Después se entra al proyecto:

`cd ibex-carwash-fase1`

Se cambia a la rama T4:

`git checkout t4`

Se crea un archivo `.env` local con:

`MONGODB_URI=<cadena de conexión de MongoDB Atlas>`  
`DB_NAME=ibex_carwash_fase1`

Luego se levanta el stack:

`docker compose up --build`

URLs locales:

Backend health: `http://localhost:4000/api/health`  
Notifications health: `http://localhost:4010/health`  
Frontend: `http://localhost:4173`  
Demo realtime: `http://localhost:4000/t4-realtime-demo`  

Para ejecutar pruebas:

`node scripts/t4/test-notifications-service.mjs`  
`node scripts/t4/test-backend-notifications-integration.mjs`  
`node scripts/t4/test-socketio-realtime.mjs`  
`node scripts/t4/load-test.mjs`  

## Control de versiones

El trabajo se realizó en la rama:

`t4`

Commits principales:

`start t4 architecture and notifications service`  
`test t4 notifications service`  
`integrate backend with t4 notifications service`  
`add t4 realtime notification panel`  
`add t4 docker compose orchestration`  
`refresh t4 docker evidence`  
`add t4 performance load tests`  
`verify real socketio realtime flow`  
`add t4 evidence screenshots`  

El repositorio se mantiene público en GitHub:

https://github.com/rg4cyc/ibex-carwash-fase1

## Conclusión

La Fase II de IBEX Carwash logró extender la aplicación original con una arquitectura más escalable y modular. Se agregó un microservicio de notificaciones, se validó comunicación en tiempo real con Socket.IO, se contenerizaron los servicios principales con Docker Compose y se ejecutaron pruebas de rendimiento con cero fallos.

La solución mantiene producción estable y agrega una arquitectura local reproducible. La evidencia demuestra separación de responsabilidades, comunicación entre servicios, health checks, pruebas de carga y control de versiones en GitHub.

Como mejoras futuras se propone agregar Redis Adapter para escalar Socket.IO horizontalmente, caché para consultas de dashboard, persistencia propia para notificaciones y monitoreo centralizado de logs y métricas.
