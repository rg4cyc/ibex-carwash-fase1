# T4 - Análisis de rendimiento y escalabilidad

## Objetivo

Validar que la arquitectura Fase II responde bajo carga moderada y que los servicios principales se mantienen disponibles usando Docker Compose.

## Servicios evaluados

Backend principal Express.
Notifications Service.
Frontend React/Vite como build de producción.
MongoDB Atlas como base de datos administrada.

## Endpoints evaluados

GET /api/health.
GET /api/dashboard.
GET /health del notifications-service.
POST /api/t4/notify para validar integración backend -> notifications-service.

## Criterios de revisión

Errores HTTP.
Latencia promedio.
Latencia p95.
Requests por segundo.
Disponibilidad de contenedores.
Evidencia de integración entre servicios.

## Interpretación

Una ejecución correcta debe tener cero errores en health checks y en el flujo backend -> notifications-service. El endpoint dashboard puede ser más pesado porque consulta colecciones de MongoDB, por lo que su latencia esperada puede ser mayor que /api/health.

## Optimización aplicada

Separación de responsabilidades mediante notifications-service.
Health checks en Docker Compose.
Frontend servido como build de producción.
Variables de entorno externas para no subir secretos.
Uso de MongoDB Atlas administrado.
Backend tolerante a fallos si notifications-service no está disponible.

## Mejoras futuras

Agregar Redis Adapter para escalar Socket.IO horizontalmente.
Agregar caché para dashboard.
Agregar índices específicos en MongoDB según consultas de mayor uso.
Agregar observabilidad con logs centralizados y métricas.
