TECNOLÓGICO DE MONTERREY / TECMILENIO

Materia: Desarrollo Full Stack
T3 / Actividad 2
Administración de plataforma digital, servidores, pruebas, Scrum y control de versiones

Proyecto: IBEX Carwash Fase I
Alumno: Ch 4m
Repositorio público: https://github.com/rg4cyc/ibex-carwash-fase1
Front-end público: https://ibex.ccjira.io
API público: https://api-ibex.ccjira.io
Video público: [PEGAR AQUÍ ENLACE DEL VIDEO FINAL]



1. Introducción

La plataforma IBEX Carwash Fase I es una aplicación web full stack desarrollada para administrar un programa prelaboral de lavado exterior de autos. El sistema permite gestionar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots de servicio y reservas.

En las actividades anteriores se construyó y desplegó la aplicación web. En esta T3 / Actividad 2, el enfoque ya no es construir una nueva aplicación desde cero, sino administrar la plataforma digital existente desde una perspectiva profesional. Para ello se analizan el hardware del servidor, la base de datos, la topología de red, el sistema operativo, las herramientas de monitoreo, la seguridad, las pruebas, la metodología Scrum y el control de versiones con Git.

La solución conserva continuidad con IBEX Carwash Fase I y utiliza una arquitectura distribuida:

Usuario
-> Cloudflare DNS / HTTPS
-> AWS Amplify para front-end
-> AWS Lightsail para API Node.js
-> MongoDB Atlas como base de datos NoSQL

Esta arquitectura permite separar responsabilidades, mejorar la disponibilidad de los datos, facilitar el despliegue y preparar la plataforma para una futura Fase II con microservicios, contenedores y pruebas de carga.



2. Objetivo de la actividad

El objetivo de esta actividad es practicar la gestión de servidores y la administración de un proyecto digital mediante herramientas de monitoreo, pruebas, metodología Scrum y control de versiones.

En el caso de IBEX Carwash Fase I, el objetivo específico fue demostrar que la plataforma no solo funciona como aplicación web, sino que también puede administrarse como sistema digital en producción, considerando:

- Elección de hardware y servidor.
- Justificación de la base de datos.
- Tamaño de disco.
- Memoria RAM.
- Topología de red.
- Sistema operativo.
- Licitación de herramientas de monitoreo y seguridad.
- Pruebas manuales.
- Pruebas automatizadas.
- Proyecto Scrum.
- Git, ramas, tags, repositorio público y recuperación de versiones.



3. Alcance

El alcance de esta entrega incluye la documentación, validación y administración técnica de la plataforma IBEX Carwash Fase I.

Se cubren los siguientes elementos:

INS01. Elección del hardware idóneo del servidor que almacena la base de datos.

INS02. Justificación de la base de datos considerando disco, RAM, topología de red y sistema operativo.

INS03. Licitación técnica de tres herramientas/proveedores de monitoreo y seguridad.

INS04. Ejecución de una prueba manual en cinco pasos y tres pruebas automatizadas.

INS05. Diseño de proyecto Scrum para mejorar el front-end.

INS06. Sistema de control de versiones con Git, ramas, flujo de trabajo, repositorio y recuperación.

INS07. Guion y preparación de video.

INS08. Reporte con evidencias, capturas y enlaces.



4. Descripción general de la plataforma

IBEX Carwash Fase I es una plataforma administrativa para coordinar servicios de lavado exterior de autos. El sistema fue diseñado con enfoque educativo y operativo: permite registrar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots de servicio y reservas.

La plataforma utiliza:

- React + Vite para el front-end.
- Node.js + Express para el back-end.
- Socket.IO para eventos en tiempo real.
- MongoDB Atlas para persistencia.
- AWS Amplify para despliegue del front-end.
- AWS Lightsail para despliegue del API.
- Nginx como reverse proxy.
- PM2 para mantener vivo el proceso Node.js.
- Cloudflare para DNS y HTTPS.

