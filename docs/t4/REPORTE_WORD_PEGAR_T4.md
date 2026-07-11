# Tarea 4 Fase II del proyecto IBEX Carwash

## Datos generales

Materia: Desarrollo Full Stack

Proyecto: IBEX Carwash Fase II

Repositorio publico: https://github.com/rg4cyc/ibex-carwash-fase1

Rama final: main

Tag final: t4-submit

Frontend publico: https://ibex.ccjira.io

API publica: https://api-ibex.ccjira.io/api/health

Demo publica T4: https://api-ibex.ccjira.io/t4-realtime-demo

Video de demostracion: https://youtu.be/frh-78AA2qQ

## Introduccion

IBEX Carwash Fase II extiende la aplicacion construida en la primera fase mediante una arquitectura mas modular, integracion de microservicios, notificaciones en tiempo real, contenerizacion con Docker Compose, pruebas de rendimiento y despliegue en AWS Lightsail.

El objetivo principal fue evolucionar el sistema sin romper la version productiva existente. Para lograrlo se conservo la base funcional de React, Node.js, Express, Socket.IO y MongoDB Atlas, y se agrego un microservicio independiente de notificaciones. Tambien se agrego un ambiente contenerizado con Docker Compose y una demo publica desplegada en Lightsail.

La entrega final demuestra que la aplicacion puede ejecutarse con servicios separados, que el backend puede comunicarse con un microservicio de notificaciones, que los eventos se reciben en tiempo real y que la solucion puede desplegarse en un servidor real.

## Objetivos

El primer objetivo fue separar responsabilidades mediante un microservicio independiente de notificaciones.

El segundo objetivo fue demostrar comunicacion en tiempo real usando Socket.IO.

El tercer objetivo fue contenerizar los servicios principales usando Docker y Docker Compose.

El cuarto objetivo fue desplegar la Fase II en AWS Lightsail sin interrumpir la produccion existente.

El quinto objetivo fue validar el funcionamiento mediante pruebas tecnicas, pruebas de integracion, pruebas de rendimiento y evidencia visual.

## Arquitectura general

La arquitectura de Fase II esta formada por un frontend React, un backend principal Node.js con Express, un microservicio de notificaciones, comunicacion realtime con Socket.IO, base de datos MongoDB Atlas, Docker Compose y Nginx como proxy en Lightsail.

El frontend permite interactuar con la aplicacion. El backend principal mantiene la logica del sistema, consulta MongoDB Atlas, emite eventos realtime y reenvia eventos al microservicio de notificaciones. El microservicio de notificaciones recibe eventos, los registra temporalmente y expone endpoints de consulta y salud.

La version productiva original se mantuvo funcionando, mientras que la Fase II fue desplegada en paralelo con Docker Compose. Esto permitio probar la nueva arquitectura sin afectar el sistema existente.

IMAGEN_02_AQUI

Figura 2. Estructura del proyecto con backend, frontend y microservicio de notificaciones.

## Microservicios implementados

El backend principal se encuentra en la carpeta backend. Este servicio recibe peticiones del frontend, mantiene la logica de negocio, se conecta a MongoDB Atlas, emite eventos con Socket.IO y envia eventos relevantes al microservicio de notificaciones.

El microservicio de notificaciones se encuentra en la carpeta services notifications service. Este servicio expone endpoints de salud, eventos y notificaciones. Su responsabilidad es recibir eventos generados por el backend y mantenerlos disponibles para consulta.

Esta separacion permite que el sistema sea mas mantenible, ya que la logica de notificaciones no queda mezclada con la logica principal. Tambien permite escalar o modificar el servicio de notificaciones sin alterar todo el backend.

IMAGEN_03_AQUI

Figura 3. Prueba de integracion entre backend y microservicio de notificaciones.

## Notificaciones en tiempo real

La aplicacion utiliza Socket.IO para enviar eventos en tiempo real. La demo publica permite presionar un boton que llama al backend. El backend recibe el evento, lo emite por Socket.IO y lo reenvia al microservicio de notificaciones.

La demo publica se encuentra en la siguiente URL:

https://api-ibex.ccjira.io/t4-realtime-demo

En la evidencia se observa Socket.IO conectado, el backend usando MongoDB Atlas, la respuesta del POST con status 201, el valor forwarded true y los eventos recibidos en pantalla.

IMAGEN_11_AQUI

Figura 11. Demo publica HTTPS en Lightsail con Socket.IO conectado y evento realtime funcionando.

## Docker Compose

La Fase II incluye Dockerfiles para backend, frontend y microservicio de notificaciones. Tambien incluye un archivo docker compose para orquestar los servicios.

Docker Compose levanta tres servicios principales. El backend corre dentro de un contenedor, el frontend corre dentro de otro contenedor y el microservicio de notificaciones corre en un tercer contenedor. Estos servicios se comunican entre si mediante la red creada por Docker Compose.

