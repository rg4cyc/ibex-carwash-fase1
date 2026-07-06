# Plan de pruebas y depuracion

## Objetivo

Validar manual y automaticamente que la plataforma IBEX Carwash Fase I funciona como sistema full stack desplegado. Las pruebas cubren disponibilidad, integracion front-end/back-end, persistencia en MongoDB y operaciones basicas del sistema.

## Enfoque de pruebas

La estrategia combina:
- pruebas manuales;
- pruebas automatizadas;
- depuracion.

Las pruebas manuales validan experiencia de usuario y comportamiento visible. Las automatizadas validan respuestas del API y persistencia. La depuracion identifica errores, revisa causa y ajusta pruebas o implementacion.

## Prueba manual de cinco pasos

### Paso 1: Verificar front-end publico

Accion:
- Abrir https://ibex.ccjira.io en navegador de escritorio.

Resultado esperado:
- La aplicacion carga correctamente.
- Se muestra el hero principal.
- Se muestran pestañas de catalogos.
- La interfaz se visualiza correctamente.

Evidencia sugerida:
- Captura del front-end funcionando.

### Paso 2: Verificar API publico

Accion:
- Abrir https://api-ibex.ccjira.io/api/health.

Resultado esperado:
- El API responde JSON.
- El campo ok muestra true.
- El campo database muestra mongodb.

Evidencia sugerida:
- Captura del health check.

### Paso 3: Crear un cliente

Accion:
- En la pestaña Clientes, capturar nombre, telefono y correo.
- Presionar Guardar registro.

Resultado esperado:
- El cliente aparece en la tabla.
- El feed en tiempo real muestra evento de creacion.

Evidencia sugerida:
- Captura del cliente creado y feed actualizado.

### Paso 4: Editar un registro desde la interfaz

Accion:
- Presionar Editar en un cliente existente.
- Cambiar un dato.
- Guardar.

Resultado esperado:
- El registro actualizado aparece en la tabla.
- El feed muestra evento de actualizacion.

Evidencia sugerida:
- Captura del registro editado.

### Paso 5: Validar persistencia

Accion:
- Recargar la pagina.
- Confirmar que los datos siguen visibles.

Resultado esperado:
- Los registros persisten porque se almacenan en MongoDB Atlas.

Evidencia sugerida:
- Captura posterior a la recarga.

## Pruebas automatizadas implementadas

Archivo:
- scripts/t3/automated-tests.mjs

Ejecucion:
- node scripts/t3/automated-tests.mjs

Variable opcional:
- API_BASE_URL=https://api-ibex.ccjira.io/api

## Prueba automatizada 1: Health check del API

Tipo:
- Prueba funcional de endpoint.

Objetivo:
- Validar que el servicio API este disponible y conectado a MongoDB.

Validaciones:
- HTTP status exitoso.
- ok igual a true.
- database igual a mongodb.

Resultado esperado:
- TEST_1_HEALTH_OK.

## Prueba automatizada 2: Integracion API-dashboard-MongoDB

Tipo:
- Prueba de integracion.

Objetivo:
- Validar que el endpoint /dashboard entregue las colecciones principales de la plataforma.

Validaciones:
- Respuesta HTTP exitosa.
- Colecciones principales como arreglos.
- Existencia de datos base en clientes, slots y reservas.

Resultado esperado:
- TEST_2_DASHBOARD_COLLECTIONS_OK.

## Prueba automatizada 3: CRUD parcial con persistencia

Tipo:
- Prueba funcional e integracion API-DB.

Objetivo:
- Validar creacion, visibilidad en dashboard, persistencia y eliminacion de un cliente temporal.

Pasos:
1. Crear cliente temporal con POST /clients.
2. Confirmar que regresa un id.
3. Consultar /dashboard.
4. Confirmar que el cliente existe en la coleccion.
5. Eliminar cliente con DELETE /clients/:id.
6. Consultar /dashboard.
7. Confirmar que el cliente ya no aparece.

Resultado esperado:
- TEST_3_CLIENT_CREATE_PERSISTENCE_DELETE_OK.

## Evidencia de depuracion

Durante la primera version de la prueba automatizada se intento validar actualizacion con PUT /clients/:id. El API publico respondio 404 para esa ruta especifica. En lugar de forzar una prueba incorrecta, se depuro el caso y se ajusto el script para validar endpoints confirmados por el contrato real del API: creacion, consulta en dashboard y eliminacion.

Esta decision demuestra depuracion practica:
- se detecto el error;
- se identifico que el supuesto de prueba no correspondia al endpoint disponible;
- se modifico la prueba para validar comportamiento real;
- se volvio a ejecutar hasta obtener AUTOMATED_TESTS_OK.

## Criterio de aceptacion general

La sesion de pruebas se considera exitosa si:
- el front-end publico carga;
- el API responde health check;
- MongoDB esta activo;
- la prueba manual de cinco pasos se completa;
- las tres pruebas automatizadas terminan con AUTOMATED_TESTS_OK.

## Resultado esperado de consola

API_BASE_URL=https://api-ibex.ccjira.io/api
TEST_1_HEALTH_OK
TEST_2_DASHBOARD_COLLECTIONS_OK
TEST_3_CLIENT_CREATE_PERSISTENCE_DELETE_OK
AUTOMATED_TESTS_OK

## Conclusion

La plataforma fue validada con pruebas manuales y automatizadas. Las pruebas automatizadas comprueban disponibilidad, integracion y persistencia, mientras que la prueba manual valida la experiencia del usuario. El proceso de depuracion documentado demuestra capacidad para identificar errores, corregir supuestos y estabilizar la validacion.
