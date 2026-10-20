# Aprueba Administración

Backend para gestionar usuarios, soporte, preguntas, patrocinadores, planes, métricas y operación de Aprueba. Dirigido a usuarios administrativos. El producto del equipo es la API; el frontend heredado sirve de apoyo a la demostración.

Conservamos JavaScript, Node.js y Express, Firestore y frontend React/Vite. Alcance: 27 endpoints administrativos del contrato original. No se migra a FastAPI ni se usan los dos Word descartados. Vercel existente no se modifica con este paquete.

## Leer primero

- [Checklist manual del bloque C](docs/15_CHECKLIST_MANUAL_FELIPE.md).
- [Pruebas automáticas C del 19/10/2026](docs/16_PRUEBAS_AUTOMATICAS_C_2026-10-19.md).

- [Bloque C de Felipe, pruebas y pendientes de Stripe](docs/12_BLOQUE_C_FELIPE.md).
- [Revisión asistida del bloque A para Felipe](docs/13_REVISION_A_PARA_FELIPE.md).

- [Punto exacto de avance](docs/00_CONTROL_FASE2.md).
- [Recepción de la rama compartida y primeras tareas](docs/07_RECEPCION_SPRINT1.md).
- [Reparto detallado entre los tres](docs/01_REPARTO_EQUIPO.md).
- [Sprint 1 y secuencia de cinco sprints](docs/02_SPRINTS_Y_BACKLOG.md).
- [Datos y relaciones internas](docs/03_DATOS_Y_CONTRATOS_INTERNOS.md).
- [Pruebas y criterios de terminado](docs/04_PRUEBAS_Y_ACEPTACION.md).
- [Pasos para recibir la base y comenzar a programar](docs/05_GUIA_INICIO_EQUIPO.md).
- [Ver la base local y comprobar cambios de precio o stock](docs/06_VISOR_BASE_LOCAL.md).
- [Catálogo verificable de los 27 endpoints](docs/endpoints.json).

## Estado real

**Integración local vigente — 20/10/2026:** A, Catalina y Felipe reunidos en esta misma carpeta en `codex/integracion-fase2`, desde remoto C `db6c916`. Docker arranca y la aplicación está en http://localhost:5173, con visor en http://127.0.0.1:4001/firestore. Regresión conjunta 199/199 y build aprobados; comprobación adicional `note` de E18 reproduce un defecto abierto. Stripe real de pruebas sigue pendiente. Ver [control vigente](docs/00_CONTROL_FASE2.md) y [hallazgos/correcciones](docs/04_PRUEBAS_Y_ACEPTACION.md). Sin cambios a main, push nuevo, despliegue ni carga de Firebase remoto. Los apartados inferiores conservan cortes históricos.

**Publicación C y nueva ejecución — 19/10/2026:** rama `equipo-c/felipe-planes-metricas` publicada por petición de Felipe; código `8cf0a51` verificado remotamente. Hoy se ejecutaron unitarias, las tres suites C, contrato y smoke: 49/49 aprobadas; frontend compila. Stripe usa simulación en tests, pendiente de aceptación sandbox real. Checklist manual y resumen en guías 15 y 16. Sin merge a main ni despliegue solicitado.

**Actualización local — 16/10/2026:** bloque C de Felipe desarrollado en `equipo-c/felipe-planes-metricas` desde `93c8096`. Catálogo/validaciones, baja por suscripciones y métricas periódicas con permisos contractuales; contrato común 8/8. Stripe test tiene adaptador y pruebas simuladas, pero su aceptación en el proveedor sigue pendiente de cuenta/configuración. Revisión humana y publicación pendientes. Ver [guía C](docs/12_BLOQUE_C_FELIPE.md). Los cortes A siguientes conservan sus fechas históricas.

**Publicación confirmada — 03/10/2026:** el incremento A está disponible en `origin/equipo-a/backend-sprints`, commit de implementación `07f0f86`. Código, pruebas, laboratorio y seis Excel publicados; sin merge a main ni despliegue manual. Consultar [recepción y revisión de esta rama](docs/10_RECEPCION_BLOQUE_A.md). El corte técnico/Excel del 29/09 siguiente es histórico: sus menciones a publicación pendiente quedan superadas por esta confirmación; pruebas, revisiones y limitaciones conservan su estado.

