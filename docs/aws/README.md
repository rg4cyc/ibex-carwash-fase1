# IBEX AWS

Este directorio documenta la implementación de IBEX mediante tres escenarios incrementales en Amazon Web Services.

## Escenario A

Frontend en Amazon S3 y CloudFront.

API mediante Amazon API Gateway y AWS Lambda.

Persistencia mediante Amazon DynamoDB.

Infraestructura serverless administrada con AWS SAM.

Observabilidad mediante Amazon CloudWatch.

## Escenario B

Extensión del Escenario A con Amazon RDS for PostgreSQL.

La base de datos se ubicará en subredes privadas dentro de una VPC.

El acceso será controlado mediante Security Groups y credenciales administradas.

## Escenario C

Backend de IBEX empaquetado como contenedor Docker.

La imagen se almacenará en Amazon ECR.

El servicio se ejecutará mediante Amazon ECS con AWS Fargate.

El tráfico se expondrá mediante un Application Load Balancer.

## Principios

Cada escenario debe permanecer funcional de forma independiente.

No se almacenarán secretos en Git.

Cada recurso tendrá etiquetas de proyecto, ambiente y escenario.

La aplicación actual no se modificará hasta completar la auditoría técnica.
