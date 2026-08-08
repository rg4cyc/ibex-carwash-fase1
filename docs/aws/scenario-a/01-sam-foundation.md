# Escenario A: base AWS SAM

## Objetivo

Crear la primera versión serverless de IBEX mediante una plantilla sencilla de AWS SAM.

## Recursos definidos

Amazon API Gateway expone la ruta GET /health.

AWS Lambda procesa la solicitud.

Amazon DynamoDB proporciona una tabla con claves PK y SK.

AWS IAM se genera mediante la política DynamoDBCrudPolicy limitada a la tabla IBEX.

Amazon CloudWatch recibirá automáticamente los logs de ejecución de Lambda.

## Decisiones

La tabla utiliza capacidad bajo demanda para evitar configurar capacidad fija durante el MVP.

El cifrado de DynamoDB se encuentra habilitado.

La recuperación a un punto en el tiempo se encuentra habilitada.

La primera función solamente implementa el health check.

Las operaciones CRUD se agregarán de forma incremental después de validar esta base.

## Alcance de este paso

Este paso no despliega recursos en AWS.

Solamente crea, valida, compila y prueba localmente la aplicación.