La aplicación se encuentra disponible en:

Front-end:
https://ibex.ccjira.io

API:
https://api-ibex.ccjira.io

Repositorio GitHub:
https://github.com/rg4cyc/ibex-carwash-fase1



[CAPTURA 01 - FRONT-END PÚBLICO]
Archivo sugerido: assets/screenshots/t3/01_frontend_publico.png
Insertar aquí captura de https://ibex.ccjira.io mostrando la aplicación cargada, tabs principales y dashboard visual.



5. INS01 - Elección del hardware idóneo del servidor

Para esta actividad se decidió conservar una arquitectura distribuida en lugar de concentrar todo en un solo servidor físico. La plataforma separa front-end, API y base de datos.

La base de datos se almacena en MongoDB Atlas, un servicio administrado NoSQL. Aunque MongoDB Atlas abstrae el hardware físico, sí implica una elección técnica de infraestructura: se eligió una base de datos administrada en la nube, alojada en AWS N. Virginia, adecuada para el tamaño actual del proyecto.

Para el API se utiliza AWS Lightsail con Ubuntu 24.04 LTS. Esta instancia aloja el servidor Node.js/Express y se encarga de exponer los endpoints públicos del sistema. La configuración usada es suficiente para una carga académica de baja concurrencia:

- Servicio: AWS Lightsail.
- Sistema operativo: Ubuntu 24.04 LTS.
- RAM: 512 MB.
- CPU: 2 vCPU.
- Disco: 20 GB SSD.
- Proceso Node.js: PM2.
- Proxy inverso: Nginx.
- Dominio API: https://api-ibex.ccjira.io.

Para el front-end se utiliza AWS Amplify, que permite servir una aplicación React/Vite de manera eficiente como sitio estático desplegado desde GitHub.

La decisión final de hardware e infraestructura fue:

- MongoDB Atlas para base de datos.
- AWS Lightsail para API.
- AWS Amplify para front-end.
- Cloudflare para DNS y HTTPS.

Esta elección resulta adecuada porque evita que la base de datos dependa directamente de la instancia Lightsail. Si el servidor API falla, los datos permanecen almacenados en MongoDB Atlas.



[CAPTURA 02 - AWS LIGHTSAIL]
Archivo sugerido: assets/screenshots/t3/02_lightsail_instancia.png
Insertar aquí captura de AWS Lightsail mostrando la instancia ibex-fase1-api corriendo.



[CAPTURA 03 - MONGODB ATLAS]
Archivo sugerido: assets/screenshots/t3/03_mongodb_atlas.png
Insertar aquí captura de MongoDB Atlas mostrando el cluster conectado o la base ibex_carwash_fase1.



6. INS02 - Justificación de la base de datos y servidor

6.1. Justificación de la base de datos

Se eligió MongoDB Atlas porque el proyecto maneja entidades documentales y relaciones flexibles. La plataforma administra clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas. Aunque existen relaciones lógicas entre estas entidades, el volumen de datos y la naturaleza del proyecto permiten usar una base NoSQL de manera eficiente.

MongoDB Atlas ofrece ventajas importantes:

- Base de datos administrada.
- Separación entre aplicación y datos.
- Escalabilidad futura.
- Monitoreo integrado.
- Conexión mediante driver oficial de MongoDB.
- Posibilidad de backups y alertas en planes superiores.
- Menor carga de administración del servidor.

6.2. Tamaño de disco duro

En la etapa actual, el volumen de información es bajo. Los datos principales son registros administrativos y no archivos multimedia pesados. Por lo tanto, el almacenamiento inicial de MongoDB Atlas resulta suficiente para esta fase académica.

El servidor Lightsail incluye 20 GB SSD, suficiente para:

- Código del API.
- Dependencias de Node.js.
- Configuración de Nginx.
- Logs básicos.
- PM2.
- Archivos de configuración.

