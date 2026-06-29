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