IMAGEN_04_AQUI

Figura 4. Archivo docker compose con servicios backend, frontend y notifications service.

IMAGEN_05_AQUI

Figura 5. Contenedores ejecutandose con Docker Compose.

IMAGEN_10_AQUI

Figura 10. Docker Desktop mostrando backend, frontend y notifications service activos.

## Despliegue en AWS Lightsail

La Fase II fue desplegada en AWS Lightsail usando Docker Compose en paralelo a la produccion existente. La produccion previa se mantuvo activa con PM2 y Nginx, mientras que T4 se ejecuto con contenedores separados.

En Lightsail, el backend T4 corre en un contenedor, el microservicio de notificaciones corre en otro contenedor y el frontend T4 corre en otro contenedor. Nginx expone la demo publica por HTTPS mediante la ruta t4 realtime demo.

La URL publica de evidencia es:

https://api-ibex.ccjira.io/t4-realtime-demo

La evidencia publica confirma respuesta HTTP 200 por HTTPS, microservicio de notificaciones saludable, backend conectado a MongoDB Atlas y eventos enviados correctamente al microservicio.

IMAGEN_11_AQUI

Figura 11. Despliegue publico en Lightsail expuesto por HTTPS.

## MongoDB Atlas

La base de datos utilizada es MongoDB Atlas. El backend en contenedor se conecta a MongoDB Atlas mediante variables de entorno. Esta configuracion evita subir secretos al repositorio y permite mantener la base de datos como un servicio administrado.

La evidencia del backend muestra database mongodb y los logs del contenedor muestran conexion correcta a la base ibex carwash fase1.

## Pruebas de integracion

Se realizaron pruebas para validar el microservicio de notificaciones de forma aislada y tambien la comunicacion entre backend y microservicio.

La prueba de integracion confirmo que el backend esta saludable, que el microservicio esta saludable, que el backend puede reenviar un evento y que el microservicio recibe el evento correctamente.

IMAGEN_03_AQUI

Figura 3. Resultado de la prueba backend hacia notifications service.

## Pruebas de rendimiento

Se ejecuto una prueba de carga con 190 peticiones totales y cero fallos. La prueba cubrio el health del backend, el endpoint de dashboard, el health del microservicio de notificaciones y el flujo backend hacia notifications service.

Los resultados principales fueron los siguientes.

Backend health tuvo 60 peticiones exitosas y cero fallos.

Backend dashboard tuvo 40 peticiones exitosas y cero fallos.

Notifications health tuvo 60 peticiones exitosas y cero fallos.

Backend to notifications event tuvo 30 peticiones exitosas y cero fallos.

El resumen final fue totalFailed 0 y PERFORMANCE TEST OK.

IMAGEN_07_AQUI

Figura 7. Resultados de rendimiento con 190 peticiones y cero fallos.

## Evidencia Docker

La evidencia Docker confirma que los servicios se construyen y se ejecutan correctamente. Tambien confirma que el backend, el frontend y el microservicio de notificaciones estan activos.

IMAGEN_06_AQUI

Figura 6. Resultados de verificacion Docker.

IMAGEN_10_AQUI

Figura 10. Contenedores Docker activos.

## Evidencia GitHub

El repositorio publico se encuentra en GitHub. La entrega final esta en la rama main y marcada con el tag t4 submit.

IMAGEN_09_AQUI

Figura 9. Repositorio publico en GitHub con la entrega T4.

## Video de demostracion

El video de demostracion se encuentra disponible en el siguiente enlace:

https://youtu.be/frh-78AA2qQ

En el video se muestra la arquitectura del proyecto, los microservicios, Docker Compose, el despliegue en Lightsail, la demo publica por HTTPS, Socket.IO conectado, MongoDB Atlas, el microservicio de notificaciones y las pruebas de rendimiento.

## Control de versiones

El proyecto se versiono en GitHub. Se trabajo inicialmente en la rama t4 y despues se integro a main. El tag final t4 submit apunta al commit final de entrega.

Repositorio:

https://github.com/rg4cyc/ibex-carwash-fase1

Tag final:

https://github.com/rg4cyc/ibex-carwash-fase1/releases/tag/t4-submit

## Conclusiones

La Fase II de IBEX Carwash cumple con la implementacion de microservicios, notificaciones en tiempo real, Docker Compose, despliegue en AWS Lightsail y pruebas de rendimiento.

La solucion mantiene la aplicacion productiva existente y agrega una arquitectura contenerizada desplegada en servidor. El backend en contenedor se conecta a MongoDB Atlas, emite eventos en tiempo real con Socket.IO y reenvia eventos al microservicio de notificaciones.

Las pruebas muestran que los servicios responden correctamente y que el flujo backend hacia notifications service funciona. La evidencia visual, tecnica y de GitHub respalda la entrega final.
