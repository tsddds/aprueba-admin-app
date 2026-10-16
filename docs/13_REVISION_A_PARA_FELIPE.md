# Revisión asistida del bloque A para Felipe

16/10/2026. Base inspeccionada: equipo-a/backend-sprints, 93c8096. Solicitada dentro del trabajo de Felipe según Notion. Este registro prepara su revisión; no acredita que Felipe haya defendido o aprobado personalmente el código.

## Comprobado

- `routes/auth.js`, `lib/jwt.js`, `middleware/auth.js`: validación, TOTP antirreutilización, tokens con tipos distintos y TTL, rechazo de cuentas deshabilitadas/suspendidas y de permisos obsoletos. Suite a-sprint1 8/8 en Docker.
- `lib/envelope.js`, `middleware/error.js`: envelope data/error/meta, JSON malformado y error interno sin cuerpo/credenciales del proveedor. El contrato común pasó 8/8 en esta rama C; no se ampliaron permisos globales para habilitar pantallas.
- `data/admin-support.js`, rutas users/tickets: transacciones, unicidad normalizada, conservación de medallas/suscripciones e historial de respuestas. Suite a-sprint2 7/7; incluye concurrencia de correo y respuestas.
- `data/admin-ops.js`, `compose.ops.yaml`, `infra/ops/bridge.mjs`: inspección estática. Lista permitida en API y objetivo fijo/etiqueta en bridge; API sin socket Docker; auditoría solicitada/programada/verificada; timeout tratado como incierto. Sin pruebas de reinicio en esta intervención. No se acredita operación de servicios empresariales con la sonda local.

## Observación pendiente para A y consumidor frontend

P2: `frontend/src/pages/Users.jsx`, loadTickets, descarta `meta.pagination`; `routes/tickets.js` devuelve 20 tickets por defecto. Con más de 20 que cumplan los mismos filtros, no hay navegación para ver los siguientes y el contador solo considera esa página. Agregar paginación del consumidor o acordar otro contrato. No se modifica ese módulo desde C.

## Aclaración tras recibir el Word original

Una revisión anterior consideró defecto el filtro E12 restringido a free/uni/all. El Word original efectivamente enumera esos tres valores. Por tanto, no corresponde cambiar unilateralmente A ni afirmar incumplimiento de ese endpoint por ello. La posibilidad de crear y asignar otros planes exige acordar con el equipo cómo evolucionar el filtro y sus consumidores; es una incompatibilidad entre flujos a resolver en el contrato interno. El reparto original queda conservado.

## Límites y siguiente paso

No hubo pentest, carga, revisión de dependencias ni demostración personal. Permanecen las limitaciones ya documentadas de rate limiting, refresh sin rotación/revocación, custodia TOTP y bridge privilegiado. Felipe debe revisar el diff y reproducir los casos, con Catalina/Tsung-Hao cuando corresponda, antes de registrar aceptación. No se enviaron mensajes al equipo ni se publicó una revisión externa.
