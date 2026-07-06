# Licitacion tecnica, monitoreo y seguridad

## Objetivo

Diseñar una licitacion tecnica para seleccionar herramientas de monitoreo, observabilidad y seguridad para la plataforma IBEX Carwash Fase I.

La plataforma esta compuesta por:
- front-end en AWS Amplify;
- API Node.js/Express en AWS Lightsail;
- base de datos MongoDB Atlas;
- DNS y HTTPS con Cloudflare.

La licitacion busca garantizar estabilidad, disponibilidad, tiempo de respuesta adecuado y proteccion contra fallas o ataques comunes.

## Alcance de la licitacion

Se evaluaron tres propuestas/proveedores tecnicos:

1. AWS CloudWatch + metricas de AWS Lightsail.
2. MongoDB Atlas Monitoring + Alerts.
3. Cloudflare Analytics + Security.

Cada propuesta fue evaluada con base en:
- cobertura de infraestructura;
- cobertura de base de datos;
- cobertura de trafico web;
- capacidad de alertas;
- seguridad;
- facilidad de implementacion;
- costo para un proyecto academico;
- escalabilidad futura;
- compatibilidad con la arquitectura actual.

## Propuesta 1: AWS CloudWatch + Lightsail Metrics

### Servicio evaluado

AWS CloudWatch permite observar metricas de infraestructura, crear alarmas y analizar comportamiento del servidor. En IBEX se usa para supervisar la instancia Lightsail que aloja el API.

### Cobertura

- CPU.
- Trafico de red.
- Disponibilidad de la instancia.
- Alarmas ante consumo elevado.
- Metricas asociadas al servidor API.

### Ventajas

- Integracion nativa con AWS.
- Adecuado para Lightsail.
- Permite alarmas y dashboards.
- Escalable si el proyecto migra a EC2, ECS, App Runner u otros servicios AWS.

### Limitaciones

- No observa por si mismo las consultas internas de MongoDB.
- Requiere configuracion adicional para logs de aplicacion.
- No reemplaza monitoreo de base de datos ni monitoreo perimetral.

### Seguridad asociada

- Acceso a AWS protegido por IAM.
- Principio de minimo privilegio.
- SSH mediante llave.
- Puertos expuestos minimos.
- Nginx como reverse proxy.
- PM2 para mantener Node.js activo.
- Variables de entorno fuera del repositorio.

## Propuesta 2: MongoDB Atlas Monitoring + Alerts

### Servicio evaluado

MongoDB Atlas Monitoring permite observar estado de la base de datos administrada, conexiones, lecturas, escrituras, tamaño de datos y comportamiento del cluster.

### Cobertura

- Conexiones activas.
- Operaciones de lectura y escritura.
- Estado del cluster.
- Uso de almacenamiento.
- Alertas de base de datos.
- Diagnostico de latencia o crecimiento.

### Ventajas

- Especializado en MongoDB.
- No requiere instalar agentes en el servidor.
- Separa administracion de datos del API.
- Facilita escalar a clusters dedicados en produccion.

### Limitaciones

- No monitorea el front-end ni el API Node.js completo.
- Algunas funciones avanzadas dependen del plan elegido.
- Requiere mantener credenciales y listas de acceso correctamente configuradas.

### Seguridad asociada

- Usuario de base de datos con contraseña.
- URI de conexion fuera de GitHub.
- Variable MONGODB_URI en entorno del servidor.
- Base de datos separada por nombre logico.
- Restriccion de acceso por red cuando sea posible.
- Backups administrados al escalar a planes superiores.

## Propuesta 3: Cloudflare Analytics + Security

### Servicio evaluado

Cloudflare administra DNS, capa HTTPS y analitica basica de trafico. Tambien permite reglas de seguridad perimetral, diagnostico de errores de origen y proteccion contra trafico no deseado.

### Cobertura

- DNS.
- HTTPS.
- Trafico web.
- Errores de origen.
- Proteccion basica de capa perimetral.
- Analisis de peticiones por dominio.

### Ventajas

- Mejora la exposicion publica del front-end y API.
- Permite identificar errores 522, 525 u otros problemas de origen.
- Agrega una capa entre usuario y servidor.
- Reduce complejidad en la administracion de dominios.

### Limitaciones

- No reemplaza monitoreo interno del servidor.
- No monitorea logica de negocio ni base de datos.
- Depende de correcta configuracion SSL/TLS.

### Seguridad asociada

- DNS administrado.
- HTTPS en dominios publicos.
- Proxy para dominios aplicables.
- Reglas de seguridad futuras.
- Separacion de subdominio front-end y subdominio API.
- CORS limitado a dominios autorizados.

## Tabla comparativa de licitacion

| Criterio | AWS CloudWatch | MongoDB Atlas Monitoring | Cloudflare Analytics/Security |
|---|---:|---:|---:|
| Infraestructura del API | Alto | Bajo | Medio |
| Base de datos | Bajo | Alto | Bajo |
| Trafico web publico | Medio | Bajo | Alto |
| Alertas | Alto | Alto | Medio |
| Seguridad | Alto | Alto | Alto |
| Facilidad de implementacion | Media | Alta | Alta |
| Costo academico | Bajo/medio | Bajo en tier inicial | Bajo en plan inicial |
| Escalabilidad futura | Alta | Alta | Alta |
| Compatibilidad con IBEX | Alta | Alta | Alta |

## Evaluacion de proveedores

### Mejor cobertura de servidor

AWS CloudWatch es la mejor opcion para observar el servidor Lightsail porque se integra directamente con la infraestructura AWS donde corre el API.

### Mejor cobertura de base de datos

MongoDB Atlas Monitoring es la mejor opcion para observar la base de datos porque entiende metricas especificas de MongoDB.

### Mejor cobertura perimetral

Cloudflare es la mejor opcion para observar trafico publico, DNS, HTTPS y errores entre cliente y origen.

## Seleccion final

La propuesta ganadora no es una herramienta aislada, sino una combinacion hibrida:

- AWS CloudWatch para infraestructura.
- MongoDB Atlas Monitoring para base de datos.
- Cloudflare Analytics/Security para trafico, DNS y HTTPS.

Esta decision es adecuada porque la plataforma esta distribuida. Ninguna herramienta por si sola cubre todos los componentes. La combinacion permite monitoreo por capas: usuario, red, servidor, aplicacion y base de datos.

## Configuracion de seguridad recomendada

- Mantener secretos fuera de GitHub.
- Usar variables de entorno en servidor y Amplify.
- Limitar CORS a https://ibex.ccjira.io y URL de Amplify.
- Usar HTTPS publico.
- Mantener Nginx como reverse proxy.
- Ejecutar Node.js con PM2.
- Restringir puertos innecesarios.
- Mantener backups y snapshots.
- Usar usuarios de base de datos con permisos limitados.
- Revisar logs ante errores de disponibilidad.
- Configurar health checks automaticos.
- Escalar Lightsail a 1 GB o 2 GB RAM si aumenta el trafico.

## Conclusion

La licitacion demuestra que la administracion de plataforma requiere monitoreo por capas. Para IBEX Carwash Fase I, la combinacion de AWS CloudWatch, MongoDB Atlas Monitoring y Cloudflare Analytics/Security ofrece mejor cobertura que seleccionar un solo proveedor. Esta estrategia permite detectar fallas de infraestructura, problemas de base de datos, errores de trafico y riesgos de seguridad.