Para producción real se recomienda escalar MongoDB Atlas a un cluster dedicado y mantener snapshots/backups. También se recomienda aumentar el plan de Lightsail si el tráfico o los logs crecen.

6.3. Capacidad de memoria RAM

La instancia actual de Lightsail tiene 512 MB RAM. Esta capacidad es suficiente para una demostración académica con baja concurrencia, pero es limitada para producción real. El stack ejecutado incluye Node.js, PM2, Nginx y conexión con MongoDB Atlas.

Para mejorar estabilidad se recomienda:

- Escalar a 1 GB o 2 GB RAM.
- Mantener PM2 con reinicio automático.
- Configurar swap.
- Monitorear uso de CPU y memoria.
- Agregar alertas de disponibilidad.

MongoDB Atlas administra internamente la memoria del servicio de base de datos. Para producción se recomienda un cluster dedicado con mayor capacidad de RAM e índices adecuados.

6.4. Topología de red

La topología de red es distribuida:

Usuario
-> navegador web
-> Cloudflare DNS / HTTPS
-> AWS Amplify
-> API en AWS Lightsail
-> MongoDB Atlas

El front-end consume el API mediante HTTPS. El API se conecta a MongoDB Atlas usando una cadena de conexión protegida en variable de entorno. Cloudflare administra los subdominios públicos.

Subdominios usados:

- https://ibex.ccjira.io para el front-end.
- https://api-ibex.ccjira.io para el API.

Ventajas de esta topología:

- Separación de responsabilidades.
- Mejor recuperación ante fallas.
- DNS centralizado.
- HTTPS público.
- Base de datos fuera del servidor API.
- Escalabilidad futura.
- Mayor claridad para monitoreo por capas.

6.5. Sistema operativo

Para el API se eligió Ubuntu 24.04 LTS.

Justificación:

- Es estable y ampliamente documentado.
- Tiene soporte de largo plazo.
- Es compatible con Node.js, Nginx y PM2.
- Permite administración por SSH.
- Es adecuado para despliegues web.
- Facilita mantenimiento y actualizaciones.

MongoDB Atlas administra el sistema operativo subyacente del cluster de base de datos, por lo que no se requiere administrar manualmente parches del motor de base de datos.



[CAPTURA 04 - API HEALTH]
Archivo sugerido: assets/screenshots/t3/04_api_health.png
Insertar aquí captura de https://api-ibex.ccjira.io/api/health mostrando ok true, database mongodb y servicio activo.



7. INS03 - Licitación técnica de monitoreo y seguridad

La actividad solicita realizar una licitación, es decir, un procedimiento competitivo para evaluar diferentes proveedores o herramientas. Para IBEX Carwash se realizó una licitación técnica con tres propuestas de monitoreo y seguridad.

El objetivo fue seleccionar herramientas capaces de garantizar estabilidad, monitorear tráfico, revisar tiempo de respuesta y proteger la plataforma contra fallas o ataques comunes.

7.1. Criterios de evaluación

Los criterios usados fueron:

- Cobertura de infraestructura.
- Cobertura de base de datos.
- Cobertura de tráfico web público.
- Capacidad de alertas.
- Seguridad.
- Facilidad de implementación.
- Costo académico.
- Escalabilidad futura.
- Compatibilidad con la arquitectura actual.

7.2. Proveedor 1: AWS CloudWatch + Lightsail Metrics

AWS CloudWatch permite monitorear infraestructura en AWS. Para IBEX se propone como herramienta principal para observar el servidor Lightsail donde corre el API.

Cobertura:

- CPU.
- Tráfico de red.
- Disponibilidad de la instancia.
- Alarmas ante consumo elevado.
- Métricas asociadas al servidor del API.

Ventajas:

- Integración nativa con AWS.
- Compatible con Lightsail.
- Permite crear alarmas.
- Escalable si el proyecto migra a otros servicios AWS.

Limitaciones:

- No monitorea por sí solo la lógica interna de MongoDB.
- Requiere configuración adicional para logs de aplicación.
- No reemplaza una herramienta de monitoreo de base de datos.

