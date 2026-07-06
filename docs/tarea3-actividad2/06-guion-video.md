# Guion de video - Tarea 3 / Actividad 2

Duración sugerida:
- 4 a 6 minutos.

## 1. Presentación

Hola, en este video presento la Actividad 2 de la plataforma IBEX Carwash Fase I. La aplicación permite administrar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas dentro de un programa prelaboral.

La plataforma ya fue desarrollada en las actividades anteriores, y en esta entrega me enfoco en la administración técnica: infraestructura, hardware, monitoreo, seguridad, pruebas, Scrum y control de versiones.

## 2. Arquitectura desplegada

La arquitectura está dividida en varias capas.

El front-end está desarrollado con React y Vite, y se despliega en AWS Amplify. El dominio público es https://ibex.ccjira.io.

El back-end está desarrollado con Node.js y Express, se ejecuta en AWS Lightsail sobre Ubuntu 24.04 LTS, usa PM2 para mantener el proceso activo y Nginx como proxy inverso. El API se expone mediante https://api-ibex.ccjira.io.

La base de datos está en MongoDB Atlas. Esto separa la persistencia del servidor del API y permite mayor disponibilidad y administración.

Cloudflare se utiliza para DNS y HTTPS.

## 3. Selección de hardware y servidor

Para la base de datos se eligió MongoDB Atlas en AWS N. Virginia. Para esta fase se usa el tier gratuito porque el volumen de datos es pequeño y el objetivo es validar persistencia y administración. Para producción real se propone escalar a un cluster dedicado M10 o superior.

Para el API se usa AWS Lightsail con Ubuntu 24.04 LTS, 512 MB RAM, 2 vCPU y 20 GB SSD. Es suficiente para una carga académica y permite demostrar despliegue real. Para producción se recomienda subir a 1 GB o 2 GB RAM.

## 4. Monitoreo y seguridad

Se proponen tres herramientas principales.

AWS CloudWatch para métricas de infraestructura y alarmas.

MongoDB Atlas Monitoring para conexiones, lecturas, escrituras y estado de la base de datos.

Cloudflare Analytics y Security para DNS, HTTPS, errores de origen y protección básica.

Las credenciales no están en GitHub. Se usan variables de entorno en el servidor. El API tiene CORS limitado a los dominios autorizados.

## 5. Pruebas

Se realizó una prueba manual de cinco pasos:
- abrir el front-end público;
- verificar el API health;
- crear un cliente;
- editar un registro;
- recargar y validar persistencia.

Además, se agregaron tres pruebas automatizadas:
- health check;
- validación del dashboard;
- CRUD de cliente temporal.

Voy a ejecutar el script de pruebas para demostrarlo.

Comando:
`node scripts/tarea3-actividad2/automated-tests.mjs`

## 6. Scrum

Se documentó un proyecto Scrum con Product Owner, Scrum Master y equipo de desarrollo. El backlog incluye mejoras de formularios, responsividad, validaciones, feed en tiempo real y pruebas.

El plan se divide en tres sprints:
- estabilización de formularios;
- experiencia responsiva;
- observabilidad y calidad.

## 7. Control de versiones

El repositorio está en GitHub. Para esta entrega se creó una rama llamada `actividad-2-admin-servidores`, un tag base `tarea2-100-baseline` y un tag final `tarea3-actividad2-submit`.

Esto demuestra que se puede recuperar una versión anterior, trabajar en ramas, documentar cambios y mantener trazabilidad.

## 8. Cierre

Con esta actividad se demuestra que la plataforma no solo funciona como aplicación, sino que también cuenta con administración técnica, pruebas, monitoreo propuesto, seguridad básica, metodología Scrum y control de versiones profesional.
