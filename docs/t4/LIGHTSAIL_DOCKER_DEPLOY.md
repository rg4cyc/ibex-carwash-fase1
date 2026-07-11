# Despliegue Docker T4 en Lightsail

## Objetivo

Desplegar la Fase II de IBEX Carwash con Docker Compose en Lightsail sin romper la producción existente.

La producción original se mantiene:

Frontend: https://ibex.ccjira.io  
API: https://api-ibex.ccjira.io  

El despliegue T4 corre en paralelo con puertos alternos:

Backend container: 14000 -> 4000  
Notifications container: 14010 -> 4010  
Frontend container: 14173 -> 4173  

## Archivos usados

docker-compose.yml  
docker-compose.lightsail.yml  
backend/Dockerfile  
frontend/Dockerfile  
services/notifications-service/Dockerfile  

## Comando de despliegue en servidor

docker compose -f docker-compose.yml -f docker-compose.lightsail.yml up --build -d

## Verificación en servidor

docker compose -f docker-compose.yml -f docker-compose.lightsail.yml ps

curl -s http://localhost:14000/api/health
curl -s http://localhost:14010/health
curl -I http://localhost:14173
curl -s -X POST http://localhost:14000/api/t4/notify \
  -H "Content-Type: application/json" \
  -d '{"title":"Evento T4 Lightsail","message":"Docker Compose corriendo en Lightsail","type":"lightsail"}'

## Nginx sugerido

Para exponer la demo T4 desde el dominio existente sin cambiar producción:

location /t4-realtime-demo {
    proxy_pass http://127.0.0.1:14000/t4-realtime-demo;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /socket.io/ {
    proxy_pass http://127.0.0.1:14000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /api/t4/ {
    proxy_pass http://127.0.0.1:14000/api/t4/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

## URL esperada

https://api-ibex.ccjira.io/t4-realtime-demo

## Nota importante

Este despliegue no reemplaza la producción original. Corre en paralelo para demostrar Fase II con Docker Compose, microservicio de notificaciones y Socket.IO en un entorno de servidor.