Seguridad asociada:

- IAM.
- Acceso SSH con llave.
- Puertos mínimos.
- PM2.
- Nginx.
- Variables de entorno fuera de GitHub.

7.3. Proveedor 2: MongoDB Atlas Monitoring + Alerts

MongoDB Atlas Monitoring permite revisar el estado de la base de datos, conexiones, lecturas, escrituras, tamaño de datos y comportamiento del cluster.

Cobertura:

- Conexiones activas.
- Lecturas.
- Escrituras.
- Estado del cluster.
- Uso de almacenamiento.
- Alertas de base de datos.

Ventajas:

- Especializado en MongoDB.
- No requiere instalar agentes en Lightsail.
- Facilita diagnóstico de latencia.
- Permite escalar a clusters dedicados.

Limitaciones:

- No monitorea el front-end.
- No monitorea todo el API.
- Algunas funciones avanzadas dependen del plan contratado.

Seguridad asociada:

- Usuario de base de datos.
- URI fuera de GitHub.
- Variable MONGODB_URI.
- Lista de acceso de red.
- Backups en planes superiores.

7.4. Proveedor 3: Cloudflare Analytics + Security

Cloudflare administra DNS, HTTPS y analítica básica de tráfico. También permite identificar errores de origen y agregar reglas de seguridad perimetral.

Cobertura:

- DNS.
- HTTPS.
- Tráfico web.
- Errores de origen.
- Seguridad perimetral.
- Revisión de peticiones por dominio.

Ventajas:

- Mejora la exposición pública del front-end y API.
- Permite diagnosticar errores 522, 525 u otros.
- Agrega una capa entre usuario y servidor.
- Simplifica DNS y HTTPS.

Limitaciones:

- No sustituye monitoreo interno del servidor.
- No monitorea la lógica de negocio.
- Depende de configuración correcta de SSL/TLS.

Seguridad asociada:

- DNS administrado.
- HTTPS.
- Reglas de seguridad.
- Separación de subdominios.
- CORS limitado en el API.

7.5. Tabla comparativa de licitación

Criterio | AWS CloudWatch | MongoDB Atlas Monitoring | Cloudflare Analytics/Security
--- | --- | --- | ---
Infraestructura del API | Alto | Bajo | Medio
Base de datos | Bajo | Alto | Bajo
Tráfico web público | Medio | Bajo | Alto
Alertas | Alto | Alto | Medio
Seguridad | Alto | Alto | Alto
Facilidad de implementación | Media | Alta | Alta
Costo académico | Bajo/medio | Bajo inicial | Bajo inicial
Escalabilidad futura | Alta | Alta | Alta
Compatibilidad con IBEX | Alta | Alta | Alta

7.6. Selección final

La propuesta seleccionada es una combinación híbrida:

- AWS CloudWatch para infraestructura.
- MongoDB Atlas Monitoring para base de datos.
- Cloudflare Analytics/Security para DNS, HTTPS y tráfico público.

La razón es que IBEX Carwash está distribuido. Ninguna herramienta aislada cubre toda la plataforma. La combinación elegida permite monitorear por capas: usuario, red, servidor, aplicación y base de datos.

7.7. Configuración de seguridad recomendada

- Mantener secretos fuera de GitHub.
- Usar variables de entorno.
- Limitar CORS a dominios autorizados.
- Usar HTTPS.
- Mantener Nginx como reverse proxy.
- Ejecutar Node.js con PM2.
- Restringir puertos innecesarios.
- Mantener backups y snapshots.
- Usar usuarios de base de datos con permisos limitados.
- Revisar logs.
- Configurar health checks.
- Escalar Lightsail si aumenta el tráfico.



[CAPTURA 05 - CLOUDFLARE DNS]
Archivo sugerido: assets/screenshots/t3/05_cloudflare_dns.png
Insertar aquí captura de Cloudflare mostrando los subdominios ibex.ccjira.io y api-ibex.ccjira.io.



