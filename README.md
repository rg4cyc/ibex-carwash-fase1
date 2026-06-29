# IBEX Carwash Fase I

Aplicación web full stack para gestionar la operación de IBEX Carwash como sistema de proyectos, tareas, usuarios/equipo, clientes, estudiantes, reservas y comunicación en tiempo real.

## Stack

- React + Vite
- Node.js + Express
- Socket.IO
- MongoDB Atlas
- Cloudflare DNS
- AWS como arquitectura objetivo de despliegue

## Funcionalidades

- Dashboard operativo.
- Gestión de clientes.
- Gestión de tutores.
- Gestión de estudiantes.
- Gestión de vehículos.
- Gestión de jornadas/proyectos.
- Gestión de tareas.
- Gestión de slots.
- Gestión de reservas.
- Feed de eventos en tiempo real con Socket.IO.
- API REST con operaciones CRUD.
- Diseño responsivo.

## Ejecución local

Back-end:

cd backend
npm install
cp .env.example .env
npm run dev

Front-end:

cd frontend
npm install
npm run dev

URLs:

- Front-end: http://localhost:5173
- Back-end: http://localhost:8080
- Health: http://localhost:8080/api/health

## Base de datos

El proyecto está preparado para MongoDB Atlas usando la variable:

MONGODB_URI

Si no se configura MONGODB_URI, el servidor usa almacenamiento temporal en memoria para permitir pruebas locales rápidas. Para entrega final, se recomienda conectar MongoDB Atlas.

## Arquitectura objetivo

Cloudflare DNS
↓
ibex.ccjira.io -> AWS Amplify Hosting
api-ibex.ccjira.io -> AWS Lightsail Node.js
↓
Node.js + Express + Socket.IO
↓
MongoDB Atlas

## Despliegue en nube

La Fase I fue desplegada en servicios de nube para validar una arquitectura full stack funcional.

### Front-end

- Servicio: AWS Amplify
- URL: https://main.dh7s19dghakus.amplifyapp.com
- Fuente: repositorio GitHub conectado a la rama `main`
- Build: React + Vite desde la carpeta `frontend`

### Back-end

- Servicio: AWS Lightsail
- Servidor: Ubuntu 24.04 LTS
- Proceso: Node.js + Express + Socket.IO ejecutado con PM2
- Proxy inverso: Nginx
- API pública: https://api-ibex.ccjira.io/api/health

### Base de datos

- Servicio: MongoDB Atlas
- Base: `ibex_carwash_fase1`
- Persistencia validada mediante creación de registros desde la interfaz y posterior consulta desde el front-end desplegado.

### DNS y HTTPS

- Servicio DNS: Cloudflare
- Subdominio API: `api-ibex.ccjira.io`
- Modo SSL utilizado para Fase I: Flexible
- Mejora futura recomendada: migrar a Full Strict con certificado TLS en el servidor de origen.

