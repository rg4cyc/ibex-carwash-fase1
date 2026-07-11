# Guion final de video T4

Duración sugerida: 5 a 7 minutos.

## 1. Presentación del proyecto

Qué decir:
Esta es la Fase II del proyecto IBEX Carwash. En esta fase extendí la aplicación original con microservicios, notificaciones en tiempo real, Docker Compose, pruebas de rendimiento y despliegue en AWS Lightsail.

Qué mostrar:
Repositorio GitHub en rama main.
Tag t4-submit.
URL pública: https://api-ibex.ccjira.io/t4-realtime-demo

## 2. Arquitectura Fase II

Qué decir:
La arquitectura mantiene el frontend React, backend Express y MongoDB Atlas. Para Fase II agregué un microservicio independiente llamado notifications-service. El backend principal conserva la lógica del sistema y reenvía eventos al microservicio de notificaciones.

Qué mostrar:
Estructura del repositorio.
Carpetas backend, frontend y services/notifications-service.
Archivo docker-compose.yml.

## 3. Microservicio de notificaciones

Qué decir:
El microservicio de notificaciones expone endpoints de health, eventos y notificaciones. Está separado del backend principal para mejorar mantenibilidad y escalabilidad.

Qué mostrar:
services/notifications-service/server.js
docs/t4/backend-notifications-integration-test.txt

Frase clave:
La prueba confirma que el backend puede enviar eventos al microservicio y que el microservicio los registra correctamente.

## 4. Notificaciones en tiempo real con Socket.IO

Qué decir:
La demo pública usa Socket.IO. Cuando presiono el botón, el navegador llama al backend, el backend emite un evento realtime y también reenvía el evento al microservicio.

Qué mostrar:
https://api-ibex.ccjira.io/t4-realtime-demo

Acción:
Presionar “Disparar evento realtime T4”.

Debe verse:
Socket.IO conectado.
database=mongodb.
Último POST status=201.
forwarded=true.
Eventos recibidos en pantalla.

## 5. Docker Compose

Qué decir:
Los servicios de Fase II están contenerizados con Docker. Docker Compose levanta backend, frontend y notifications-service. En Lightsail se desplegaron en paralelo a la producción existente para no interrumpir el sistema original.

Qué mostrar:
docker-compose.yml
docker-compose.lightsail.yml
assets/screenshots/t4/10_docker_containers_running.png
docs/t4/lightsail-docker-deploy-evidence.txt

Frase clave:
La versión T4 corre en AWS Lightsail con Docker Compose y es expuesta por Nginx a través de HTTPS.

## 6. Despliegue en Lightsail

Qué decir:
La demo pública está desplegada en AWS Lightsail. Nginx enruta la ruta /t4-realtime-demo hacia el backend Docker T4. El backend en contenedor se conecta a MongoDB Atlas y al microservicio de notificaciones.

Qué mostrar:
https://api-ibex.ccjira.io/t4-realtime-demo
docs/t4/lightsail-docker-deploy-evidence.txt

Datos clave:
HTTPS demo HTTP/2 200.
Notifications Service healthy.
Evento público forwardedToNotificationsService true.

## 7. Pruebas de rendimiento

Qué decir:
Se ejecutaron pruebas de carga con 190 requests totales y 0 fallos. Las pruebas cubren health del backend, dashboard, health de notificaciones y flujo backend a notifications-service.

Qué mostrar:
docs/t4/performance-results.txt

Datos clave:
totalFailed 0.
SUMMARY ok true.
PERFORMANCE_TEST_OK.

## 8. Evidencias y control de versiones

Qué decir:
El proyecto está versionado en GitHub. La entrega final está en main y marcada con el tag t4-submit. También incluí capturas, evidencias técnicas, reporte y guion de video.

Qué mostrar:
GitHub main.
Tag t4-submit.
assets/screenshots/t4.
docs/t4/REPORTE_WORD_T4.md.

## 9. Cierre

Qué decir:
Con esto se cumple Fase II: microservicios, notificaciones en tiempo real, Docker Compose, despliegue en Lightsail, pruebas de rendimiento, evidencia técnica y control de versiones.

