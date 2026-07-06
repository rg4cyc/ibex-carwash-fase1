# Guion de video - Tarea 3 / Actividad 2

Duracion sugerida:
- 5 a 7 minutos.

## 1. Presentacion

Hola, en este video presento la Actividad 2 de la materia Full Stack. La plataforma base es IBEX Carwash Fase I, una aplicacion web para administrar clientes, tutores, estudiantes, vehiculos, jornadas, tareas, slots y reservas dentro de un programa prelaboral.

En las actividades anteriores se desarrollo y desplego la aplicacion. En esta actividad el enfoque es la administracion tecnica de la plataforma: hardware, servidor, base de datos, licitacion de monitoreo, seguridad, pruebas, metodologia Scrum y control de versiones con Git.

## 2. Arquitectura desplegada

La arquitectura esta dividida por capas.

El front-end esta desarrollado con React y Vite, y se despliega en AWS Amplify. La URL publica es https://ibex.ccjira.io.

El back-end esta desarrollado con Node.js y Express, corre en AWS Lightsail sobre Ubuntu 24.04 LTS, usa PM2 para mantener el proceso activo y Nginx como proxy inverso. El API publico esta en https://api-ibex.ccjira.io.

La base de datos esta en MongoDB Atlas, lo que permite separar los datos del servidor del API. Cloudflare administra DNS y HTTPS.

## 3. Eleccion de hardware y base de datos

Para la base de datos se eligio MongoDB Atlas en AWS N. Virginia. En esta fase se usa el tier inicial porque el volumen de datos es pequeño y el objetivo es demostrar persistencia, CRUD y administracion.

Para el API se utiliza AWS Lightsail con Ubuntu 24.04 LTS, 512 MB RAM, 2 vCPU y 20 GB SSD. Esta configuracion es suficiente para una carga academica de baja concurrencia. Para produccion real se recomienda escalar a una instancia de al menos 1 GB o 2 GB RAM y agregar monitoreo formal con alertas.

La decision separa responsabilidades: Amplify sirve el front-end, Lightsail ejecuta el API y MongoDB Atlas almacena los datos.

## 4. Licitacion de monitoreo y seguridad

Se evaluaron tres propuestas.

La primera es AWS CloudWatch, enfocada en infraestructura del servidor, CPU, red y alarmas.

La segunda es MongoDB Atlas Monitoring, enfocada en conexiones, lecturas, escrituras, almacenamiento y estado del cluster de base de datos.

La tercera es Cloudflare Analytics y Security, enfocada en DNS, HTTPS, trafico publico, errores de origen y seguridad perimetral.

La seleccion final es una combinacion hibrida: AWS CloudWatch para infraestructura, MongoDB Atlas Monitoring para base de datos y Cloudflare para trafico publico y seguridad. Esta combinacion es mejor que una sola herramienta porque la plataforma esta distribuida.

## 5. Pruebas manuales y automatizadas

La prueba manual se hizo en cinco pasos:
1. abrir el front-end publico;
2. verificar el API health;
3. crear un cliente;
4. editar un registro;
5. recargar la pagina y validar persistencia.

Tambien se implementaron tres pruebas automatizadas en el archivo scripts/tarea3-actividad2/automated-tests.mjs.

La primera prueba valida el health check del API.

La segunda prueba valida la integracion del dashboard con MongoDB.

La tercera prueba crea un cliente temporal, verifica que aparece en dashboard y luego lo elimina.

Ahora ejecuto el comando:

node scripts/tarea3-actividad2/automated-tests.mjs

El resultado esperado es AUTOMATED_TESTS_OK.

## 6. Depuracion

Durante la primera version de la prueba se intento validar PUT /clients/:id, pero esa ruta respondio 404 en el API publico. Se depuro el caso y se ajusto la prueba para validar endpoints confirmados: crear, consultar dashboard y eliminar.

Esto demuestra que la depuracion no fue teorica: se detecto un error, se identifico la causa y se ajusto la validacion.

## 7. Scrum

Se documento un proyecto Scrum para mejorar el front-end. En esta actividad asumo el rol de Product Owner.

El equipo Scrum incluye Product Owner, Scrum Master, desarrollador front-end, desarrollador back-end, QA y DevOps.

El backlog incluye mejoras de formularios, edicion, eliminacion, responsividad, errores comprensibles, feed en tiempo real, pruebas automatizadas, health check y documentacion.

El plan se divide en tres sprints:
- Sprint 1: estabilizacion de formularios y CRUD.
- Sprint 2: experiencia responsiva.
- Sprint 3: observabilidad, pruebas y calidad.

Tambien se documentan daily meetings, sprint reviews y retrospective.

## 8. Git y control de versiones

El repositorio publico es:

https://github.com/rg4cyc/ibex-carwash-fase1

Para esta actividad se utilizo la rama actividad-2-admin-servidores.

Se creo el tag tarea2-100-baseline para marcar el estado estable previo, y el tag tarea3-actividad2-submit para marcar la version final de entrega.

Tambien se documento como recuperar una version anterior mediante git checkout tarea2-100-baseline, como regresar a main y como crear una rama de recuperacion.

Esto demuestra ramas, flujo de trabajo, repositorio publico y recuperacion de versiones.

## 9. Cierre

Con esta actividad se demuestra que IBEX Carwash no solo funciona como aplicacion full stack, sino que tambien cuenta con administracion tecnica: seleccion de hardware, licitacion de monitoreo y seguridad, pruebas manuales y automatizadas, Scrum y control de versiones profesional.
