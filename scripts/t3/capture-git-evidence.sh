#!/usr/bin/env bash

OUT="docs/t3/git-evidence.txt"
mkdir -p docs/t3

{
  echo "IBEX Carwash Fase I - Evidencia Git T3"
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
  echo "Tags t:"
  git tag --list "t*"
  echo
  echo "Archivos documentales T3:"
  find docs/t3 -maxdepth 1 -type f | sort
  echo
  echo "Scripts T3:"
  find scripts/t3 -maxdepth 1 -type f | sort
  echo
  echo "Capturas esperadas T3:"
  find assets/screenshots/t3 -maxdepth 1 -type f | sort
  echo
  echo "Pruebas automatizadas:"
  node scripts/t3/automated-tests.mjs
} > "$OUT" 2>&1

cat "$OUT"
echo
echo "GIT_EVIDENCE_WRITTEN_TO=$OUT"
