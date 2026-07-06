# Proyecto Scrum para mejora del front-end

## Objetivo Scrum

Planear una mejora incremental del front-end de IBEX Carwash Fase I para hacerlo mas claro, responsivo, mantenible y util para usuarios administrativos.

## Rol del Product Owner

En esta actividad asumo el rol de Product Owner. Mi responsabilidad es priorizar el valor del producto, validar que las historias respondan al problema real de IBEX Carwash y aceptar o rechazar incrementos al cierre de cada sprint.

## Equipo Scrum

| Rol | Responsable | Funcion |
|---|---|---|
| Product Owner | Yo | Priorizar backlog, definir aceptacion y validar valor |
| Scrum Master | Integrante asignado | Facilitar ceremonias y remover bloqueos |
| Desarrollador front-end | Integrante asignado | Mejorar React, CSS y responsividad |
| Desarrollador back-end | Integrante asignado | Mantener API, CORS y endpoints |
| QA / Testing | Integrante asignado | Ejecutar pruebas manuales y automatizadas |
| DevOps | Integrante asignado | Revisar despliegue, GitHub, AWS y monitoreo |

## Product backlog

| ID | Historia | Prioridad | Criterio de aceptacion |
|---|---|---:|---|
| PB-01 | Como administrador quiero formularios claros para crear registros sin errores | Alta | Los campos libres aceptan texto y los relacionales usan dropdown |
| PB-02 | Como administrador quiero editar registros desde la tabla | Alta | El boton Editar carga datos y permite guardar cambios |
| PB-03 | Como administrador quiero eliminar registros de prueba | Alta | El boton Eliminar actualiza la tabla |
| PB-04 | Como usuario movil quiero usar la app desde celular | Alta | El layout no se rompe en pantalla movil |
| PB-05 | Como usuario quiero ver errores comprensibles | Media | La interfaz muestra mensajes de error claros |
| PB-06 | Como administrador quiero ver eventos en tiempo real | Media | El feed refleja creacion, actualizacion o eliminacion |
| PB-07 | Como desarrollador quiero pruebas automatizadas | Alta | El script termina con AUTOMATED_TESTS_OK |
| PB-08 | Como administrador tecnico quiero health check publico | Alta | /api/health responde ok true |
| PB-09 | Como Product Owner quiero evidencia del despliegue | Alta | Hay capturas de front-end, API, Git y pruebas |
| PB-10 | Como equipo quiero documentacion de operacion | Media | Existen documentos de hardware, monitoreo y Git |

## Sprint planning general

| Sprint | Fechas sugeridas | Objetivo | Historias seleccionadas | Daily | Review | Retroalimentacion |
|---|---|---|---|---|---|---|
| Sprint 1 | Semana 1 | Estabilizar formularios y CRUD | PB-01, PB-02, PB-03 | Diario 10 min | Demo de creacion, edicion y eliminacion | Ajustar campos que no correspondan |
| Sprint 2 | Semana 2 | Mejorar experiencia responsiva | PB-04, PB-05, PB-06 | Diario 10 min | Demo en escritorio y movil | Mejorar mensajes y layout |
| Sprint 3 | Semana 3 | Agregar calidad y observabilidad | PB-07, PB-08, PB-09, PB-10 | Diario 10 min | Demo de pruebas, health check y Git | Preparar evidencias para entrega |

## Sprint 1: estabilizacion de formularios

Duracion:
- 1 semana.

Objetivo:
- Asegurar que los formularios permitan crear, editar y eliminar registros sin errores.

Historias:
- PB-01.
- PB-02.
- PB-03.

Criterio de aceptacion:
- Crear, editar y eliminar funciona desde la interfaz.
- Los campos de texto no se convierten en dropdowns incorrectos.
- Los campos relacionales si usan dropdowns.
- El build del front-end pasa.

Review:
- Se presenta CRUD funcionando en pestañas principales.

Retroalimentacion:
- Mantener campos libres para nombres, telefonos y correos.
- Mantener dropdowns solo para relaciones.

## Sprint 2: experiencia responsiva

Duracion:
- 1 semana.

Objetivo:
- Mejorar la experiencia en escritorio y movil.

Historias:
- PB-04.
- PB-05.
- PB-06.

Criterio de aceptacion:
- La app se usa en movil.
- Las tarjetas se reacomodan correctamente.
- Los mensajes de error son legibles.
- El feed de eventos sigue visible.

Review:
- Se muestra la app en vista movil y escritorio.

Retroalimentacion:
- Priorizar claridad sobre exceso visual.
- Mantener navegacion simple por pestañas.

## Sprint 3: observabilidad y calidad

Duracion:
- 1 semana.

Objetivo:
- Integrar evidencia de monitoreo, pruebas y control de versiones.

Historias:
- PB-07.
- PB-08.
- PB-09.
- PB-10.

Criterio de aceptacion:
- Existe health check publico.
- Existen pruebas automatizadas.
- Existe documentacion de monitoreo.
- Existe documentacion de Git/versionamiento.
- El reporte incluye evidencia de infraestructura.

Review:
- Se ejecutan pruebas automatizadas.
- Se muestra health check.
- Se muestra GitHub con rama, tags y commits.

Retroalimentacion:
- Agregar monitoreo formal en una fase posterior.
- Agregar pruebas de carga para Fase II.
- Usar manejo de secretos administrado.
- Configurar autenticacion GitHub con GitHub CLI desde el inicio.

## Daily meeting

Preguntas guia:
- Que hice ayer.
- Que hare hoy.
- Que bloqueos existen.

Bloqueos detectados:
- propagacion DNS;
- configuracion CORS;
- acceso temporal a Lightsail;
- autenticacion de GitHub por HTTPS;
- alineacion entre pruebas automatizadas y endpoints reales.

## Sprint review final

Se presenta:
- front-end desplegado;
- API publico;
- MongoDB persistente;
- CRUD operativo;
- feed Socket.IO;
- evidencia de pruebas;
- evidencia Git;
- documentacion de monitoreo y seguridad.

## Sprint retrospective final

Lo que funciono:
- reutilizar infraestructura existente;
- separar front-end, API y base de datos;
- usar Git para cambios incrementales;
- documentar decisiones tecnicas.

Lo que se puede mejorar:
- automatizar despliegues del API;
- agregar monitoreo formal con alertas;
- usar manejo de secretos administrado;
- agregar pruebas de carga en Fase II;
- configurar autenticacion GitHub con GitHub CLI desde el inicio.

## Conclusion

Scrum se aplico como metodologia incremental para estabilizar y mejorar la plataforma. La planeacion por backlog, sprints, daily meetings, reviews y retrospectivas permite administrar el proyecto con claridad, priorizar valor y preparar la evolucion hacia Fase II.
