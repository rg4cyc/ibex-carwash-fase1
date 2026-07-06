# Reporte Tarea 3 / Actividad 2 - Administracion de plataforma digital

## Proyecto

IBEX Carwash Fase I

## Enlaces

- Front-end publico: https://ibex.ccjira.io
- API publico: https://api-ibex.ccjira.io
- Repositorio publico: https://github.com/rg4cyc/ibex-carwash-fase1
- Video publico: PENDIENTE_DE_AGREGAR

## Introduccion

La plataforma IBEX Carwash Fase I es una aplicacion web full stack orientada a administrar un programa prelaboral de lavado exterior de autos. El sistema permite gestionar clientes, tutores, estudiantes, vehiculos, jornadas, tareas, slots y reservas.

En las actividades anteriores se construyo y desplego la aplicacion. En esta Actividad 2 el objetivo es administrar la plataforma digital desde una perspectiva profesional: seleccion de hardware y servidor, justificacion de base de datos, licitacion de monitoreo y seguridad, ejecucion de pruebas, aplicacion de Scrum y control de versiones con Git.

## INS01 - Eleccion de hardware idoneo del servidor

Para la base de datos se selecciono MongoDB Atlas como servicio administrado NoSQL. Esta decision permite separar la persistencia del servidor API y reducir el riesgo de perdida de datos si la instancia del API falla.

Para el API se utiliza AWS Lightsail con Ubuntu 24.04 LTS, 512 MB RAM, 2 vCPU y 20 GB SSD. Este servidor ejecuta Node.js con PM2 y Nginx como proxy inverso.

Para el front-end se utiliza AWS Amplify. Cloudflare administra DNS y HTTPS.

La arquitectura queda distribuida asi:

Usuario
-> Cloudflare
-> AWS Amplify
-> AWS Lightsail con Node.js y Nginx
-> MongoDB Atlas

## INS02 - Justificacion de base y servidor

### Disco duro

El proyecto maneja volumen bajo o medio: clientes, tutores, estudiantes, vehiculos, jornadas, tareas, slots y reservas. Para una fase academica, el almacenamiento inicial de MongoDB Atlas es suficiente. Para produccion se recomienda escalar a un cluster dedicado con backups y mayor almacenamiento.

### Memoria RAM

La aplicacion usa operaciones CRUD y consultas de dashboard. No requiere procesamiento analitico pesado. La instancia Lightsail actual es suficiente para baja concurrencia academica. Para produccion se recomienda 1 GB o 2 GB RAM.

### Topologia de red

Se eligio una topologia distribuida. El cliente consume el front-end en Amplify, el front-end consume el API en Lightsail y el API se conecta a MongoDB Atlas. Cloudflare administra DNS y HTTPS.

Esta topologia mejora separacion de responsabilidades, seguridad, recuperacion ante fallas y escalabilidad.

### Sistema operativo

El servidor API usa Ubuntu 24.04 LTS porque es estable, ampliamente documentado, compatible con Node.js, Nginx y PM2, y adecuado para despliegues web. MongoDB Atlas administra el sistema operativo subyacente de la base de datos.

## INS03 - Licitacion de monitoreo y seguridad

Se realizo una licitacion tecnica de tres propuestas:

1. AWS CloudWatch + Lightsail Metrics.
2. MongoDB Atlas Monitoring + Alerts.
3. Cloudflare Analytics + Security.

Los criterios fueron: cobertura de infraestructura, base de datos, trafico publico, alertas, seguridad, facilidad de implementacion, costo academico, escalabilidad y compatibilidad con IBEX.

La seleccion final fue una combinacion hibrida:
- AWS CloudWatch para infraestructura.
- MongoDB Atlas Monitoring para base de datos.
- Cloudflare Analytics/Security para trafico publico, DNS y HTTPS.

Esta combinacion es la mejor porque la plataforma esta distribuida y ninguna herramienta aislada cubre toda la arquitectura.

