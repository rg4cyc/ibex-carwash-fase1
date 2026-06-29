# Arquitectura Fase I

## Decisión principal

La Fase I utiliza una arquitectura monolítica organizada para acelerar el desarrollo, reducir complejidad y mantener bajo control la operación inicial.

## Componentes

- Front-end: React + Vite.
- Back-end: Node.js + Express.
- Comunicación en tiempo real: Socket.IO.
- Base de datos: MongoDB Atlas.
- DNS: Cloudflare.
- Hosting objetivo: AWS Amplify para front-end y AWS Lightsail para back-end.

## Justificación

Se eligió MongoDB Atlas por velocidad de implementación y flexibilidad. Se eligió Socket.IO sobre PieSocket porque permite controlar los eventos desde el backend propio y reduce dependencias externas.

## Arquitectura desplegada

La arquitectura final de Fase I quedó compuesta por:

- React + Vite desplegado en AWS Amplify.
- Node.js + Express + Socket.IO desplegado en AWS Lightsail.
- Nginx como proxy inverso para exponer el API en HTTP/HTTPS mediante Cloudflare.
- MongoDB Atlas como base de datos administrada.
- Cloudflare como DNS y capa de HTTPS para el subdominio del API.

El front-end consume el API mediante variables de entorno de Vite:

- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`

El back-end utiliza variables de entorno privadas en el servidor:

- `PORT`
- `CLIENT_ORIGIN`
- `MONGODB_URI`
- `DB_NAME`

Los secretos no se versionan en GitHub. Para fases posteriores se recomienda migrar la gestión de secretos a AWS Secrets Manager o AWS Systems Manager Parameter Store.

