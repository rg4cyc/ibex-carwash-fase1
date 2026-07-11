# Tarea 4 Fase II del proyecto IBEX Carwash

## Datos generales

Materia: Desarrollo Full Stack

Proyecto: IBEX Carwash Fase II

Repositorio público: https://github.com/rg4cyc/ibex-carwash-fase1

Rama final: main

Tag final: t4-submit

Frontend público: https://ibex.ccjira.io

API pública: https://api-ibex.ccjira.io/api/health

Demo pública T4: https://api-ibex.ccjira.io/t4-realtime-demo

Video de demostración: https://youtu.be/frh-78AA2qQ

## Introducción

IBEX Carwash Fase II extiende la aplicación construida en la primera fase mediante una arquitectura más modular, integración de microservicios, notificaciones en tiempo real, contenerización con Docker Compose, pruebas de rendimiento y despliegue en AWS Lightsail.

El objetivo principal fue evolucionar el sistema sin romper la versión productiva existente. Para lograrlo se conservó la base funcional de React, Node.js, Express, Socket.IO y MongoDB Atlas, y se agregó un microservicio independiente de notificaciones. También se agregó un ambiente contenerizado con Docker Compose y una demo pública desplegada en Lightsail.

La entrega final demuestra que la aplicación puede ejecutarse con servicios separados, que el backend puede comunicarse con un microservicio de notificaciones, que los eventos se reciben en tiempo real y que la solución puede desplegarse en un servidor real.

## Objetivos

El primer objetivo fue separar responsabilidades mediante un microservicio independiente de notificaciones.

El segundo objetivo fue demostrar comunicación en tiempo real usando Socket.IO.

El tercer objetivo fue contenerizar los servicios principales usando Docker y Docker Compose.

El cuarto objetivo fue desplegar la Fase II en AWS Lightsail sin interrumpir la producción existente.

El quinto objetivo fue validar el funcionamiento mediante pruebas técnicas, pruebas de integración, pruebas de rendimiento y evidencia visual.

## Arquitectura general

La arquitectura de Fase II está formada por un frontend React, un backend principal Node.js con Express, un microservicio de notificaciones, comunicación realtime con Socket.IO, base de datos MongoDB Atlas, Docker Compose y Nginx como proxy en Lightsail.

El frontend permite interactuar con la aplicación. El backend principal mantiene la lógica del sistema, consulta MongoDB Atlas, emite eventos realtime y reenvía eventos al microservicio de notificaciones. El microservicio de notificaciones recibe eventos, los registra temporalmente y expone endpoints de consulta y salud.

La versión productiva original se mantuvo funcionando, mientras que la Fase II fue desplegada en paralelo con Docker Compose. Esto permitió probar la nueva arquitectura sin afectar el sistema existente.

IMAGEN_02_AQUI

Figura 2. Estructura del proyecto con backend, frontend y microservicio de notificaciones.

## Microservicios implementados

El backend principal se encuentra en la carpeta backend. Este servicio recibe peticiones del frontend, mantiene la lógica de negocio, se conecta a MongoDB Atlas, emite eventos con Socket.IO y envía eventos relevantes al microservicio de notificaciones.

El microservicio de notificaciones se encuentra en la carpeta services/notifications-service. Este servicio expone endpoints de salud, eventos y notificaciones. Su responsabilidad es recibir eventos generados por el backend y mantenerlos disponibles para consulta.

Esta separación permite que el sistema sea más mantenible, ya que la lógica de notificaciones no queda mezclada con la lógica principal. También permite escalar o modificar el servicio de notificaciones sin alterar todo el backend.

IMAGEN_03_AQUI

Figura 3. Prueba de integración entre backend y microservicio de notificaciones.

## Notificaciones en tiempo real

La aplicación utiliza Socket.IO para enviar eventos en tiempo real. La demo pública permite presionar un botón que llama al backend. El backend recibe el evento, lo emite por Socket.IO y lo reenvía al microservicio de notificaciones.

La demo pública se encuentra en la siguiente URL:

https://api-ibex.ccjira.io/t4-realtime-demo

En la evidencia se observa Socket.IO conectado, el backend usando MongoDB Atlas, la respuesta del POST con status 201, el valor forwarded true y los eventos recibidos en pantalla.

IMAGEN_11_AQUI

Figura 11. Demo pública HTTPS en Lightsail con Socket.IO conectado y evento realtime funcionando.

## Docker Compose

La Fase II incluye Dockerfiles para backend, frontend y microservicio de notificaciones. También incluye un archivo docker-compose para orquestar los servicios.

Docker Compose levanta tres servicios principales. El backend corre dentro de un contenedor, el frontend corre dentro de otro contenedor y el microservicio de notificaciones corre en un tercer contenedor. Estos servicios se comunican entre sí mediante la red creada por Docker Compose.

