# Hallazgos técnicos de IBEX para AWS

## Frontend

El frontend está desarrollado con React y Vite.

Consume el backend mediante dos variables principales:

VITE_API_BASE_URL

VITE_SOCKET_URL

La compilación estática puede desplegarse en Amazon S3 y distribuirse mediante Amazon CloudFront.

## Backend actual

El backend utiliza Node.js, Express, MongoDB y Socket.IO.

Los endpoints principales detectados son:

GET /api/health

GET /api/dashboard

GET /api/:resource

POST /api/:resource

PATCH /api/:resource/:id

DELETE /api/:resource/:id

POST /api/t4/notify

## Persistencia actual

La capa de datos está concentrada en funciones genéricas que operan sobre colecciones.

Este diseño permite reemplazar la implementación de persistencia sin modificar inmediatamente el frontend.

Para el Escenario A se creará una implementación independiente basada en DynamoDB.

Para el Escenario B se creará una implementación independiente basada en PostgreSQL.

## Tiempo real

Socket.IO requiere un proceso persistente y no será el foco inicial del Escenario A.

El Escenario A utilizará operaciones HTTP y eventos almacenados.

El Escenario C será el escenario apropiado para ejecutar Socket.IO dentro de un contenedor persistente en ECS.

## Riesgos

No se debe reutilizar el archivo backend/.env en infraestructura serverless.

No se deben incluir credenciales ni cadenas de conexión en Git.

Los archivos de demostración local contienen referencias localhost y no se usarán como frontend productivo de AWS.

No se debe modificar el backend productivo existente mientras se construyen los escenarios AWS.

## Estrategia

Cada escenario tendrá una implementación aislada.

El frontend reutilizará sus componentes visuales, pero apuntará a una API diferente mediante variables de compilación.

La infraestructura se probará primero en un ambiente dev antes de crear recursos de demostración.