8. INS04 - Sesión de pruebas

8.1. Objetivo de pruebas

El objetivo de las pruebas fue validar que la plataforma funcione de forma estable desde el punto de vista del usuario y desde el punto de vista técnico.

Se realizaron:

- Una prueba manual de cinco pasos.
- Tres pruebas automatizadas.
- Depuración de un error detectado en la primera versión de la prueba automatizada.

8.2. Prueba manual de cinco pasos

Paso 1. Verificar front-end público.

Acción:
Abrir https://ibex.ccjira.io.

Resultado esperado:
La aplicación carga correctamente, muestra la interfaz principal, las pestañas y el contenido visual.

[CAPTURA 06 - PRUEBA MANUAL PASO 1]
Archivo sugerido: assets/screenshots/t3/06_prueba_manual_frontend.png
Insertar aquí captura del front-end cargado.

Paso 2. Verificar API público.

Acción:
Abrir https://api-ibex.ccjira.io/api/health.

Resultado esperado:
El API responde JSON con ok true y database mongodb.

[CAPTURA 07 - PRUEBA MANUAL PASO 2]
Archivo sugerido: assets/screenshots/t3/07_prueba_manual_api_health.png
Insertar aquí captura del health check del API.

Paso 3. Crear un cliente.

Acción:
Entrar a la pestaña Clientes, capturar datos y guardar.

Resultado esperado:
El cliente aparece en la tabla y el feed en tiempo real registra el evento.

[CAPTURA 08 - PRUEBA MANUAL PASO 3]
Archivo sugerido: assets/screenshots/t3/08_prueba_manual_crear_cliente.png
Insertar aquí captura de cliente creado o tabla actualizada.

Paso 4. Editar un registro.

Acción:
Presionar Editar en un registro, modificar un dato y guardar.

Resultado esperado:
El registro se actualiza en la tabla.

[CAPTURA 09 - PRUEBA MANUAL PASO 4]
Archivo sugerido: assets/screenshots/t3/09_prueba_manual_editar_cliente.png
Insertar aquí captura del registro editado.

Paso 5. Validar persistencia.

Acción:
Recargar la página y confirmar que los datos siguen visibles.

Resultado esperado:
Los datos persisten porque se almacenan en MongoDB Atlas.

[CAPTURA 10 - PRUEBA MANUAL PASO 5]
Archivo sugerido: assets/screenshots/t3/10_prueba_manual_persistencia.png
Insertar aquí captura posterior a recargar la página.

8.3. Pruebas automatizadas

Se implementó el archivo:

scripts/t3/automated-tests.mjs

Comando de ejecución:

node scripts/t3/automated-tests.mjs

Prueba automatizada 1: Health check del API.

Valida:
- HTTP status exitoso.
- ok igual a true.
- database igual a mongodb.

Resultado esperado:
TEST_1_HEALTH_OK

Prueba automatizada 2: Integración API-dashboard-MongoDB.

Valida:
- Respuesta exitosa de /dashboard.
- Existencia de colecciones principales.
- Datos base en clientes, slots y reservas.

Resultado esperado:
TEST_2_DASHBOARD_COLLECTIONS_OK

Prueba automatizada 3: CRUD parcial con persistencia.

Valida:
- Crear cliente temporal.
- Confirmar que aparece en dashboard.
- Eliminar cliente temporal.
- Confirmar que ya no aparece.

Resultado esperado:
TEST_3_CLIENT_CREATE_PERSISTENCE_DELETE_OK

Resultado final esperado:
AUTOMATED_TESTS_OK



[CAPTURA 11 - PRUEBAS AUTOMATIZADAS]
Archivo sugerido: assets/screenshots/t3/11_pruebas_automatizadas.png
Insertar aquí captura de Terminal mostrando:
API_BASE_URL=https://api-ibex.ccjira.io/api
TEST_1_HEALTH_OK
TEST_2_DASHBOARD_COLLECTIONS_OK
TEST_3_CLIENT_CREATE_PERSISTENCE_DELETE_OK
AUTOMATED_TESTS_OK



