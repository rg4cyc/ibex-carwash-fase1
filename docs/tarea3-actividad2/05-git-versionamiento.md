# Control de versiones y recuperación

## Objetivo

Demostrar el uso profesional de Git y GitHub para administrar cambios, mantener historial, recuperar versiones y documentar la evolución de la plataforma.

## Repositorio

Repositorio público:
- https://github.com/rg4cyc/ibex-carwash-fase1

Rama principal:
- main

Rama de trabajo para Actividad 2:
- actividad-2-admin-servidores

Tags:
- tarea2-100-baseline
- tarea3-actividad2-submit

## Flujo de trabajo

1. Crear tag del estado estable previo.
2. Crear rama de trabajo.
3. Agregar documentación y pruebas.
4. Ejecutar pruebas locales.
5. Hacer commit descriptivo.
6. Hacer merge a main.
7. Crear tag final de entrega.
8. Subir a GitHub.

## Comandos usados

Crear tag base:

`git tag tarea2-100-baseline`

Crear rama:

`git checkout -B actividad-2-admin-servidores`

Ver estado:

`git status --short`

Agregar cambios:

`git add docs/tarea3-actividad2 scripts/tarea3-actividad2`

Commit:

`git commit -m "add activity 2 platform administration evidence"`

Merge:

`git checkout main`
`git merge actividad-2-admin-servidores`

Tag final:

`git tag tarea3-actividad2-submit`

Push:

`git push`
`git push --tags`

## Recuperación de versión anterior

Para revisar el estado estable anterior:

`git checkout tarea2-100-baseline`

Para volver a main:

`git checkout main`

Para deshacer un commit sin borrar historial:

`git revert <commit>`

Para crear una rama desde una versión anterior:

`git checkout -b recuperacion-demo tarea2-100-baseline`

## Ventajas del flujo usado

- Mantiene historial claro.
- Permite recuperación.
- Evita modificar producción sin control.
- Facilita revisión del profesor.
- Demuestra buenas prácticas de ingeniería.
- Permite diferenciar entregas por tags.

## Evidencia recomendada

Capturas sugeridas:
- GitHub con lista de commits.
- Rama `actividad-2-admin-servidores`.
- Tags del proyecto.
- Archivos de documentación.
- Resultado de pruebas automatizadas.
- Repositorio público.

## Conclusión

El uso de Git no se limita a guardar código. En esta actividad se utiliza para demostrar trazabilidad, continuidad entre fases, recuperación de versiones y administración profesional de la plataforma.
