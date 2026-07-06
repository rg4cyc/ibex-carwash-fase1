# Evidencia de capturas - T3

Guardar todas las capturas reales en:

assets/screenshots/t3/

Capturas finales requeridas:

01_frontend_publico.png
02_lightsail_instancia.png
03_mongodb_atlas.png
04_api_health.png
05_cloudflare_dns.png
06_prueba_manual_crear_cliente.png
07_prueba_manual_editar_cliente.png
08_prueba_manual_persistencia.png
09_pruebas_automatizadas.png
10_scrum_product_backlog.png
11_scrum_sprint_planning.png
12_git_evidencia_integral.png

Comando para pruebas automatizadas:

cd /Users/vier/Documents/tm-fullstack/ibex-carwash-fase1
node scripts/t3/automated-tests.mjs

Comando para evidencia Git integral:

cd /Users/vier/Documents/tm-fullstack/ibex-carwash-fase1
echo "=== GIT LOG ==="
git log --oneline --decorate -5
echo
echo "=== BRANCHES ==="
git branch -a
echo
echo "=== TAGS ==="
git tag --list "t*"
