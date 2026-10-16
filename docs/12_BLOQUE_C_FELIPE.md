# Bloque C de Felipe

Fecha: 16/10/2026. Rama local `equipo-c/felipe-planes-metricas`, desde `93c8096` de `equipo-a/backend-sprints`. Desarrollo asistido por IA a solicitud de Felipe. No acredita defensa personal, revisión de Catalina ni aceptación académica.

Fuentes: Notion compartido por el usuario, reparto 01, datos 03 y sección 4 del Word original `Aprueba_API_Backend.docx`, facilitado desde Downloads y leído sin modificarlo. Se conservan JavaScript, Express, Firestore y las 27 rutas del catálogo. No se implementan checkout ni API del alumno.

## Entrega funcional

| Endpoint | Implementación y evidencia |
|---|---|
| E23 / E24 | Catálogo de funcionalidades y planes, solo admin; proyecciones públicas sin credenciales del proveedor. |
| E25 | Creación transaccional con auditoría. Nombre y precio obligatorios; tipos estrictos; precio CLP entero no negativo; referencias existentes; límites y badges enteros no negativos; cero conserva ilimitado. |
| E26 | Actualización parcial conserva campos omitidos e internos. Cambios de precio requieren sincronización Stripe test antes de guardar el nuevo valor. Proveedor simulado verificado; **sandbox real pendiente** por falta de cuenta/credenciales. |
| E27 | Consulta `subscriptions`, no `users.state`; bloqueo `409 PLAN_HAS_SUBSCRIBERS`. Canceladas/vencidas no bloquean; activas con vencimiento desconocido bloquean por precaución. Baja 204 sin cuerpo; inexistente 404. |
| E02 | Overview reservado a admin. Calculado desde registros; no devuelve el snapshot del seed como cálculo actual. |
| E03 | Comercial para admin/finance, con DAU, MAU, conversión, MRR, ingresos cobrados, series, embudo y emisión registrada de medallas. Actualización periódica configurable y consulta de caché con vencimiento. |

Archivos de dominio en `backend/src/services/plans`, `billing` y `metrics`; rutas delgadas en `plans.js` y `metrics.js`. Cambios compartidos preparados para revisión: `data/repo.js`, ejecutor de tests y consumidores frontend. No se enviaron mensajes al equipo ni se modificaron módulos B o fixtures. Coordinar estos cambios antes de integrar.

## Reglas explícitas de datos

- CLP es la moneda del conjunto interno acordado. Precio entero entre 0 y 99999999; no convertir silenciosamente strings, fracciones, negativos o límites inválidos. No se pretende cubrir otras monedas con esta validación.
- `subscriptions.plan` referencia el ID físico del plan. Para métricas, estado active y fin de período futuro; inicio, si existe, ya ocurrido. Para eliminación se conserva el bloqueo ante una activa con vencimiento ausente/inválido o todavía futuro.
- Crear suscripciones queda fuera de las 27 rutas administrativas. Cualquier escritor futuro debe leer el plan dentro de su misma transacción antes de crear la referencia: sin esa coordinación, un escritor externo/manual puede romper integridad después de borrar un plan.
- E14 conserva su semántica: cambiar `users.plan` no factura ni altera `subscriptions`. No se migran suscriptores existentes al precio nuevo de Stripe.
- MRR suma importes recurrentes de suscripciones vigentes, normalizando anual /12 y `intervalCount`. Usa `unitAmount` de suscripción cuando existe; catálogo como fallback legado. Moneda/ciclo/precio incoherentes se excluyen y se informa `quality.missingSubscriptionPrices`. No es equivalente a pagos cobrados.
- MAU: usuarios distintos con actividad en `(ahora - 30 días, ahora]`. DAU: últimas 24 horas. Se usan `users.lastActivity` y `activityEvents` cuando existen, sin derivarlo del estado administrativo ni sumar usuarios únicos diarios. Conversión: usuarios MAU con suscripción de pago vigente / MAU; cero si no hay MAU.
- `range`: 7d, 30d, 90d o 365d. Es una decisión interna porque el Word no enumera valores. Afecta ingresos cobrados, emisión, actividad del rango y series; DAU y MAU conservan sus ventanas definidas. Total de descargas es acumulado hasta ahora; descargas del mes usa mes calendario de la zona configurada.
- Series mensuales agrupadas en `appConfig/metrics.timeZone` (America/Santiago por defecto), con meses vacíos en cero. Eventos con `eventId` repetido se cuentan una vez. Sin `eventId`, el ID de documento identifica el evento.
- `collectedRevenue` suma pagos paid en CLP dentro del rango, no pagos reembolsados o fallidos. Los importes de los fixtures siguen identificados como ficticios en sus documentos de origen.
- Emisión de medallas: `badgeEvents` y `users/*/medalMovements`, deduplicados por evento/corrección. Los saldos `users.medals` y el contador genérico `badges` no se reinterpretan como histórico de emisión. Sin movimientos, emisión registrada es cero, con `quality.badgeHistory=recorded-issuance-only`; no significa que históricamente no se hayan emitido medallas.
- Las fuentes iniciales no contienen historia completa para reconstruir MAU/MRR del período anterior. Sus deltas son null, no un cero inventado; `quality.historicalComparisons` explicita el límite. Delta de descargas compara acumulado del mes actual con el mes calendario anterior, null si el anterior es cero. Completar comparativas exige acordar/guardar historia de actividad y suscripciones, no inferirla de saldos actuales.
- Salud agregada solo desde `serviceObservations` con observación de los últimos cinco minutos; sin observaciones: unknown y `servicesDown=null`. No se consultan fixtures de contenedores para fingir medición real.

