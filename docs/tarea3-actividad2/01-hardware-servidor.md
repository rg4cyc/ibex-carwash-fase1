# Seleccion de hardware y servidor para la base de datos

## Contexto de la plataforma

IBEX Carwash Fase I es una aplicacion web full stack para administrar clientes, tutores, estudiantes, vehiculos, jornadas, tareas, slots y reservas dentro de un programa prelaboral.

La plataforma utiliza:
- Front-end React + Vite.
- Back-end Node.js + Express.
- Comunicacion en tiempo real con Socket.IO.
- Persistencia en MongoDB Atlas.
- AWS Amplify para el front-end.
- AWS Lightsail para el API.
- Nginx como reverse proxy.
- Cloudflare para DNS y HTTPS.

## Decision de arquitectura

Se eligio una arquitectura distribuida:

Usuario
-> Cloudflare DNS / HTTPS
-> AWS Amplify para front-end
-> API Node.js en AWS Lightsail
-> MongoDB Atlas como base NoSQL administrada

Esta separacion permite que la base de datos no dependa del servidor del API. Si la instancia Lightsail falla, los datos permanecen en MongoDB Atlas.

## Hardware logico seleccionado para la base de datos

Para esta fase se eligio MongoDB Atlas Free Tier en AWS N. Virginia como base de datos administrada.

Configuracion usada:
- Servicio: MongoDB Atlas.
- Tipo: base NoSQL administrada.
- Region: AWS N. Virginia / us-east-1.
- Motor: MongoDB.
- Almacenamiento inicial: 512 MB en tier gratuito.
- Administracion: gestionada por MongoDB Atlas.
- Acceso: MongoDB Driver desde Node.js.
- Seguridad: usuario de base de datos, URI privada y variables de entorno.

## Justificacion de disco duro

La aplicacion actual maneja datos de baja y mediana volumetria:
- clientes;
- tutores;
- estudiantes;
- vehiculos;
- jornadas;
- tareas;
- slots;
- reservas;
- eventos de actividad.

Para la entrega academica, 512 MB son suficientes porque se trata de un sistema funcional con datos controlados y bajo volumen. Para una version productiva se recomienda escalar a un cluster dedicado M10 o superior, con mayor almacenamiento, backups administrados y monitoreo avanzado.

## Justificacion de memoria RAM

La base de datos ejecuta operaciones CRUD, consultas de dashboard y lectura de colecciones principales. No se ejecutan cargas analiticas pesadas ni agregaciones masivas.

MongoDB Atlas administra la memoria del servicio. Para esta fase, el tier inicial es suficiente. Para produccion, un cluster dedicado permitiria mas memoria para indices, cache y conexiones concurrentes.

En el servidor API se usa AWS Lightsail con 512 MB RAM, 2 vCPU y 20 GB SSD. Esta configuracion es adecuada para una carga academica de baja concurrencia. Como mejora productiva se recomienda escalar a 1 GB o 2 GB RAM, agregar swap, monitoreo y backups.

## Justificacion de topologia de red

La topologia separa clientes, front-end, API y base de datos:

Clientes web
-> Cloudflare
-> Amplify
-> API Lightsail
-> MongoDB Atlas

Ventajas:
- separacion de responsabilidades;
- menor riesgo de perdida de datos;
- despliegue independiente de front-end y back-end;
- dominio publico separado para front-end y API;
- escalabilidad futura;
- seguridad por capas.

## Justificacion del sistema operativo

Para el servidor API se eligio Ubuntu 24.04 LTS en AWS Lightsail.

Justificacion:
- es una distribucion estable y ampliamente documentada;
- tiene soporte de largo plazo;
- es compatible con Node.js, Nginx y PM2;
- permite administracion por SSH;
- es adecuada para un proyecto web full stack;
- facilita mantenimiento, actualizaciones y despliegue.

MongoDB Atlas administra el sistema operativo subyacente de la base de datos, lo cual reduce la carga operativa y evita administrar parches manuales del motor de base de datos.

## Servidor del API

Configuracion usada:
- Servicio: AWS Lightsail.
- Sistema operativo: Ubuntu 24.04 LTS.
- RAM: 512 MB.
- CPU: 2 vCPU.
- Disco: 20 GB SSD.
- Proceso Node.js: PM2.
- Proxy: Nginx.
- Dominio API: https://api-ibex.ccjira.io.

## Decision final

Se conserva MongoDB Atlas como base NoSQL administrada, AWS Lightsail como servidor de API, AWS Amplify como front-end y Cloudflare como capa DNS/HTTPS.

Esta decision es adecuada para la Actividad 2 porque demuestra administracion real de una plataforma desplegada, separa datos de servidor, reduce complejidad operativa y permite crecimiento hacia Fase II.