IMAGEN_04_AQUI

Figura 4. Archivo docker-compose con servicios backend, frontend y notifications-service.

IMAGEN_05_AQUI

Figura 5. Contenedores ejecutándose con Docker Compose.

IMAGEN_10_AQUI

Figura 10. Docker Desktop mostrando backend, frontend y notifications-service activos.

## Despliegue en AWS Lightsail

La Fase II fue desplegada en AWS Lightsail usando Docker Compose en paralelo a la producción existente. La producción previa se mantuvo activa con PM2 y Nginx, mientras que T4 se ejecutó con contenedores separados.

En Lightsail, el backend T4 corre en un contenedor, el microservicio de notificaciones corre en otro contenedor y el frontend T4 corre en otro contenedor. Nginx expone la demo pública por HTTPS mediante la ruta t4-realtime-demo.

La URL pública de evidencia es:

https://api-ibex.ccjira.io/t4-realtime-demo

La evidencia pública confirma respuesta HTTP 200 por HTTPS, microservicio de notificaciones saludable, backend conectado a MongoDB Atlas y eventos enviados correctamente al microservicio.

IMAGEN_11_AQUI

Figura 11. Despliegue público en Lightsail expuesto por HTTPS.

## MongoDB Atlas

La base de datos utilizada es MongoDB Atlas. El backend en contenedor se conecta a MongoDB Atlas mediante variables de entorno. Esta configuración evita subir secretos al repositorio y permite mantener la base de datos como un servicio administrado.

La evidencia del backend muestra database mongodb y los logs del contenedor muestran conexión correcta a la base ibex_carwash_fase1.

## Pruebas de integración

Se realizaron pruebas para validar el microservicio de notificaciones de forma aislada y también la comunicación entre backend y microservicio.

La prueba de integración confirmó que el backend está saludable, que el microservicio está saludable, que el backend puede reenviar un evento y que el microservicio recibe el evento correctamente.

IMAGEN_03_AQUI

Figura 3. Resultado de la prueba backend hacia notifications-service.

## Pruebas de rendimiento

Se ejecutó una prueba de carga con 190 peticiones totales y cero fallos. La prueba cubrió el health del backend, el endpoint de dashboard, el health del microservicio de notificaciones y el flujo backend hacia notifications-service.

Los resultados principales fueron los siguientes.

Backend health tuvo 60 peticiones exitosas y cero fallos.

Backend dashboard tuvo 40 peticiones exitosas y cero fallos.

Notifications health tuvo 60 peticiones exitosas y cero fallos.

Backend to notifications event tuvo 30 peticiones exitosas y cero fallos.

El resumen final fue totalFailed 0 y PERFORMANCE_TEST_OK.

IMAGEN_07_AQUI

Figura 7. Resultados de rendimiento con 190 peticiones y cero fallos.

## Evidencia Docker

La evidencia Docker confirma que los servicios se construyen y se ejecutan correctamente. También confirma que el backend, el frontend y el microservicio de notificaciones están activos.

IMAGEN_06_AQUI

Figura 6. Resultados de verificación Docker.

IMAGEN_10_AQUI

Figura 10. Contenedores Docker activos.

## Evidencia GitHub

El repositorio público se encuentra en GitHub. La entrega final está en la rama main y marcada con el tag t4-submit.

IMAGEN_09_AQUI

Figura 9. Repositorio público en GitHub con la entrega T4.

## Video de demostración

El video de demostración se encuentra disponible en el siguiente enlace:

https://youtu.be/frh-78AA2qQ

En el video se muestra la arquitectura del proyecto, los microservicios, Docker Compose, el despliegue en Lightsail, la demo pública por HTTPS, Socket.IO conectado, MongoDB Atlas, el microservicio de notificaciones y las pruebas de rendimiento.

## Control de versiones

El proyecto se versionó en GitHub. Se trabajó inicialmente en la rama t4 y después se integró a main. El tag final t4-submit apunta al commit final de entrega.

Repositorio:

https://github.com/rg4cyc/ibex-carwash-fase1

Tag final:

https://github.com/rg4cyc/ibex-carwash-fase1/releases/tag/t4-submit

## Conclusiones

La Fase II de IBEX Carwash cumple con la implementación de microservicios, notificaciones en tiempo real, Docker Compose, despliegue en AWS Lightsail y pruebas de rendimiento.

La solución mantiene la aplicación productiva existente y agrega una arquitectura contenerizada desplegada en servidor. El backend en contenedor se conecta a MongoDB Atlas, emite eventos en tiempo real con Socket.IO y reenvía eventos al microservicio de notificaciones.

Las pruebas muestran que los servicios responden correctamente y que el flujo backend hacia notifications-service funciona. La evidencia visual, técnica y de GitHub respalda la entrega final.
