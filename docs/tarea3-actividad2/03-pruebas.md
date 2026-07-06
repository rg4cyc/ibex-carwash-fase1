# Plan de pruebas

## Objetivo

Validar manual y automáticamente que la plataforma IBEX Carwash Fase I funciona como sistema full stack desplegado.

## Prueba manual de cinco pasos

### Paso 1: Verificar front-end público

Acción:
- Abrir https://ibex.ccjira.io en navegador de escritorio.

Resultado esperado:
- La aplicación carga correctamente.
- Se muestra el hero principal.
- Se muestran las pestañas de catálogos.
- Se muestra la arquitectura Fase I.

Evidencia sugerida:
- Captura del front-end funcionando.

### Paso 2: Verificar API pública

Acción:
- Abrir https://api-ibex.ccjira.io/api/health.

Resultado esperado:
- El API responde JSON con `ok: true`.
- El campo `database` muestra `mongodb`.

Evidencia sugerida:
- Captura del health check.

### Paso 3: Crear un cliente

Acción:
- En la pestaña Clientes, capturar nombre, teléfono y correo.
- Presionar Guardar registro.

Resultado esperado:
- El cliente aparece en la tabla.
- El feed en tiempo real muestra evento de creación.

Evidencia sugerida:
- Captura de cliente creado y feed actualizado.

### Paso 4: Editar un registro

Acción:
- Presionar Editar en un cliente existente.
- Cambiar un dato.
- Guardar.

Resultado esperado:
- El registro actualizado aparece en la tabla.
- El feed muestra evento de actualización.

Evidencia sugerida:
- Captura del registro editado.

### Paso 5: Validar persistencia

Acción:
- Reiniciar el navegador o recargar la página.
- Confirmar que los registros siguen visibles.

Resultado esperado:
- Los datos persisten porque se almacenan en MongoDB Atlas.

Evidencia sugerida:
- Captura después de recargar.

## Pruebas automatizadas

Se agregan tres pruebas automatizadas en:

`scripts/tarea3-actividad2/automated-tests.mjs`

Las pruebas son:
- Health check del API.
- Validación de dashboard y colecciones principales.
- Prueba CRUD de cliente temporal contra el API público.

## Ejecución

Comando:

`node scripts/tarea3-actividad2/automated-tests.mjs`

Variable opcional:

`API_BASE_URL=https://api-ibex.ccjira.io/api`

## Criterio de aceptación

La entrega se considera válida si:
- El front-end carga.
- El API responde.
- MongoDB está activo.
- Las pruebas automatizadas terminan con `AUTOMATED_TESTS_OK`.
- Existe evidencia de prueba manual.
