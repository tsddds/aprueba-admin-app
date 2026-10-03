# Guía del bloque A — Tsung-Hao

Publicada el03/10/2026 en `equipo-a/backend-sprints`, implementación `07f0f86`. Los compañeros ya pueden recibir la rama según guía10. Los resultados técnicos siguientes corresponden al corte original del29/09; no son nuevas pruebas del03/10.

Fecha: 29/09/2026. Rama local `equipo-a/backend-sprints`, desde `c0bd41f`.
Alcance: E01 y E08–E16 del contrato original; JavaScript/Node/Express y Firestore. Preparación asistida por IA. Esta guía no sustituye comprensión, revisión del equipo ni aceptación docente.

## 1. Qué está preparado

S1: acceso administrativo, listado y detalle de usuarios. S2: cambios de usuario y soporte. S3: plataformas. S4: servicios y recursos. S5: reinicio. Los diez endpoints están implementados en esta rama y tienen pruebas locales. E09 usa una sonda de laboratorio real: configurar los destinos empresariales sigue pendiente.

Los módulos de Catalina/Felipe no fueron reescritos. Hay cambios compartidos de JWT, permisos y errores que Felipe debe revisar antes de integrar.

## 2. Abrir el entorno sin tocar la nube

En la raíz de esta copia, con Docker Desktop abierto y contexto **local Linux**:

```powershell
git branch --show-current
docker context show
docker compose -f compose.yaml -f compose.ops.yaml config --quiet
docker compose -f compose.yaml -f compose.ops.yaml --profile ui up --build -d
docker compose -f compose.yaml -f compose.ops.yaml --profile ui ps
```

Este comando construye/arranca frontend, backend, emulador persistente y el laboratorio optativo. El seed solo crea documentos ausentes; no resetea datos existentes. No usar `down -v`, `volume prune` ni el seed histórico. Si ya existen cambios tuyos, no cambiar de rama ni sobrescribirlos sin revisarlos.

- Aplicación: http://localhost:5173
- API: http://localhost:4000/health
- Visor Firestore: http://localhost:4001/firestore
- Base de desarrollo: `demo-aprueba-equipo`. Base de tests separada: `demo-aprueba-tests`.

Usar cuentas ficticias `admin@example.test`, `support@example.test`, `finance@example.test` u `ops@example.test`. Contraseña **pública y exclusiva del emulador**: `SoloEmulador_2026_Prueba!`. MFA vacío. Los valores prellenados de la interfaz heredada no son estas cuentas. No reutilizar esta contraseña ni las claves demo en Internet. No hacen falta JSON privado Firebase ni secretos de Vercel.

Sin laboratorio: `docker compose --profile ui up --build -d`. E09/E10 entonces responden 503 si no tienen configuración real; no es un estado ficticio «operativo».

## 3. Seguridad y límites del laboratorio

Solo se permite reiniciar `aprueba-ops-lab`, creado para esta prueba y con etiqueta `aprueba.ops.allowed=local-test-only`. El backend no recibe el socket Docker. Un bridge separado expone únicamente lectura del objetivo y su reinicio, con token y red interna sin puertos publicados.

**El bridge sí tiene acceso privilegiado al daemon Docker. El montaje `:ro` no convierte la API del socket en solo lectura.** Este aislamiento reduce la superficie, pero no es una frontera de seguridad para código no confiable. Usarlo únicamente en el equipo local autorizado, nunca en un host de producción. El token de Compose es de laboratorio, no secreto productivo. No conectar contenedores ajenos a la red de control.

Al terminar la demostración, detener el componente privilegiado sin borrar datos:

```powershell
docker compose -f compose.yaml -f compose.ops.yaml stop ops-bridge ops-lab
```

Volver a arrancarlos con `docker compose -f compose.yaml -f compose.ops.yaml up -d ops-lab ops-bridge`.

E10: CPU es porcentaje del tiempo agregado del host entre muestras; memoria es porcentaje de working set sobre límite del contenedor. Un dato no disponible puede ser `null`, no un cero inventado. E09: `uptime` es porcentaje de sondas exitosas desde la primera observación, **no SLA de tiempo continuo**. Las consultas producen muestras; no hay monitor periódico en segundo plano. Cambiar la URL reinicia la serie de ese servicio. Timeout: 2 s; más de 500 ms se considera degradado. Estas son decisiones técnicas del laboratorio, no fórmulas exigidas por la empresa.

E11 responde 202 y registra solicitud. Una lectura posterior de E10 verifica el cambio real de StartedAt y marca la auditoría `verified`. Si hay timeout, `unknown` requiere revisar el estado: no significa necesariamente que el reinicio no ocurrió, y no se debe repetir ciegamente.

## 4. Probar por incrementos

Cada suite reinicia **solo la base efímera de tests** y la carga con fixtures. No ejecutar dos suites simultáneamente porque comparten esa base.

```powershell
docker compose --profile test run --rm test npm test
docker compose --profile test run --rm test node dev/run-tests.mjs a-sprint1
docker compose --profile test run --rm test node dev/run-tests.mjs a-sprint2
docker compose -f compose.yaml -f compose.ops.yaml --profile test run --rm test node dev/run-tests.mjs a-ops
docker compose --profile test run --rm test node dev/run-tests.mjs smoke
docker compose -f compose.yaml -f compose.ops.yaml --profile test run --rm test node dev/run-tests.mjs smoke
docker compose --profile test run --rm test node dev/run-tests.mjs contract
```

