# Control de versiones, ramas, flujo de trabajo y recuperacion

## Objetivo

Demostrar el uso profesional de Git y GitHub para administrar cambios, mantener historial, recuperar versiones y documentar la evolucion de la plataforma IBEX Carwash Fase I.

## Repositorio publico

Repositorio:
- https://github.com/rg4cyc/ibex-carwash-fase1

Rama principal:
- main

Rama de trabajo para Actividad 2:
- t3

Tags:
- t2-baseline
- t3-submit

## Flujo de trabajo aplicado

| Etapa | Accion | Comando representativo | Proposito |
|---|---|---|---|
| 1 | Marcar estado estable previo | git tag t2-baseline | Identificar version aprobada de Tarea 2 |
| 2 | Crear rama de trabajo | git checkout -B t3 | Aislar cambios de T3 |
| 3 | Agregar documentacion y scripts | git add docs/t3 scripts/t3 | Preparar evidencia |
| 4 | Registrar cambios | git commit -m "add activity 2 platform administration evidence" | Crear punto trazable |
| 5 | Integrar a main | git merge t3 | Llevar cambios aprobados a rama principal |
| 6 | Marcar entrega final | git tag t3-submit | Identificar version entregable |
| 7 | Publicar en GitHub | git push && git push --tags | Compartir repositorio publico |

## Comandos reales usados

- git status -sb
- git log --oneline --decorate -5
- git branch -a
- git tag --list "tarea*"
- git checkout -B t3
- git add docs/t3 scripts/t3
- git commit -m "add activity 2 platform administration evidence"
- git checkout main
- git merge t3
- git tag t3-submit
- git push -u origin main
- git push -u origin t3
- git push --tags

## Recuperacion de una version anterior

La recuperacion se puede realizar usando el tag t2-baseline, que representa el estado estable anterior a los cambios de T3.

### Consultar version anterior sin modificar main

Comando:
- git checkout t2-baseline

### Regresar a la rama principal

Comando:
- git checkout main

### Crear una rama de recuperacion desde la version anterior

Comando:
- git checkout -b recuperacion-demo t2-baseline

### Volver a main despues de la demostracion

Comando:
- git checkout main

### Deshacer un commit sin borrar historial

Comando:
- git revert <commit>

## Evidencia generada

Archivo generado para capturas:
- docs/t3/git-evidence.txt

Este archivo contiene:
- estado de rama;
- ultimos commits;
- ramas locales y remotas;
- tags de entrega;
- remote de GitHub;
- archivos documentales de T3;
- scripts de T3;
- resultado de pruebas automatizadas.

## Estructura de versionamiento

t2-baseline
-> t3
-> main
-> t3-submit

## Buenas practicas aplicadas

- Se trabajo en una rama dedicada.
- Se mantuvo un tag del estado estable previo.
- Se documento el flujo de trabajo.
- Se integro la rama a main.
- Se creo un tag final de entrega.
- Se publico en GitHub.
- Se evito subir secretos.
- Se evito agregar archivos locales de entregas anteriores.
- Se documento como recuperar una version anterior.

## Archivos locales no versionados

Durante la entrega existian archivos locales de fases anteriores, como documentos Word, PDF, video y ZIP. Estos aparecen como ?? en git status, pero no se agregaron al commit porque no forman parte del codigo ni de la documentacion tecnica de esta actividad.

Esto demuestra control intencional del repositorio: solo se versionan los archivos relevantes.

## Conclusion

El sistema de control de versiones implementado cubre creacion de repositorio, ramas, commits, flujo de trabajo, tags, merge, publicacion en GitHub y recuperacion de versiones anteriores. La estructura es clara, trazable y permite identificar tanto el estado anterior aprobado como la version final de T3.