Actualización local del 29/09/2026: bloque A implementado en `equipo-a/backend-sprints` desde `c0bd41f`, sin publicación nueva. Diez endpoints de Tsung-Hao, con 23 pruebas de integración A y 5 unitarias aprobadas en Docker. Regresión smoke: 7/7 tanto con operación configurada como sin ella. Suite contractual completa: 1/8 aprobada, 7 defectos B/C pendientes. Esto no acredita aceptación del MVP ni cierre de sprints grupales.

Leer [guía del bloque A y laboratorio Docker](docs/09_GUIA_BLOQUE_A.md), [evidencias y pendientes](docs/08_PLAN_Y_EVIDENCIAS_EQUIPO_A.md) y [seis Excel de ejecución](docs/seguimiento/README.md). La base compartida remota sigue siendo `codex/base-fase2-equipo`; estos cambios nuevos solo están en la copia local hasta revisión/publicación autorizada.

Sin `compose.ops.yaml`, E09–E11 no inventan estados: informan indisponibilidad o contenedor no autorizado. El laboratorio optativo permite consultar y reiniciar realmente **solo** `aprueba-ops-lab`. No usar ese laboratorio en producción.

## Herramientas de cada integrante

Git, VS Code y Docker Desktop con motor Linux y Docker Compose v2, o Docker Engine + Compose en Linux. Con este flujo no necesitan instalar Node, Java, Firebase CLI ni paquetes npm en el computador: quedan en imágenes Docker. Estas imágenes sí ocupan disco y requieren descarga inicial.

No cargar claves Firebase, JWT de Vercel, Stripe ni `.env` real. El entorno usa exclusivamente proyectos demo del emulador. No ejecutar `npm run seed` histórico; usar el servicio `seed` de Compose.

## Primer arranque

Usar la rama `codex/base-fase2-equipo`, no main: comandos en guía 07. La publicación se confirma por la existencia de esa rama remota; no se requiere integrar en main para descargar y revisar el paquete.

Cada integrante obtiene esa rama del MISMO repositorio privado y abre la raíz de su copia en VS Code. Con Docker instalado y abierto, en ese terminal:

```sh
docker version
docker compose version
docker compose config --quiet
docker compose up --build -d
docker compose ps -a
docker compose logs --tail=60 seed backend
```

Esperado: Firestore saludable, seed termina con código 0, backend saludable. Primer build necesita Internet; posteriores reutilizan caché y volumen. No hay que iniciar sesión en Firebase para este emulador.

API: http://localhost:4000/health. Rutas: http://localhost:4000/api/v1/admin.

Visor oficial de la base LOCAL: http://127.0.0.1:4001/firestore. Proyecto `demo-aprueba-equipo`, base `(default)`. Colecciones a la izquierda, documentos al centro y campos a la derecha. No es la consola de Firebase en la nube; no pide tu cuenta de Google. El puerto 4000 sigue siendo Express, no el visor. La configuración se habilitó y el visor fue probado fuera de Docker; la publicación de sus puertos dentro de Compose sigue pendiente de prueba con motor Docker.

Para abrir también la interfaz de Aprueba (distinta del visor de datos):

```sh
docker compose --profile ui up --build -d
```

Frontend: http://localhost:5173. Puertos publicados solo en 127.0.0.1. No exponer estas cuentas en Internet ni activar port forwarding público en Codespaces.

Trabajar con dos pestañas: Aprueba local para ejecutar acciones y visor local para comprobar su persistencia. No usar la URL Vercel mientras prueban la base local. Ver guía 06 para ejemplo reproducible, límites de login y datos ya existentes sin campo color.

## Cuentas ficticias

Correos: `admin@example.test`, `support@example.test`, `finance@example.test`, `ops@example.test`.

Contraseña pública SOLO del emulador: `SoloEmulador_2026_Prueba!`. MFA deshabilitado para estas cuentas: OTP vacío. No reutilizarla en Vercel/cuentas reales. Sustituir las otras cuentas prellenadas que muestra el login heredado.

Comprobar login desde PowerShell:

```powershell
$body = @{email='admin@example.test';password='SoloEmulador_2026_Prueba!'} | ConvertTo-Json
$sesion = Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/v1/admin/auth/login' -ContentType 'application/json' -Body $body
$cabeceras = @{Authorization="Bearer $($sesion.data.accessToken)"}
Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/admin/users' -Headers $cabeceras
```