## Actualización de métricas

`appConfig/metrics`: `metricsRefreshSeconds` (300 por defecto), `dashboardPollSeconds` (60), `timeZone` y `currency=CLP`. Frecuencias enteras entre 1 y 86400; configuración inválida responde 503 METRICS_CONFIG_INVALID.

El proceso Node de Docker recalcula al iniciar y después de cada intervalo. Una consulta recalcula si la caché venció. Todas las variantes y ambos paneles se guardan en una transacción coherente con `generatedAt`, `period`, `range` y `source=calculated_from_records`. Consultas concurrentes del mismo proceso comparten el cálculo en curso. No hay cron externo ni garantía de ejecución cuando el proceso está detenido; en serverless debe diseñarse otro disparador antes de desplegar. El método actual lee las colecciones completas: apropiado al volumen local, pendiente optimizar índices/agregaciones para producción.

Finanzas ahora inicia en Comercial y solo consulta `/metrics/commercial`; Resumen queda para administradores, según Word y Notion. Comercial incluye la serie mensual que antes pedía a overview. La interfaz consulta nuevamente según `dashboardPollSeconds`. Se corrigió la etiqueta de funcionalidades para admitir los fixtures con `name` y el código de error de eliminación de planes.

## Stripe de pruebas y recuperación

El adaptador usa HTTPS contra la API oficial y admite exclusivamente una clave `STRIPE_TEST_SECRET_KEY` con prefijo sk_test. Nunca usa sk_live ni crea cobros. El secreto no está en Compose ni en Git. Sin él, cambiar precio responde 503 STRIPE_NOT_CONFIGURED sin modificarlo; cambiar otros campos sigue disponible.

Se crea un precio mensual nuevo, conservando el producto de pruebas si ya está vinculado. Cada operación conserva claves de idempotencia para producto y precio. CLP no se multiplica por 100. `planPriceOperations/{planId}` guarda estado pending/completed y revisión; una operación pendiente bloquea otros cambios/baja. Tras timeout, repetir exactamente el mismo cambio conserva la operación; más de 23 horas exige conciliación manual con STRIPE_RECONCILIATION_REQUIRED antes de volver a llamar al proveedor. No borrar ese registro para forzar reintentos. Un error persistente requiere revisar el estado en Stripe; el plan local conserva su precio anterior hasta completar.

El historial de precios anteriores se conserva en el proveedor; esta versión no archiva precios ni migra suscripciones existentes. Al recuperar una operación antigua, verificar producto/precio e importe en Stripe y coordinar la conciliación con el responsable antes de liberar el bloqueo. No se ofrece endpoint de administración de conciliaciones fuera del contrato.

