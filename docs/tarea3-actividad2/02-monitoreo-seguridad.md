# Monitoreo y seguridad

## Objetivo

Proponer herramientas que permitan observar disponibilidad, rendimiento, seguridad y errores de la plataforma IBEX Carwash Fase I.

## Herramienta 1: AWS CloudWatch

Uso propuesto:
- Métricas de CPU, red y disponibilidad de la instancia Lightsail.
- Alarmas de uso alto.
- Revisión de comportamiento del servidor API.
- Evidencia de operación en AWS.

Ventajas:
- Integración nativa con AWS.
- Permite alarmas y dashboards.
- Adecuado para infraestructura en Lightsail.
- Modelo de pago por uso.

Seguridad:
- Acceso controlado por IAM.
- Permite separar permisos de lectura, operación y administración.
- No requiere exponer datos de negocio.

## Herramienta 2: MongoDB Atlas Monitoring

Uso propuesto:
- Monitoreo de conexiones a la base de datos.
- Lecturas y escrituras por periodo.
- Tamaño de datos.
- Estado del cluster.
- Alertas de disponibilidad.

Ventajas:
- Está integrado con MongoDB Atlas.
- Muestra métricas específicas de base de datos.
- Permite diagnosticar problemas de conexión, latencia y crecimiento de datos.

Seguridad:
- Usuarios de base de datos con permisos limitados.
- Lista de acceso de red.
- Cadenas de conexión fuera del repositorio.
- Contraseñas en variables de entorno.

## Herramienta 3: Cloudflare Analytics y Security

Uso propuesto:
- DNS administrado.
- HTTPS frente al usuario.
- Métricas de tráfico.
- Revisión de errores 522, 525 u otros.
- Protección básica contra abuso.
- Capa adicional para ocultar parte de la infraestructura.

Ventajas:
- Simplifica DNS y HTTPS.
- Permite revisar problemas de origen.
- Puede agregar reglas de seguridad.
- Puede operar con plan gratuito para un proyecto académico.

Seguridad:
- Proxy de tráfico.
- Administración de SSL/TLS.
- Reglas de seguridad por dominio.
- Separación entre dominio público y servidor de origen.

## Comparación resumida

| Herramienta | Cubre | Fortalezas | Uso en IBEX |
|---|---|---|---|
| AWS CloudWatch | Infraestructura | Métricas y alarmas de servidor | API en Lightsail |
| MongoDB Atlas Monitoring | Base de datos | Conexiones, lecturas, escrituras, tamaño | Persistencia |
| Cloudflare | DNS, HTTPS, tráfico | Seguridad perimetral y diagnóstico de errores | Dominios públicos |

## Medidas de seguridad aplicadas

- Secretos fuera de GitHub mediante variables de entorno.
- MongoDB URI almacenada en `.env` del servidor.
- CORS limitado a front-end autorizado.
- API servida mediante Nginx.
- Dominio público con HTTPS.
- Acceso SSH mediante llave.
- PM2 para mantener el proceso activo.
- GitHub público sin credenciales.
- Cloudflare como capa DNS/HTTPS.

## Recomendaciones futuras

- Migrar secretos a AWS Secrets Manager o AWS Systems Manager Parameter Store.
- Activar alertas de CloudWatch.
- Configurar backups programados.
- Agregar logging estructurado.
- Implementar health checks externos.
- Restringir SSH por IP cuando la operación sea estable.
- Escalar Lightsail a 1 GB o 2 GB si aumenta el uso.
