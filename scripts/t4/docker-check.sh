#!/bin/sh

echo "IBEX T4 Docker Check"
date
echo

echo "Docker version:"
docker --version
echo

echo "Docker Compose version:"
docker compose version
echo

echo "Compose config:"
docker compose config --quiet && echo "COMPOSE_CONFIG_OK"
echo

echo "Container status:"
docker compose ps
echo

echo "Backend health:"
curl -sS http://localhost:4000/api/health || echo "BACKEND_HEALTH_FAILED"
echo
echo

echo "Notifications health:"
curl -sS http://localhost:4010/health || echo "NOTIFICATIONS_HEALTH_FAILED"
echo
echo

echo "Frontend HEAD:"
curl -I -sS http://localhost:4173 | head -20 || echo "FRONTEND_HEAD_FAILED"
echo

echo "Backend -> notifications integration through Docker:"
curl -sS -X POST http://localhost:4000/api/t4/notify \
  -H "Content-Type: application/json" \
  -d '{"type":"t4.docker","title":"Docker integration event","message":"Backend container forwarded event to notifications-service container","entity":{"runtime":"docker-compose"}}' \
  || echo "DOCKER_NOTIFY_FAILED"
echo
echo

echo "Notifications list:"
curl -sS http://localhost:4010/notifications || echo "NOTIFICATIONS_LIST_FAILED"
echo
echo

echo "T4_DOCKER_CHECK_DONE"
