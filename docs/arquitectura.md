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
