#!/usr/bin/env bash

OUT="evidence/tarea3-actividad2/git-evidence.txt"
mkdir -p evidence/tarea3-actividad2

{
  echo "IBEX Carwash Fase I - Evidencia Git Tarea 3 / Actividad 2"
  echo "Fecha:"
  date
  echo
  echo "Repositorio remoto:"
  git remote -v
  echo
  echo "Estado:"
  git status -sb
  echo
  echo "Ultimos commits:"
  git log --oneline --decorate -8
  echo
  echo "Ramas:"
  git branch -a
  echo
  echo "Tags tarea:"
  git tag --list "tarea*"
  echo
  echo "Archivos documentales Tarea 3:"
  find docs/tarea3-actividad2 -maxdepth 1 -type f | sort
  echo
  echo "Scripts Tarea 3:"
  find scripts/tarea3-actividad2 -maxdepth 1 -type f | sort
  echo
  echo "Pruebas automatizadas:"
  node scripts/tarea3-actividad2/automated-tests.mjs
} > "$OUT" 2>&1

cat "$OUT"
echo
echo "GIT_EVIDENCE_WRITTEN_TO=$OUT"