8.4. Evidencia de depuración

Durante la primera versión de la prueba automatizada se intentó validar el endpoint PUT /clients/:id. El API público respondió 404 para esa ruta específica. En lugar de forzar una prueba incorrecta, se depuró el caso y se ajustó el script para validar endpoints confirmados por el contrato real del API: creación, consulta en dashboard y eliminación.

Esto demuestra el proceso de depuración:
- Se detectó el error.
- Se identificó que el supuesto de prueba no correspondía al endpoint disponible.
- Se corrigió la prueba.
- Se volvió a ejecutar hasta obtener AUTOMATED_TESTS_OK.



9. INS05 - Proyecto Scrum para mejorar el front-end

9.1. Objetivo Scrum

El objetivo del proyecto Scrum es planear mejoras incrementales al front-end de IBEX Carwash Fase I para hacerlo más claro, responsivo, mantenible y útil para usuarios administrativos.

9.2. Rol del Product Owner

En esta actividad asumo el rol de Product Owner. Mi responsabilidad es priorizar el valor del producto, validar que las historias respondan al problema real y aceptar o rechazar incrementos al cierre de cada sprint.

9.3. Equipo Scrum

Rol | Función
--- | ---
Product Owner | Priorizar backlog, definir aceptación y validar valor.
Scrum Master | Facilitar ceremonias y remover bloqueos.
Desarrollador front-end | Mejorar React, CSS y responsividad.
Desarrollador back-end | Mantener API, CORS y endpoints.
QA / Testing | Ejecutar pruebas manuales y automatizadas.
DevOps | Revisar despliegue, GitHub, AWS y monitoreo.

9.4. Product Backlog

ID | Historia | Prioridad | Criterio de aceptación
--- | --- | --- | ---
PB-01 | Como administrador quiero formularios claros para crear registros sin errores. | Alta | Campos libres aceptan texto y campos relacionales usan dropdown.
PB-02 | Como administrador quiero editar registros desde la tabla. | Alta | El botón Editar carga datos y permite guardar cambios.
PB-03 | Como administrador quiero eliminar registros de prueba. | Alta | El botón Eliminar actualiza la tabla.
PB-04 | Como usuario móvil quiero usar la app desde celular. | Alta | El layout no se rompe en pantalla móvil.
PB-05 | Como usuario quiero ver errores comprensibles. | Media | La interfaz muestra mensajes claros.
PB-06 | Como administrador quiero ver eventos en tiempo real. | Media | El feed refleja creación, actualización o eliminación.
PB-07 | Como desarrollador quiero pruebas automatizadas. | Alta | El script termina con AUTOMATED_TESTS_OK.
PB-08 | Como administrador técnico quiero health check público. | Alta | /api/health responde ok true.
PB-09 | Como Product Owner quiero evidencia del despliegue. | Alta | Hay capturas de front-end, API, Git y pruebas.
PB-10 | Como equipo quiero documentación de operación. | Media | Existen documentos de hardware, monitoreo y Git.

[CAPTURA 12 - PRODUCT BACKLOG]
Archivo sugerido: assets/screenshots/t3/12_scrum_product_backlog.png
Insertar aquí captura del archivo docs/t3/04-scrum.md mostrando la tabla de backlog.

9.5. Sprint planning

Sprint | Fechas sugeridas | Objetivo | Historias | Daily | Review | Retroalimentación
--- | --- | --- | --- | --- | --- | ---
Sprint 1 | Semana 1 | Estabilizar formularios y CRUD. | PB-01, PB-02, PB-03 | Diario 10 min | Demo de creación, edición y eliminación. | Ajustar campos incorrectos.
Sprint 2 | Semana 2 | Mejorar experiencia responsiva. | PB-04, PB-05, PB-06 | Diario 10 min | Demo en escritorio y móvil. | Mejorar mensajes y layout.
Sprint 3 | Semana 3 | Agregar calidad y observabilidad. | PB-07, PB-08, PB-09, PB-10 | Diario 10 min | Demo de pruebas, health check y Git. | Preparar evidencias.