Medidas de seguridad:
- secretos fuera de GitHub;
- variables de entorno;
- CORS limitado;
- HTTPS;
- Nginx como proxy inverso;
- PM2;
- SSH mediante llave;
- usuarios de base de datos con permisos limitados;
- monitoreo y health checks.

## INS04 - Pruebas

### Prueba manual de cinco pasos

1. Abrir https://ibex.ccjira.io.
2. Abrir https://api-ibex.ccjira.io/api/health.
3. Crear un cliente desde la interfaz.
4. Editar un registro desde la interfaz.
5. Recargar la pagina y validar persistencia.

Resultado esperado:
- front-end funcional;
- API con ok true;
- MongoDB activo;
- CRUD visible;
- datos persistentes.

### Tres pruebas automatizadas

Archivo:
- scripts/tarea3-actividad2/automated-tests.mjs

Comando:
- node scripts/tarea3-actividad2/automated-tests.mjs

Prueba automatizada 1:
- health check del API.

Prueba automatizada 2:
- integracion dashboard API-MongoDB.

Prueba automatizada 3:
- crear cliente temporal, verificar persistencia en dashboard y eliminarlo.

Resultado esperado:
- AUTOMATED_TESTS_OK.

### Depuracion

Durante la primera version de la prueba se intento validar PUT /clients/:id, pero el API publico respondio 404. Se depuro el caso y se ajusto la prueba para validar endpoints confirmados: POST, GET dashboard y DELETE. Esto demuestra identificacion de error, analisis y correccion de la prueba.

## INS05 - Scrum

Se diseño un proyecto Scrum para mejorar el front-end.

Yo asumo el rol de Product Owner.

Equipo Scrum:
- Product Owner;
- Scrum Master;
- desarrollador front-end;
- desarrollador back-end;
- QA;
- DevOps.

Backlog:
- formularios claros;
- edicion de registros;
- eliminacion de registros;
- diseño responsivo;
- errores comprensibles;
- feed en tiempo real;
- pruebas automatizadas;
- health check;
- evidencia de despliegue;
- documentacion de operacion.

Sprints:
- Sprint 1: estabilizacion de formularios y CRUD.
- Sprint 2: experiencia responsiva.
- Sprint 3: observabilidad, pruebas y calidad.

Se documentan daily meetings, sprint review y retrospective.

## INS06 - Control de versiones con Git

Repositorio publico:
- https://github.com/rg4cyc/ibex-carwash-fase1

Rama principal:
- main

Rama de trabajo:
- actividad-2-admin-servidores

Tags:
- tarea2-100-baseline
- tarea3-actividad2-submit

Flujo:
1. marcar version estable anterior con tag;
2. crear rama de trabajo;
3. agregar documentacion y pruebas;
4. hacer commit;
5. integrar a main;
6. crear tag final;
7. publicar en GitHub.

Recuperacion:
- git checkout tarea2-100-baseline permite revisar la version anterior.
- git checkout main permite regresar a la version principal.
- git checkout -b recuperacion-demo tarea2-100-baseline permite crear una rama desde la version anterior.
- git revert <commit> permite deshacer un cambio sin borrar historial.

Esto cubre repositorio, ramas, flujo de trabajo y recuperacion de versiones anteriores.

## Evidencia de capturas

Capturas recomendadas:
- front-end publico;
- API health;
- terminal con AUTOMATED_TESTS_OK;
- GitHub con repo publico;
- GitHub con rama actividad-2-admin-servidores;
- GitHub con tags;
- git log;
- git branch;
- git tag;
- documentos Scrum y Git.

## Conclusiones

La Actividad 2 demuestra administracion integral de la plataforma IBEX Carwash Fase I. Se selecciono hardware y hosting de acuerdo con las necesidades del proyecto, se justifico la base de datos NoSQL, se realizo una licitacion formal de monitoreo y seguridad, se ejecutaron pruebas manuales y automatizadas, se diseño un proceso Scrum y se implemento control de versiones con Git y GitHub.

La plataforma conserva continuidad con Actividades 1 y 2, y queda preparada para evolucionar hacia Fase II con microservicios, Docker, pruebas de carga y mayor escalabilidad.
