# Proyecto Scrum para mejora del front-end

## Objetivo Scrum

Planear una mejora incremental del front-end de IBEX Carwash Fase I para hacerlo más claro, responsivo, mantenible y útil para usuarios administrativos.

## Roles

Product Owner:
- Responsable de priorizar funcionalidades y validar que la aplicación resuelva el problema operativo de IBEX Carwash.

Scrum Master:
- Responsable de facilitar el proceso, remover bloqueos y asegurar que se sigan las ceremonias.

Equipo de desarrollo:
- Front-end React.
- Back-end Node.js.
- QA y pruebas.
- DevOps / despliegue.

## Product backlog

- Mejorar navegación por pestañas.
- Agregar estados visuales de carga y error.
- Mejorar diseño responsivo en celular.
- Validar formularios.
- Mantener dropdowns relacionales.
- Permitir edición y eliminación desde GUI.
- Mejorar feed de eventos en tiempo real.
- Documentar arquitectura de front-end.
- Agregar pruebas automatizadas.
- Mejorar accesibilidad visual.

## Sprint 1: estabilización de formularios

Duración:
- 1 semana.

Objetivo:
- Asegurar que los formularios permitan crear, editar y eliminar registros sin errores.

Historias:
- Como administrador, quiero capturar clientes con campos libres para registrar personas nuevas.
- Como administrador, quiero usar dropdowns solo en campos relacionales para evitar errores.
- Como administrador, quiero editar registros desde la tabla para corregir información.

Criterio de aceptación:
- Crear, editar y eliminar funciona en cada pestaña.
- Los campos de texto no se convierten en dropdowns incorrectos.
- El build del front-end pasa.

## Sprint 2: experiencia responsiva

Duración:
- 1 semana.

Objetivo:
- Mejorar la experiencia en escritorio y móvil.

Historias:
- Como usuario móvil, quiero consultar registros sin que se rompa el layout.
- Como administrador, quiero ver claramente la arquitectura y las métricas.
- Como usuario, quiero mensajes de error comprensibles.

Criterio de aceptación:
- La app se usa en móvil.
- Las tarjetas se reacomodan correctamente.
- Los mensajes de error son legibles.

## Sprint 3: observabilidad y calidad

Duración:
- 1 semana.

Objetivo:
- Integrar evidencia de monitoreo, pruebas y control de versiones.

Historias:
- Como administrador técnico, quiero un health check para validar el API.
- Como desarrollador, quiero pruebas automatizadas para verificar funciones principales.
- Como Product Owner, quiero evidencia de despliegue y operación.

Criterio de aceptación:
- Existe health check público.
- Existen pruebas automatizadas.
- El reporte incluye evidencia de infraestructura.

## Daily meeting

Preguntas:
- Qué hice ayer.
- Qué haré hoy.
- Qué bloqueos existen.

Ejemplo de bloqueo:
- Propagación DNS lenta en subdominio.
- CORS al cambiar de dominio.
- SSH temporalmente inaccesible en Lightsail.

## Sprint review

Se presenta:
- Front-end desplegado.
- API público.
- MongoDB persistente.
- CRUD operativo.
- Feed Socket.IO.
- Evidencia de pruebas.

## Sprint retrospective

Lo que funcionó:
- Reutilizar infraestructura existente.
- Separar front-end, API y base de datos.
- Usar Git para cambios incrementales.

Lo que se puede mejorar:
- Automatizar despliegues del API.
- Agregar monitoreo formal.
- Usar manejo de secretos administrado.
- Agregar pruebas de carga.

## Conclusión

Scrum se aplica como proceso incremental para estabilizar y mejorar la plataforma, evitando cambios grandes sin validación. La metodología permite relacionar backlog, sprints, pruebas, despliegue y retroalimentación con la mejora continua del producto.