[CAPTURA 13 - SPRINT PLANNING]
Archivo sugerido: assets/screenshots/t3/13_scrum_sprint_planning.png
Insertar aquí captura del archivo docs/t3/04-scrum.md mostrando la tabla de sprint planning.

9.6. Sprint review y retrospective final

Sprint review final:
Se presenta front-end desplegado, API público, MongoDB persistente, CRUD operativo, feed Socket.IO, evidencia de pruebas, evidencia Git y documentación de monitoreo.

Sprint retrospective:
Lo que funcionó:
- Reutilizar infraestructura existente.
- Separar front-end, API y base de datos.
- Usar Git para cambios incrementales.
- Documentar decisiones técnicas.

Lo que se puede mejorar:
- Automatizar despliegues del API.
- Agregar monitoreo formal.
- Usar manejo de secretos administrado.
- Agregar pruebas de carga.
- Configurar autenticación GitHub CLI desde el inicio.



[CAPTURA 14 - SPRINT REVIEW / RETROSPECTIVE]
Archivo sugerido: assets/screenshots/t3/14_scrum_review_retro.png
Insertar aquí captura del archivo docs/t3/04-scrum.md mostrando review y retrospective.



10. INS06 - Sistema de control de versiones con Git

10.1. Repositorio público

El repositorio público del proyecto es:
https://github.com/rg4cyc/ibex-carwash-fase1

La rama principal es:
main

La rama de trabajo usada para T3 fue:
t3

Los tags principales son:
t2-baseline
t3-submit



[CAPTURA 15 - GITHUB REPOSITORIO PÚBLICO]
Archivo sugerido: assets/screenshots/t3/15_github_repo_publico.png
Insertar aquí captura del repositorio GitHub público.



[CAPTURA 16 - RAMA T3]
Archivo sugerido: assets/screenshots/t3/16_github_rama_t3.png
Insertar aquí captura de GitHub mostrando la rama t3.



[CAPTURA 17 - TAGS]
Archivo sugerido: assets/screenshots/t3/17_github_tags_t3.png
Insertar aquí captura de GitHub o terminal mostrando los tags t2-baseline y t3-submit.



10.2. Flujo de trabajo aplicado

El flujo de trabajo fue:

1. Marcar el estado estable de T2.
2. Crear rama de trabajo t3.
3. Agregar documentación y pruebas.
4. Hacer commit.
5. Integrar a main.
6. Crear tag final.
7. Publicar en GitHub.

Comandos representativos:

git tag t2-baseline
git checkout -B t3
git add docs/t3 scripts/t3 assets/screenshots/t3
git commit -m "normalize t3 structure and evidence"
git checkout main
git merge t3
git tag t3-submit
git push -u origin main
git push -u origin t3
git push --tags

10.3. Evidencia real de Git

Se generó el archivo:
docs/t3/git-evidence.txt

Este archivo contiene:
- Estado de rama.
- Últimos commits.
- Ramas locales/remotas.
- Tags.
- Remote de GitHub.
- Archivos documentales.
- Scripts de T3.
- Resultado de pruebas automatizadas.

Comandos clave para evidencia:

git log --oneline --decorate -5
git branch -a
git tag --list "t*"



[CAPTURA 18 - GIT LOG]
Archivo sugerido: assets/screenshots/t3/18_git_log.png
Insertar aquí captura de Terminal mostrando git log --oneline --decorate -5.



[CAPTURA 19 - GIT BRANCH]
Archivo sugerido: assets/screenshots/t3/19_git_branch.png
Insertar aquí captura de Terminal mostrando git branch -a.



