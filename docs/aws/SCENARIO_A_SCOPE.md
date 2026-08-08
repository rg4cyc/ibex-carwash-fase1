# Escenario A: MVP Serverless

## Objetivo

Desplegar una versión funcional de IBEX completamente administrada en AWS mediante servicios serverless.

## Servicios

Amazon S3

Amazon CloudFront

AWS Certificate Manager

Amazon API Gateway

AWS Lambda

Amazon DynamoDB

AWS SAM

Amazon CloudWatch

AWS IAM

## Funcionalidad incluida

Health check de la API.

Consulta del dashboard.

Listado de recursos.

Creación de recursos.

Actualización de recursos.

Eliminación de recursos.

Registro y consulta de actividades.

## Recursos iniciales

customers

services

sales

activities

## Endpoints iniciales

GET /health

GET /dashboard

GET /resources/{resource}

POST /resources/{resource}

PATCH /resources/{resource}/{id}

DELETE /resources/{resource}/{id}

GET /activities

## Funcionalidad diferida

Socket.IO en tiempo real.

Microservicio persistente de notificaciones.

Procesos de larga duración.

Estas capacidades se demostrarán en el Escenario C con ECS.

## Persistencia DynamoDB

Se utilizará una tabla única para el MVP.

Partition key:

PK

Sort key:

SK

Ejemplos:

PK RESOURCE#customers

SK ITEM#<id>

PK RESOURCE#services

SK ITEM#<id>

PK RESOURCE#sales

SK ITEM#<id>

PK ACTIVITY

SK <timestamp>#<id>

## Seguridad

El bucket S3 permanecerá privado.

CloudFront accederá al bucket mediante Origin Access Control.

Las funciones Lambda utilizarán un IAM Role.

Los permisos DynamoDB se limitarán a la tabla del escenario.

No se almacenarán credenciales en código ni en Git.

## Observabilidad

Logs estructurados en CloudWatch.

Métricas de invocaciones, errores y duración.

Alarma de errores Lambda.

Alarma de respuestas 5XX en API Gateway.

## Criterio de terminación

El escenario estará completo cuando:

El frontend cargue mediante HTTPS.

El bucket no sea accesible directamente.

La API responda mediante API Gateway.

Lambda procese operaciones CRUD.

DynamoDB almacene y recupere información.

CloudWatch muestre logs y métricas.

El despliegue pueda repetirse mediante SAM.