Resultado del corte: 5 unitarias; 8 S1; 7 S2; 8 operaciones; 7 smoke en cada configuración, todas verdes. Contrato general: 1 aprobada y 7 fallidas de B/C, conservadas como pendientes. Ver logs reales en `evidencias/equipo-a/`. No confundir smoke con aceptación completa.

El script opcional `node backend/dev/verify-a.mjs` ejecuta estas suites secuencialmente y regenera reportes si tienes Node disponible en el host; **no es obligatorio instalar Node**, los comandos Docker anteriores bastan. El script exige un contexto Docker local. No se ha instalado CI en GitHub.

## 5. Ver un cambio real en la base

En PowerShell, con la aplicación local arrancada, iniciar sesión en la API sin imprimir tokens:

```powershell
$apruebaBase = 'http://localhost:4000/api/v1/admin'
$apruebaLogin = @{ email='admin@example.test'; password='SoloEmulador_2026_Prueba!'; otp='' } | ConvertTo-Json
$apruebaSession = Invoke-RestMethod -Method Post -Uri "$apruebaBase/auth/login" -ContentType 'application/json' -Body $apruebaLogin
$apruebaHeaders = @{ Authorization = "Bearer $($apruebaSession.data.accessToken)" }
Invoke-RestMethod -Uri "$apruebaBase/users?limit=5" -Headers $apruebaHeaders
Invoke-RestMethod -Uri "$apruebaBase/users/usr_demo_01" -Headers $apruebaHeaders
```

Para una demostración deliberada, este siguiente comando **modifica el usuario ficticio local**:

```powershell
$apruebaPatch = @{state='suspended';reason='Demostración local bloque A'} | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "$apruebaBase/users/usr_demo_01" -Headers $apruebaHeaders -ContentType 'application/json' -Body $apruebaPatch
```

En el visor, abrir `users/usr_demo_01`: verificar `state`, `updatedAt`, `auditedBy`. Abrir `adminAudit` y localizar `entityId=usr_demo_01`: antes/después, motivo y autor. Restaurar `state='active'` por la misma API si ese era el estado anterior; queda una segunda auditoría, no se borra la primera. No corregir manualmente auditorías para simular resultados.

Para tickets: listar `/tickets`, elegir un ID existente y enviar PATCH con `reply`, `state` o `priority`. En Firestore revisar `tickets/{id}/replies` y `adminAudit`. Las respuestas se agregan, no se sobrescribe el historial. Para operaciones, consultar `/containers`, solicitar POST `/containers/aprueba-ops-lab/restart` y volver a consultar; revisar StartedAt y auditoría.

El login no crea un usuario nuevo: verifica `adminUsers`. Con MFA deshabilitado normalmente no escribe ese documento; con TOTP habilitado actualiza el contador antirreutilización. No esperar que toda consulta GET modifique una fila.

## 6. Qué debes entender y mostrar

1. Explicar diferencias entre `adminUsers` (operadores) y `users` (usuarios de la app), JWT y hash de contraseña.
2. Ejecutar S1 y mostrar acceso correcto, contraseña incorrecta, 403 con rol no permitido y detalle sin secretos.
3. Ejecutar S2 y explicar transacción, correo único concurrente, historial de ticket y auditoría.
4. Mostrar las plataformas ficticias identificadas como fixtures y la diferencia con las sondas/recursos reales.
5. Reiniciar únicamente el laboratorio y mostrar evidencia de antes/después, no solo el 202.
6. Abrir los Excel y explicar qué está probado, qué tiene fallo y qué aún espera revisión.

La preparación asistida no equivale a participación personal demostrada. Registrar la revisión de Felipe y tu demostración solo después de realizarlas. La reflexión profesional y asistencia a reuniones deben ser propias, no generarse como hechos.

## 7. Límites pendientes antes de producción

- E09: URLs autorizadas de servicios de login, badges, preguntas, pagos y notificaciones; no inventar ni pedir credenciales productivas para probar localmente.
- Limitación de intentos de login, rotación/revocación de refresh, custodia del secreto TOTP, revisión de dependencias y carga. TOTP implementado; no se agregaron rutas de enrolamiento fuera de los 27 endpoints.
- Paginación en memoria y lectura de colección para correo único: adecuados para este volumen de fixtures, requieren índices/diseño escalable si crece. Todo escritor de correo debe coordinarse con el bloqueo de `adminLocks/user-email`.
- E14 modifica la clasificación administrativa de plan, no cobra, ni sincroniza Stripe ni altera documentos de suscripción/medallas; coordinar con C cualquier regla de facturación.
- No se valida Firebase remoto, Vercel ni nuevos despliegues. No borrar las variables del backend remoto.
- Los siete defectos B/C, aceptación de MVP, replanificación de fechas, defensa y publicación continúan pendientes.

## 8. Fuentes y trazabilidad

Contrato: `Aprueba_API_Backend.docx`, sección 4 y convenciones generales, original preservado fuera del repo. Asignación: `endpoints.json`. Respuestas de Max y confirmación posterior del usuario conservan Node/Express/27 endpoints, permiten datos ficticios persistidos y exigen operación real de desarrollo. El usuario eligió Docker local y contenedor dedicado.

Rúbricas originales Fase 2 y guías 2.4/2.6 consultadas; los Excel de ejecución enlazan evidencia a indicadores sin asignar notas. Referencias técnicas: [TOTP, RFC 6238](https://www.rfc-editor.org/info/rfc6238/), [seguridad del daemon Docker](https://docs.docker.com/engine/security/) y [API Docker Engine](https://docs.docker.com/reference/api/engine/). Implementación probada con Docker Engine 29.8.0 local; bridge utiliza API v1.45.
