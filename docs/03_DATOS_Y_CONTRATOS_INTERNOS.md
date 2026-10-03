# Datos ficticios y acuerdos entre módulos

Los datos se generan en `backend/dev/fixtures.mjs` y se cargan con `backend/dev/seed.mjs`. No proceden de alumnos/clientes reales. Correos usan example.test; nombres y marcas son ficticios. Las preguntas son ejemplos creados para pruebas. No se usa ni se migra el esquema de los Word descartados.

## Separación de entornos

Desarrollo diario: emulador con proyecto `demo-aprueba-equipo`, persistencia local de Docker. Tests: otro emulador con `demo-aprueba-tests`, contenido descartable restablecido al comenzar cada suite. Firebase `aprueba-admin-pruebas` del despliegue NO se toca ni se carga con este script.

La guardia exige proyecto demo exacto y host local/servicio Compose permitido. Rechaza JSON de cuenta de servicio, credencial Google, token Firebase o clave Stripe. No tiene fallback remoto. Las cuentas demo tienen contraseña conocida exclusivamente porque el entorno está aislado; nunca cargar estos administradores en la nube.

Cada integrante tiene sus contenedores y datos: cambios del uno no llegan automáticamente a los otros. Lo compartido por Git es el generador, no una base de datos activa. Cambios de fixture se revisan igual que código.

## Contenido inicial

- 4 cuentas administrativas: admin/support/finance/ops, MFA desactivado SOLO para arranque controlado.
- 7 alumnos ficticios: planes free/uni/all, estados active/suspended/churned y actividad hoy, hace 2, 10, 29, 31, 60 y 90 días.
- 3 suscripciones: 2 activas y 1 cancelada; cada una vinculada a un alumno.
- 4 planes: free, uni, all y uno sin suscriptores; 3 funcionalidades.
- 2 sponsors, uno con un beneficio; cuotas y precios son ejemplos ficticios en CLP, decisión interna de prueba, no precios reales.
- 3 preguntas: published/flagged/draft. La pregunta qst_demo_02 tiene un error deliberado para ejercer recorrección; no confundir con pregunta aprobada para alumnos.
- 3 tickets: open/progress/closed; 3 recorrecciones: pending/confirmed/rejected.
- 3 plataformas con datos de prueba.
- 1 servicio y 1 contenedor FICTICIOS explícitamente sin medición real. No validan monitorización ni reinicio.
- Configuración appConfig/metrics: 300 segundos cálculo, 60 segundos consulta, America/Santiago, CLP.
- 2 snapshots de métricas para que la UI inicial muestre estructura completa. Etiqueta source=fixture_snapshot_not_live: NO son cálculo vivo del backend.
- 2 eventos agrupados de descargas, 2 pagos ficticios y 1 marcador devMeta/dataset-v1 con fecha de referencia.

Total inicial: 45 documentos, incluyendo las cuatro cuentas. Las colecciones vacías de auditoría/notificaciones/movimientos aparecerán cuando el equipo implemente sus operaciones; no se crean evidencias de ejecución falsas en el seed.

La fecha de referencia se fija al crear los fixtures. El script crea solo documentos faltantes: si se vuelve a ejecutar después de días no rejuvenece actividad de alumnos existentes ni sobreescribe avances. Para fechas reproducibles en tests, `buildFixtures(fecha)` admite una fecha explícita. Tests empiezan de cero; desarrollo conserva cambios.

## Colecciones y responsables de campos

Compatibilidad inicial con `src/data/repo.js`: adminUsers, users, tickets, questions, corrections, sponsors, features, plans, platforms, services, containers, metrics. Se mantienen tickets y services como nombres físicos iniciales porque así los consulta el código; `/admin/tickets` es ruta pública, no obligación de que la colección se llame igual. No migrar por el modelo nuevo descartado.

A mantiene perfil/estado/actividad del usuario, cuentas, tickets y observaciones operativas. B mantiene preguntas, recorrecciones, sponsors y beneficios; escribe recompensa/notificación según acuerdo transaccional. C mantiene planes, suscripciones/precios y agregaciones, y lee fuentes de A/B.

Colecciones auxiliares propuestas por equipo para desarrollar: subscriptions, payments, downloadEvents, appConfig. El código heredado todavía no consume todas ellas; están preparadas para implementación, no como funcionalidades existentes. No agregar endpoints de alumno por tener estas entidades.

### Identificadores y tipos

- El ID físico de documento identifica el registro. El API lo expone como `id`; no mantener dos IDs divergentes.
- users.plan, subscriptions.plan y plans.id usan la misma referencia.
- corrections.userId y tickets.userId apuntan a users; corrections.questionId apunta a questions.
- Fechas en ISO 8601 UTC. Presentación/agrupaciones diarias con zona America/Santiago cuando corresponda; no convertir zona cambiando horas sin offset.
- `users.state=active` es estado de cuenta. `users.lastActivity` es el instante de actividad que determina MAU. Son campos distintos.
- `users.medals.bronze` representa saldo de bronce. `badges` heredado es contador genérico y NO debe sustituir automáticamente ese saldo. A y B deben documentar qué contador necesita el frontend y mantener su coherencia sin sumar dos veces.
- `subscriptions.status=active` determina suscripción activa; usuario activo no implica suscripción vigente. C comprobará también vencimiento y reglas del contrato/equipo.
- Para monedas, CLP se eligió como dato ficticio. Mantener unidad coherente con Stripe y validarla; no multiplicar por 100 sin atender reglas de la moneda.

### Recorrección y transacción

