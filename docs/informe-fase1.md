# Informe Fase I - IBEX Carwash

## Introducción

IBEX Carwash Fase I es una aplicación web full stack desarrollada para administrar la operación de un programa prelaboral basado en jornadas de lavado de autos. Esta fase amplía la versión inicial del sistema incorporando catálogos relacionados, persistencia en base de datos, edición de registros, despliegue en la nube y comunicación en tiempo real.

## Objetivo

Desarrollar una major release del sistema IBEX Carwash que permita gestionar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas mediante una interfaz gráfica web conectada a un back-end y a una base de datos.

## Alcance

La Fase I incluye:

- CRUD para clientes.
- CRUD para tutores.
- CRUD para estudiantes.
- CRUD para vehículos.
- CRUD para jornadas.
- CRUD para tareas.
- CRUD para slots.
- CRUD para reservas.
- Dropdowns relacionales para evitar captura manual incorrecta.
- Persistencia en MongoDB Atlas.
- Eventos en tiempo real con Socket.IO.
- Front-end publicado en AWS Amplify.
- Back-end publicado en AWS Lightsail.
- API expuesta mediante Cloudflare y Nginx.
- Interfaz responsive validada en móvil.

## URLs de entrega

- Aplicación principal: https://main.dh7s19dghakus.amplifyapp.com
- Dominio personalizado: https://ibex.ccjira.io
- API pública: https://api-ibex.ccjira.io/api/health
- Repositorio GitHub: https://github.com/rg4cyc/ibex-carwash-fase1

## Arquitectura técnica

La solución usa una arquitectura web separada por responsabilidades:

- React + Vite para el front-end.
- Fetch API para la comunicación HTTP.
- Node.js + Express para el back-end.
- Socket.IO para eventos en tiempo real.
- MongoDB Atlas para la base de datos.
- AWS Amplify para el despliegue del front-end.
- AWS Lightsail para el despliegue del back-end.
- Nginx como proxy inverso.
- Cloudflare para DNS y HTTPS del API.

## Evidencia visual sugerida

Insertar aquí las capturas tomadas:

1. Front-end funcionando en AWS Amplify.
2. API health respondiendo con MongoDB.
3. Instancia Lightsail corriendo.
4. Despliegue Amplify activo.
5. MongoDB Atlas conectado.
6. DNS de Cloudflare.
7. Vista responsive móvil.

## Funcionalidades implementadas

### Clientes

Permite crear, visualizar, editar y eliminar clientes. Los campos principales son nombre, teléfono y correo electrónico.

### Tutores

Permite administrar tutores asociados al programa.

### Estudiantes

Permite registrar estudiantes, asociarlos a un tutor y definir estado y habilidades.

### Vehículos

Permite registrar vehículos relacionados con clientes existentes.

### Jornadas

Permite crear jornadas operativas con fecha, estado y objetivo.

### Tareas

Permite asignar tareas a jornadas y estudiantes. También permite avanzar estado de tareas.

### Slots

Permite crear espacios disponibles para la operación. Las horas se controlan por dropdown y solamente admiten intervalos de media hora. La duración está limitada a 30 o 60 minutos.

### Reservas

Permite crear reservas usando catálogos existentes de cliente, vehículo y slot. Esto evita capturas manuales inconsistentes.

## Persistencia

La aplicación se conectó a MongoDB Atlas. Se validó la persistencia creando registros desde la interfaz, reiniciando el back-end y confirmando que los datos seguían disponibles.

## Comunicación en tiempo real

Socket.IO se usa para mostrar eventos en el feed de la interfaz. Por ejemplo, al cargar datos iniciales o crear registros, el sistema notifica el evento recibido.

## Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Carga del front-end en AWS Amplify | Exitosa |
| API health pública | Exitosa |
| Conexión con MongoDB Atlas | Exitosa |
| Creación de cliente desde GUI | Exitosa |
| Persistencia después de reiniciar back-end | Exitosa |
| CRUD con edición y eliminación | Exitosa |
| Dropdowns relacionales | Exitosa |
| Vista móvil responsive | Exitosa |
| Socket.IO feed | Exitosa |

## Retos y soluciones

### Reto: Persistencia de datos

Inicialmente el sistema podía funcionar con memoria local, pero para Fase I se integró MongoDB Atlas. Esto permitió persistencia real y mejor alineación con una aplicación full stack.

### Reto: Despliegue separado

El front-end se desplegó en AWS Amplify y el back-end en AWS Lightsail. Para conectarlos se configuraron variables de entorno y CORS.

### Reto: Dominio y HTTPS

Se configuró Cloudflare para exponer el API mediante `api-ibex.ccjira.io`. También se configuró el dominio personalizado del front-end como mejora adicional.

### Reto: Reglas de captura

Se reemplazaron campos manuales por dropdowns en entidades relacionales como reservas, tareas y slots, reduciendo errores de captura.

## Conclusión

La Fase I transforma IBEX Carwash en una aplicación full stack funcional, desplegada en nube y con datos persistentes. La solución incluye una interfaz responsive, operaciones CRUD, validaciones básicas, relaciones entre entidades, integración con MongoDB, eventos en tiempo real y despliegue público en AWS.