[CAPTURA 20 - GIT TAGS]
Archivo sugerido: assets/screenshots/t3/20_git_tags.png
Insertar aquí captura de Terminal mostrando git tag --list "t*".



10.4. Recuperación de una versión anterior

Para cumplir con recuperación de versiones anteriores, se creó el tag:

t2-baseline

Este tag representa el estado estable anterior a la documentación y evidencias de T3.

Para consultar una versión anterior sin modificar main:

git checkout t2-baseline

Para regresar a main:

git checkout main

Para crear una rama de recuperación desde la versión anterior:

git checkout -b t3-recuperacion-demo t2-baseline

Para deshacer un commit sin borrar historial:

git revert <commit>



11. INS07 - Video de presentación

El video debe mostrar:
- Elección de hardware y servidor.
- Arquitectura de la plataforma.
- Base de datos MongoDB Atlas.
- API público.
- Pruebas manuales.
- Pruebas automatizadas.
- Scrum.
- Git y control de versiones.

Guion base:

Hola, en este video presento la T3 / Actividad 2 de la materia Full Stack. La plataforma base es IBEX Carwash Fase I, una aplicación web para administrar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas dentro de un programa prelaboral.

En las actividades anteriores se desarrolló y desplegó la aplicación. En esta actividad el enfoque es la administración técnica de la plataforma: hardware, servidor, base de datos, licitación de monitoreo, seguridad, pruebas, metodología Scrum y control de versiones con Git.

La arquitectura está dividida por capas. El front-end está desarrollado con React y Vite y se despliega en AWS Amplify. El API está desarrollado con Node.js y Express, se ejecuta en AWS Lightsail sobre Ubuntu 24.04 LTS, usa PM2 para mantener el proceso activo y Nginx como proxy inverso. La base de datos está en MongoDB Atlas y Cloudflare administra DNS y HTTPS.

Para la base de datos se eligió MongoDB Atlas porque permite separar la persistencia del servidor del API. Para el API se utiliza Lightsail, suficiente para baja concurrencia académica, aunque para producción se recomienda escalar memoria y monitoreo.

También se realizó una licitación técnica con tres proveedores: AWS CloudWatch, MongoDB Atlas Monitoring y Cloudflare Analytics/Security. La selección final fue una combinación híbrida porque cada herramienta cubre una capa distinta.

En pruebas, se ejecutó una prueba manual de cinco pasos y tres pruebas automatizadas. Las automatizadas validan health check, dashboard y persistencia de un cliente temporal.

En Scrum, asumo el rol de Product Owner. Se definió equipo, backlog, tres sprints, daily meetings, sprint review y retrospective.

Finalmente, en Git se utilizó una rama de trabajo, tags de versión, merge a main, repositorio público y documentación de recuperación de una versión anterior.

Con esto se demuestra administración integral de la plataforma digital.



12. Conclusiones

La T3 / Actividad 2 demuestra que IBEX Carwash Fase I no solo es una aplicación funcional, sino una plataforma digital administrable.

Se eligió una arquitectura coherente para el tamaño del proyecto: AWS Amplify para front-end, AWS Lightsail para API, MongoDB Atlas para base de datos y Cloudflare para DNS/HTTPS.

Se justificó la elección de hardware, disco, memoria, red y sistema operativo. Se realizó una licitación técnica de monitoreo y seguridad. Se ejecutaron pruebas manuales y automatizadas. Se diseñó un proyecto Scrum y se implementó control de versiones con Git, ramas, tags, repositorio público y recuperación de versiones anteriores.

La plataforma queda preparada para evolucionar hacia Fase II, donde se podrán incorporar microservicios, Docker, pruebas de carga, optimización y mayor escalabilidad.



13. Enlaces finales

Front-end:
https://ibex.ccjira.io

API:
https://api-ibex.ccjira.io

Repositorio GitHub:
https://github.com/rg4cyc/ibex-carwash-fase1

Video:
[PEGAR AQUÍ ENLACE FINAL DEL VIDEO]