Responsable B, revisores A/C. Leer solicitud, usuario y pregunta necesarios antes de escribir; validar estado pending. En una operación consistente: resolver, sumar 250 bronce si confirmed, aplicar questionPatch válido si corresponde y persistir aviso in-app. Segunda confirmación o carrera concurrente no debe duplicar saldo ni aviso.

Propuesta de aviso interno: `users/{id}/notifications/{correctionId}`, con tipo, mensaje, createdAt y read=false. Es un acuerdo de equipo, no endpoint nuevo. Puede verificarse directamente en test de persistencia y mostrarse en interfaz mínima si hace falta. Si se usa una cola, debe probarse también su entrega, no dejar el evento indefinidamente pendiente.

Propuesta de movimiento único: ID asociado a correctionId en subcolección del usuario, para auditabilidad. No reemplazar un documento completo de usuario desde corrections.js; A podría haber cambiado correo/estado en paralelo.

## Resultado numérico de referencia

En el instante `devMeta/dataset-v1.asOf`: hay 7 alumnos, 4 con actividad dentro de últimos 30 días y 2 de esos 4 con suscripción de pago vigente. Conversión esperada 50 %. MRR de ejemplo 3000 + 5000 = 8000 CLP. Es un oráculo para probar la implementación, no la implementación misma.

El usuario que estuvo activo hace 31 días no entra en MAU aunque su estado administrativo sea active. El suspendido de hace 60 días tampoco entra. Si no hay usuarios activos, convención interna inicial tasa 0 y contador 0. Un usuario con dos movimientos de actividad se cuenta una vez.

Los snapshots traen deltas iniciales 0 y una serie mínima para compatibilidad visual: son placeholders identificados, no evidencia de comparación histórica correcta. El responsable C debe añadir escenarios/histórico suficiente y demostrar cálculos por rango. Los snapshots NO se recalculan automáticamente al modificar registros.

## Casos que debe ampliar cada responsable

A: cursor inválido, último elemento de página, correo duplicado, usuario inexistente, roles prohibidos, servicio timeout/degradado y orquestador inaccesible. B: importación mixta, duplicados, pregunta inválida, dos recorrecciones concurrentes y baja de sponsor con beneficios. C: sin actividad, frontera 30 días, eventos repetidos, suscripción cancelada/expirada, precio 0, fallo de Stripe, reintento y plan sin suscriptores.

Actualización 29/09/2026: los casos del bloque A indicados arriba están implementados y ejecutados en Docker; ver pruebas `a-sprint1`, `a-sprint2`, `a-ops` y sus reportes. Los demás bloques conservan pendientes; siete detectores contractuales siguen fallando.

## No confundir los fixtures con la entrega final

Max permite datos de negocio/plataformas ficticios persistidos, pero exige consultas/reinicios reales en desarrollo. El fixture container-demo no es un contenedor real de infraestructura: el código inicial solo modifica su documento. No presentar ese botón como reinicio implementado. El seed tampoco crea cuenta Stripe ni procesa pagos; payments son entradas de ejemplo.

Cloud Run no obligatorio. Decisión confirmada del usuario: Docker local y contenedor dedicado. Esta rama reemplaza la simulación de E09–E11 por sondas reales y un bridge restringido al laboratorio `aprueba-ops-lab`. No monta Docker socket en Express ni publica el motor. El bridge es privilegiado: leer advertencias y apagado en guía09. Los antiguos documentos de fixtures de servicios/contenedores no son fuente de estado operativo de estas rutas.

## Persistencia añadida por el bloque A

- `adminAudit/{id}`: documento por cambio efectivo de usuario/ticket y por solicitud de reinicio. Actor, entidad, fecha ISO y cambios antes/después; ticket referencia `replyId`. Reinicios distinguen requested/scheduled/verified/unknown/rejected. No guarda JWT, contraseñas ni secretos TOTP. Es append-only para eventos de usuario/ticket; la auditoría operativa actualiza el estado de una misma solicitud. No existe endpoint para borrar auditorías.
- `adminLocks/user-email`: bloqueo compartido de unicidad transaccional, leído antes que el usuario para mantener orden consistente y evitar interbloqueos. Normalización trim/minúsculas. La lectura de colección también detecta correos históricos no normalizados. Otros escritores de usuarios deben respetar la misma política; no se afirma unicidad global ante escrituras manuales que la eludan.
- `tickets/{ticketId}/replies/{id}`: historial de respuestas con autor y fecha; `lastReply` se conserva en ticket por compatibilidad, no reemplaza el historial.
- `serviceObservations/{key}`: total de sondas, exitosas, primera/última fecha y latencia. Huella SHA-256 de URL separa series al cambiar destino; no almacena la URL con secretos. La configuración de sondas viene del servidor, no de parámetros de un usuario de la API.
- `adminUsers/{id}`: TOTP opcional mediante `mfaEnabled`, `mfaSecret` y `mfaLastCounter`. Secretos no retornados por API. En producción debe definirse custodia/provisión segura; el seed mantiene MFA apagado y solo los tests habilitan una semilla de RFC de prueba.

E13 consulta `subscriptions` por `userId`, priorizando activa y fin de periodo reciente, con fallback al objeto legado si no hay documentos. La salida usa proyecciones permitidas, incluidas medallas/dispositivos/actividad, para no filtrar secretos. E14 no modifica suscripciones ni medallas: un cambio de `plan` administrativo no ejecuta cobro ni sincronización Stripe. Coordinar cualquier cambio de esta semántica con Felipe.
