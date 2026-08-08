# Presentación express IBEX AWS

## Apertura

IBEX es una aplicación para administrar clientes, tutores, estudiantes, vehículos, jornadas, tareas, slots y reservas.

El objetivo fue migrar una aplicación existente a una arquitectura administrada en AWS.

## Arquitectura implementada

El frontend está desarrollado con React y Vite.

Se publica en Amazon S3 y se accede mediante el dominio HTTPS ibex-aws.ccjira.io.

El frontend consume una API REST publicada con Amazon API Gateway.

API Gateway invoca una función AWS Lambda.

Lambda no conserva estado entre solicitudes, por lo que el Escenario A es stateless.

La persistencia se encuentra en Amazon DynamoDB.

CloudWatch registra las invocaciones y permite revisar errores y métricas.

La infraestructura se define con AWS SAM.

## Demostración

1. Abrir https://ibex-aws.ccjira.io
2. Mostrar los contadores.
3. Abrir Clientes.
4. Mostrar Tutores, Estudiantes y Reservas.
5. Crear un registro temporal.
6. Editarlo.
7. Eliminarlo.
8. Mostrar que el contador vuelve al valor original.

## Resultados verificados

Frontend HTTPS: 200.

API health: 200.

Ocho categorías operativas.

CRUD probado con creación 201, actualización 200 y eliminación 200.

Datos almacenados en DynamoDB.

Repositorio y evidencias publicados en GitHub.

## Escenarios siguientes

El Escenario B propone una VPC con PostgreSQL privado en Amazon RDS.

El Escenario C propone contenerización con Docker, ECR, ECS Fargate y un Application Load Balancer.

Se priorizó terminar y probar completamente el Escenario A antes de implementar parcialmente los escenarios siguientes.

## Cierre

El resultado es una aplicación serverless funcional, accesible por HTTPS, escalable y desplegada mediante infraestructura como código.
