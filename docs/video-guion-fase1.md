# Guion de video - IBEX Carwash Fase I

Duración sugerida: 4 a 6 minutos.

## 1. Introducción

Hola, en este video presento la Fase I del sistema IBEX Carwash.  
El objetivo de esta versión fue enriquecer la aplicación original para convertirla en un sistema full stack más completo, con gestión de clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas.

La aplicación está desplegada en AWS y usa una arquitectura compuesta por React + Vite en el front-end, Node.js + Express en el back-end, MongoDB Atlas como base de datos y Socket.IO para eventos en tiempo real.

## 2. Despliegue en AWS

La aplicación principal se encuentra publicada en AWS Amplify:

https://main.dh7s19dghakus.amplifyapp.com

También se configuró el dominio personalizado:

https://ibex.ccjira.io

Para la API se utilizó una instancia AWS Lightsail con Nginx como proxy inverso:

https://api-ibex.ccjira.io/api/health

En esta pantalla se puede observar que el API responde correctamente y que la base de datos activa es MongoDB.

## 3. Arquitectura

La arquitectura final utiliza:

- React + Vite para la interfaz.
- Fetch API para consumir servicios HTTP.
- Node.js + Express para exponer endpoints REST.
- Socket.IO para notificaciones en tiempo real.
- MongoDB Atlas para persistencia.
- AWS Amplify para publicar el front-end.
- AWS Lightsail para ejecutar el back-end.
- Cloudflare para DNS y HTTPS del API.

Esta arquitectura separa responsabilidades entre front-end, back-end, base de datos y servicios de infraestructura.

## 4. Funcionalidades principales

El sistema permite administrar las siguientes entidades:

- Clientes.
- Tutores.
- Estudiantes.
- Vehículos.
- Jornadas.
- Tareas.
- Slots.
- Reservas.

Cada pestaña permite crear registros, visualizar registros existentes, editar registros y eliminar registros desde la interfaz gráfica.

## 5. Reglas de negocio implementadas

En la sección de slots, las horas se controlan con valores permitidos en intervalos de media hora, por ejemplo 09:00, 09:30, 10:00 y 10:30.

La duración del slot se limita a 30 o 60 minutos.

En reservas, el usuario no escribe manualmente cliente, vehículo o slot. En su lugar, selecciona datos desde catálogos existentes mediante dropdowns, evitando capturas inválidas y mejorando la integridad de la información.

## 6. Persistencia con MongoDB

Para validar persistencia, se creó un registro de cliente desde la interfaz. Después se reinició el servidor back-end y el dato permaneció disponible, demostrando que la información ya no depende de memoria temporal sino de MongoDB Atlas.

## 7. Tiempo real con Socket.IO

El sistema incluye un feed en tiempo real. Cuando se crean registros o se cargan datos iniciales, el sistema muestra eventos como:

- system:seeded
- clients:created

Esto demuestra comunicación en tiempo real entre back-end y front-end.

## 8. Pruebas y validación

Se realizaron pruebas manuales en navegador de escritorio y en dispositivo móvil. También se validó:

- Compilación del front-end con npm run build.
- Revisión de sintaxis del back-end.
- Respuesta del endpoint /api/health.
- Persistencia en MongoDB.
- Visualización responsive.
- Funcionamiento de CRUD.
- Conexión con API desplegada.

## 9. Cierre

Como conclusión, la Fase I entrega una major release funcional del sistema IBEX Carwash.  
El sistema ya no es solamente una agenda básica, sino una plataforma full stack con catálogos relacionados, persistencia, edición de registros, despliegue cloud, dominio público y eventos en tiempo real.
