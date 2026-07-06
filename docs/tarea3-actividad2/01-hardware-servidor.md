# Selección de hardware y servidor para la base de datos

## Contexto de la plataforma

IBEX Carwash Fase I es una aplicación web full stack para administrar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas dentro de un programa prelaboral. La plataforma utiliza un front-end React + Vite, un back-end Node.js + Express, comunicación en tiempo real con Socket.IO y persistencia en MongoDB Atlas.

La decisión de infraestructura separa responsabilidades:
- AWS Amplify aloja el front-end estático.
- AWS Lightsail aloja el API Node.js.
- MongoDB Atlas aloja la base de datos.
- Cloudflare administra DNS y HTTPS.
- Nginx funciona como proxy inverso del API.

## Hardware lógico seleccionado para la base de datos

Para esta fase se eligió MongoDB Atlas Free Tier en AWS / N. Virginia como base de datos administrada. Aunque no se administra hardware físico directamente, sí se selecciona una topología de servicio que cubre las necesidades actuales de la aplicación.

Configuración usada:
- Servicio: MongoDB Atlas.
- Tipo: replica set administrado.
- Región: AWS N. Virginia / us-east-1.
- Motor: MongoDB 8.x.
- Almacenamiento: 512 MB en tier gratuito.
- Modelo de administración: base de datos administrada por Atlas.
- Sistema operativo subyacente: administrado por MongoDB Atlas.
- Acceso: conexión segura mediante MongoDB Driver desde Node.js.

## Justificación de disco

La aplicación actual maneja catálogos de baja y mediana volumetría:
- Clientes.
- Tutores.
- Estudiantes.
- Vehículos.
- Jornadas.
- Tareas.
- Slots.
- Reservas.
- Actividades/eventos.

En Fase I y Actividad 2 el volumen esperado es pequeño, por lo que 512 MB son suficientes para demostrar persistencia, CRUD y relaciones lógicas. Para producción real se propone escalar a M10 o superior, ya que permitiría más almacenamiento, monitoreo avanzado, backups y mayor capacidad de conexiones.

## Justificación de RAM

La base de datos se utiliza para operaciones CRUD simples, filtros de catálogos y consultas de dashboard. No se ejecutan cargas analíticas pesadas ni agregaciones complejas. En la etapa actual, el tier administrado es suficiente porque el objetivo principal es validar persistencia, arquitectura y administración de plataforma.

Para una etapa productiva con múltiples usuarios concurrentes se recomienda escalar a un cluster dedicado, porque MongoDB se beneficia de memoria disponible para índices y working set.

## Justificación de topología

La topología seleccionada es una base de datos administrada por MongoDB Atlas. La ventaja sobre instalar MongoDB manualmente en Lightsail es que Atlas proporciona:
- Administración del motor de base de datos.
- Separación entre API y datos.
- Seguridad mediante usuario/contraseña y lista de acceso de red.
- Monitoreo básico.
- Escalabilidad futura.
- Menor riesgo operativo.

La separación también facilita la recuperación: si el servidor Lightsail falla, los datos permanecen fuera de la instancia.

## Justificación de sistema operativo

Para el back-end se eligió Ubuntu 24.04 LTS en AWS Lightsail. Ubuntu LTS es una distribución estable, ampliamente documentada y adecuada para Node.js, Nginx, PM2 y despliegues web. La versión LTS reduce el riesgo de incompatibilidades y permite mantener paquetes de seguridad por un periodo extendido.

## Servidor del API

Configuración usada:
- Servicio: AWS Lightsail.
- Sistema operativo: Ubuntu 24.04 LTS.
- Tamaño: 512 MB RAM, 2 vCPU, 20 GB SSD.
- IP estática: configurada.
- Proceso Node.js administrado con PM2.
- Nginx como proxy inverso.
- Dominio API: https://api-ibex.ccjira.io.

Esta configuración es suficiente para una aplicación académica con baja concurrencia. Para producción real, se recomienda escalar a una instancia de al menos 1 GB RAM o 2 GB RAM, agregar monitoreo, backups automáticos y un proceso de despliegue controlado.

## Decisión final

Para Actividad 2 se conserva MongoDB Atlas como base administrada, AWS Lightsail como servidor de API y AWS Amplify como front-end. Esta decisión maximiza disponibilidad, reduce complejidad operativa y demuestra administración real de una plataforma distribuida.
