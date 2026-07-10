# T4 - Arquitectura Fase II

## Proyecto

IBEX Carwash Fase II extiende la plataforma desarrollada en Fase I. El objetivo de esta etapa es escalar la aplicación con una arquitectura más modular, incorporar notificaciones en tiempo real, agregar contenerización con Docker y ejecutar pruebas de rendimiento.

## Arquitectura base

La plataforma conserva los componentes funcionales ya desplegados:

Frontend React/Vite en AWS Amplify.
Backend Node.js/Express en AWS Lightsail.
Base de datos MongoDB Atlas.
DNS y HTTPS con Cloudflare.
Realtime con Socket.IO.

Para T4 se agrega una separación por servicios:

Frontend React/Vite
-> Backend principal Express
-> MongoDB Atlas
-> Notifications Service
-> Socket.IO para eventos en tiempo real

## Servicios definidos

### Backend principal

El backend principal conserva la responsabilidad de negocio de la aplicación. Administra entidades como clientes, tutores, estudiantes, vehículos, tareas, slots y reservas. También mantiene la conexión con MongoDB Atlas y expone endpoints de operación.

Responsabilidades:

Recibir peticiones del frontend.
Consultar y modificar datos en MongoDB Atlas.
Emitir eventos de aplicación.
Integrarse con el servicio de notificaciones.
Mantener endpoint de health check.

### Notifications Service

El servicio de notificaciones se agrega como microservicio separado para aislar la responsabilidad de registrar y exponer eventos relevantes del sistema.

Responsabilidades:

Recibir eventos desde el backend principal.
Mantener un historial temporal de notificaciones.
Exponer endpoint de health check.
Exponer endpoint de listado de notificaciones.
Servir como evidencia de separación de responsabilidades.

Este servicio no sustituye Socket.IO. Socket.IO mantiene la entrega en tiempo real hacia el frontend, mientras que Notifications Service representa el componente separado de notificaciones y trazabilidad.

## Justificación de microservicios

La separación propuesta mejora mantenimiento, escalabilidad y tolerancia a fallos. Si el servicio de notificaciones falla, el backend principal puede continuar operando las funciones base. Si el sistema crece, el servicio de notificaciones puede escalarse de manera independiente.

Esta decisión responde al criterio de microservicios porque separa una funcionalidad transversal del sistema: eventos y notificaciones. En una evolución futura, este servicio podría usar Redis Pub/Sub, cola de mensajes o base de datos propia.

## Base de datos

MongoDB Atlas se conserva como base de datos administrada. Esto evita mover datos reales a un contenedor local y mantiene la disponibilidad lograda en Fase I. Para T4, la contenerización se enfoca en los servicios de aplicación, no en reemplazar la base administrada.

## Contenerización

La contenerización de T4 incluirá:

Dockerfile para backend principal.
Dockerfile para notifications-service.
Docker Compose para orquestar los servicios.
Variables de entorno documentadas.
Puertos explícitos.
Health checks o endpoints de verificación.

## Realtime

La plataforma ya cuenta con Socket.IO en backend y socket.io-client en frontend. En T4 se documenta y refuerza esta capacidad para demostrar notificaciones en tiempo real ante acciones de usuario.

Flujo esperado:

Usuario realiza acción en frontend.
Backend procesa la operación.
Backend emite evento.
Frontend recibe evento por Socket.IO.
Usuario observa notificación o actualización dinámica.

## Rendimiento

Las pruebas de carga se realizarán con scripts locales contra endpoints de health, dashboard y notifications-service. Se registrarán resultados de latencia, requests por segundo, errores y conclusiones.

## Objetivo de evidencia

La evidencia técnica de T4 debe demostrar:

Separación de servicios.
Notificaciones en tiempo real.
Docker y Docker Compose.
Pruebas de carga.
Optimización y escalabilidad.
Repositorio público y tag final.
