#!/bin/sh

echo "IBEX T4 Evidence Helper"
echo

echo "Abriendo archivos principales..."
open docs/t4/03-evidencia-tecnica-t4.md 2>/dev/null || true
open docs/t4/04-checklist-capturas-t4.md 2>/dev/null || true
open docs/t4/performance-results.txt 2>/dev/null || true
open docs/t4/docker-check-results.txt 2>/dev/null || true
open docs/t4/backend-notifications-integration-test.txt 2>/dev/null || true

echo
echo "Abriendo URLs locales utiles en Firefox..."
open -a "Firefox" "http://localhost:4173" 2>/dev/null || true
open -a "Firefox" "http://localhost:4000/api/health" 2>/dev/null || true
open -a "Firefox" "http://localhost:4010/health" 2>/dev/null || true

echo
echo "EVIDENCE_HELPER_DONE"