Para habilitar sandbox cuando exista la cuenta, guardar el secreto únicamente en el entorno privado del computador y usar un override local ignorado por Git, por ejemplo `.local/compose.stripe-test.yaml`:

```yaml
services:
  backend:
    environment:
      STRIPE_TEST_SECRET_KEY: ${STRIPE_TEST_SECRET_KEY:?Configurar clave privada de pruebas en el entorno}
```

Añadir ese archivo al comando Compose y recrear solo backend con `up -d --no-deps backend`. No añadir el secreto al archivo ni al comando visible. La guardia del entorno local continúa rechazando las credenciales productivas históricas.

El runner de pruebas crea un proveedor HTTP **simulado**, restringido al loopback y al emulador demo-aprueba-tests. Reproduce productos/precios/idempotencia y no usa una cuenta Stripe. Las pruebas directas también inyectan timeout, respuesta live y reintentos. Esto no acredita sincronización real con Stripe: **E26 sigue pendiente de aceptación externa**.

Referencias primarias consultadas: [precios](https://docs.stripe.com/api/prices), [idempotencia](https://docs.stripe.com/api/idempotent_requests), [unidad de CLP](https://docs.stripe.com/currencies).

## Comprobaciones ejecutadas

Suites secuenciales en Docker, proyecto demo-aprueba-tests, sin restablecer la base de desarrollo. Los ocho tests contractuales y el smoke original conservaron sus expectativas; se añadió un proveedor simulado al runner para que el cambio de precio ya no dependa de un éxito ficticio local sin proveedor.

| Suite | Resultado |
|---|---|
| Unitarias (incluye A/B/C) | 15/15 |
| c-catalog | 7/7 |
| c-billing (proveedor simulado) | 5/5 |
| c-metrics (incluye planificador sin HTTP) | 7/7 |
| contract original | 8/8 |
| smoke original, con proveedor simulado | 7/7 |
| a-sprint1 | 8/8 |
| a-sprint2 | 7/7 |
| Compilación frontend | Aprobada |

Son 64 casos de estas suites, no cobertura de líneas ni aceptación integral de las 27 rutas. El primer c-billing detectó dos auditorías al repetir concurrentemente una operación ya aplicada: corregido con comprobación de actualización sin cambios. El fallo se conserva en `.local/felipe-evidence/c-billing-before-idempotency-fix.txt`. Ejecuciones finales, logs y capturas en `.local/felipe-evidence/`, fuera de Git; no contienen tokens. La interfaz de finanzas fue comprobada en navegador: Comercial con MAU 4, conversión 50 %, MRR 8000 y sin Sponsors/Resumen en el menú. Constructor de planes revisado visualmente como admin.

Ejecutar desde la raíz con el entorno local disponible; no correr suites simultáneas sobre el mismo emulador:

```sh
docker compose --profile test run --rm test npm test
docker compose --profile test run --rm test node dev/run-tests.mjs c-catalog
docker compose --profile test run --rm test node dev/run-tests.mjs c-billing
docker compose --profile test run --rm test node dev/run-tests.mjs c-metrics
docker compose --profile test run --rm test node dev/run-tests.mjs contract
docker compose --profile test run --rm test node dev/run-tests.mjs smoke
```

En este computador se añade `-p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml` antes del perfil, debido al puerto 8080 bloqueado por Windows. Aplicación http://localhost:15173, API http://127.0.0.1:14000. No usar down -v.

## Revisión e integración pendientes

Catalina debe revisar el bloque C; la revisión de A está documentada en guía 13, con sus límites. No registrar esos actos como revisión personal de Felipe ni inventar reuniones/fechas. No se modificó el Word original ni se publicó la rama, se mezcló main o se desplegó. Antes de publicar una rama C, revisar con el responsable las reglas de despliegue Git de Vercel; la exclusión conocida de equipo-a no cubre necesariamente equipo-c.

Próximo paso externo: revisión humana, cuenta Stripe test y demostración real de E26 (precio en proveedor, fallo y reintento). Comparativas históricas completas y escala productiva requieren fuentes/decisiones adicionales descritas arriba.