No copiar tokens a issues, commits o capturas. `/health` solo no comprueba la base; login y consulta comprueban más pasos.

## Pruebas preparadas

```sh
docker compose run --rm --no-deps backend npm test
docker compose --profile test run --build --rm test
docker compose --profile test run --rm test npm run test:contract
```

La segunda orden inicia el emulador de TESTS separado. Cada suite vacía SOLO `demo-aprueba-tests`, carga fixtures, inicia su propio proceso API y lo cierra al terminar. No afecta `demo-aprueba-equipo` ni Firebase real. No ejecutar suites de escritura simultáneas en el mismo emulador de tests; cada integrante tiene el suyo.

- `npm test`: fixtures, guardias y catálogo.
- `test:integration`: arranque, autenticación y persistencia; se espera verde.
- `test:contract`: ocho comprobaciones iniciales, inicialmente ROJO. Corregir implementación, no expectativas. No es cobertura completa de 27 endpoints.

## Programación diaria

Editar con VS Code en esta copia. Compose monta `backend/src`, `backend/dev` y `backend/test`; Node observa cambios y reinicia. Si no detecta el cambio, `docker compose restart backend`. Para nuevas dependencias, actualizar manifiesto y lockfile, reconstruir y coordinar; no basta instalarlas en un contenedor efímero.

```sh
docker compose logs -f backend
docker compose run --rm seed
docker compose stop
docker compose up -d
```

Seed solo crea documentos faltantes; conserva cambios manuales. El emulador exporta al apagarse normalmente e importa al arrancar. Un cierre forzado puede perder cambios sin exportar: estos datos son descartables, no respaldo productivo.

Para retirar contenedores sin borrar volumen:

```sh
docker compose --profile ui --profile test down
```

No usar `down -v` rutinariamente: borraría datos locales y cambios manuales. Un reinicio de datos exige acordar el objetivo y solo afecta su copia local. Ninguna instrucción aquí borra datos remotos.

## Problemas habituales

- Docker no reconocido: instalar/abrir Docker Desktop y nueva terminal; confirmar motor Linux. El paquete no instala Docker Desktop.
- Daemon inaccesible: esperar inicio de Docker Desktop.
- Puerto ocupado: identificar proceso antes de detenerlo. Cambiar puerto izquierdo de Compose si hace falta, no `backend:4000` interno.
- Descargas fallan: revisar Internet/proxy, no desactivar TLS.
- Guardia rechaza credenciales: retirar `.env` real, no quitar la guardia para apuntar a Firebase remoto.
- Cambios no aparecen: abrir la copia correcta, no el código fuente original.
- Test de contrato rojo: es incumplimiento funcional, no necesariamente error de Docker.

## Arquitectura de desarrollo

Frontend Vite opcional envía `/api` a Express; Express consulta Firestore Emulator con proyecto `demo-aprueba-equipo`. Seed llena ese emulador. Tests usan otro emulador y proyecto `demo-aprueba-tests`. No se modifica Vercel ni se demuestra un reinicio real de infraestructura con esto.

No se monta socket de Docker en la API ni se habilita control remoto del motor. Integración operativa real requiere diseño seguro separado.

## Equipo y metodología

Asignación inicial de programación, no cargos de gestión: Tsung-Hao Liu Hsiao (A: acceso, usuarios/soporte, operación); Catalina Yanara Padilla Astudillo (B: preguntas, recorrecciones, sponsors); Felipe Antonio Rojas Riffo (C: planes, funcionalidades, métricas). Todos programan, prueban y revisan. No acredita aportes ya realizados.

Scrum con cinco sprints del plan vigente; fechas/capacidad se toman de Carta Gantt y disponibilidad real, no se inventan aquí. Control de avance en `docs/00_CONTROL_FASE2.md`; criterios en `docs/04_PRUEBAS_Y_ACEPTACION.md`.

## Fuentes

- Docker Compose y healthchecks: https://docs.docker.com/compose/how-tos/startup-order/
- Firestore Emulator y limitaciones: https://firebase.google.com/docs/emulator-suite/connect_firestore
- Contrato original `Aprueba_API_Backend.docx`, sección 4 y convenciones necesarias, fuera del repositorio por confidencialidad.
