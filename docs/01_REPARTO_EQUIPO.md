# Reparto de programación de Aprueba Administración

Este reparto cubre exactamente los 27 endpoints del contrato original. Todos programan backend, escriben pruebas, revisan código y participan en planificación. No se basa en los cargos académicos de Scrum, análisis o arquitectura. Docker, fixtures, pruebas base y estas guías están preparados como apoyo; no se asigna a un estudiante la obligación de construirlos desde cero.

Asignación inicial elegida para comenzar: A Tsung-Hao Liu Hsiao, B Catalina Yanara Padilla Astudillo, C Felipe Antonio Rojas Riffo. Se pueden intercambiar los bloques completos antes de empezar; no dividir una misma ruta entre tres autores. No se presume distinta habilidad técnica entre integrantes.

## Equilibrio de carga

Grupo A: 10 endpoints, 34 puntos orientativos. Grupo B: 10 endpoints, 33 puntos. Grupo C: 7 endpoints, 35 puntos. Los puntos son estimaciones relativas de complejidad/riesgo (1, 2, 3, 5, 8), no horas, nota académica ni medición objetiva. Se recalibran tras el primer sprint con trabajo real. Datos exactos por endpoint en `endpoints.json`.

C tiene menos rutas porque Stripe, cálculos y agregaciones son más complejos que algunas consultas. A combina administración de acceso con operación segura. B concentra preguntas y recorrecciones, evitando que dos personas cambien simultáneamente el mismo comportamiento de una pregunta; sponsors añade administración de beneficios/recompensas y equilibra la carga.

Se sustituye la distribución antigua 8/9/10. No es posible eliminar toda dependencia: una recorrección afecta al saldo del alumno y métricas consume datos ajenos. Las interfaces de la sección final limitan esos cruces.

## A Tsung-Hao acceso usuarios soporte y operación

Archivos principales: `backend/src/routes/auth.js`, `users.js`, `tickets.js`, `ops.js`. Nuevas pruebas en `backend/test/integration/a-*.test.mjs`; si se crean servicios/repositorios por dominio, usar directorios `src/services/access`, `users`, `tickets`, `operations`. Crear capas solo cuando aporten claridad, no copiar lógica en varias rutas.

### Acceso y usuarios

- E01 `POST /admin/auth/login` (5 puntos): validar entrada, verificar contraseña, devolver tokens con claims/vida útil del contrato y errores estables. Revisar MFA opcional: el OTP fijo heredado no es segundo factor real. No inventar nuevos endpoints de auth del documento descartado; cualquier endurecimiento de refresh heredado es soporte interno, no aumento del catálogo.
- E12 `GET /admin/users` (3): búsqueda y filtros combinables, límite 1–100, cursor válido, orden estable, total y siguiente cursor correctos.
- E13 `GET /admin/users/{id}` (2): datos de perfil, suscripción, medallas y actividad; 404 si no existe; nunca hash/token/secretos.
- E14 `PATCH /admin/users/{id}` (3): suspender/reactivar, correo único y plan válido. Auditar cada acción con autor, fecha y motivo, no solo sobreescribir la última. Cambiar perfil no debe reemplazar saldo de medallas o historial creado por otro módulo.

### Soporte

- E15 `GET /admin/tickets` (1): filtrar estado y prioridad, devolver usuario/antigüedad coherentes.
- E16 `PATCH /admin/tickets/{id}` (3): validar enum de estado/prioridad y agente; guardar respuesta consultable sin perder historia; recurso inexistente 404.

### Operación

- E08 `GET /admin/platforms` (2): lectura de información ficticia persistida para Android/iOS/web; fechas y descargas coherentes.
- E09 `GET /admin/services` (5): consulta real de servicios autorizados de desarrollo; tiempos de respuesta medidos, timeouts y estados de fallo. Documentar ventana de cálculo de uptime. No inventar disponibilidad a partir de cero incidentes o colección vacía.
- E10 `GET /admin/containers` (5): estado/CPU/memoria/región reales mediante adaptador de infraestructura autorizado. Los fixtures no validan este endpoint como terminado.
- E11 `POST /admin/containers/{name}/restart` (5): lista cerrada de recursos permitidos, rol ops/admin, acción real en desarrollo, 202 cuando se acepta, registro y verificación posterior; 404/503 según contrato. Nunca exponer el socket de Docker ni permitir comandos/nombres arbitrarios del usuario web.

Primera tarea: E01, E12 y E13, más revisar que middleware de permisos sea reutilizable por B/C. Antes del sprint 4 debe quedar elegida la infraestructura real de desarrollo: investigar acceso y mecanismo en sprint 2, no descubrir ese impedimento en la última semana.

## B Catalina contenido recorrecciones y patrocinadores

Archivos principales: `backend/src/routes/questions.js`, `corrections.js`, `sponsors.js`. Pruebas `backend/test/integration/b-*.test.mjs`. Servicios futuros de dominio: `content`, `corrections`, `sponsors`.

### Patrocinadores y beneficios

- E04 `GET /admin/sponsors` (2): solo admin según contrato original; lista e indicadores.
- E05 `POST /admin/sponsors` (3): nombre, tier y cuota obligatorios; validar tipos, valores negativos, beneficios, stock y costo; guardar todo de forma coherente.
- E06 `PATCH /admin/sponsors/{id}` (2): limitar campos, validar y devolver 404 cuando corresponde.
- E07 `DELETE /admin/sponsors/{id}` (3): baja del sponsor y dejar de ofrecer todos sus beneficios; 204 sin cuerpo y 404. Elegir/documentar baja lógica o eliminación compatible con referencias; no borrar historial de canjes por accidente.

### Preguntas

- E19 `GET /admin/questions` (2): prueba, eje, dificultad y estado; paginación/orden conforme a convenciones.
- E20 `POST /admin/questions` (3): validar todos los campos, enums y alternativa correcta; draft al crear. No aceptar E si solo existen A/B.
- E21 `PUT /admin/questions/{id}` (3): validar el resultado completo tras combinar patch y registro anterior, no solo los campos recibidos; 404.
- E22 `POST /admin/questions/import` (5): transformar formato de origen, errores por fila y resumen consistente. Definir política de duplicados e incompletos documentada por equipo. Ejemplo en `backend/dev/import-questions.example.json`; no copiar preguntas reales ni datos de terceros.

### Recorrecciones

- E17 `GET /admin/corrections` (2): cola filtrada por estado con usuario/pregunta vinculados.
- E18 `PATCH /admin/corrections/{id}` (8): resolver en transacción; rechazar repetición/concurrencia con 409; confirmar otorga exactamente 250 bronce una vez, guarda aviso in-app y aplica corrección opcional. Rechazar no otorga recompensa. Si falla parte de la operación no deben quedar saldo, estado y pregunta incoherentes.

Primera tarea: E04–E07 para entregar el primer flujo completo. Preguntas y recorrecciones siguen con la misma autora. Para otorgar medallas usar actualización transaccional de campos acordados con A, no editar `users.js` ni reemplazar todo el documento del alumno.

## C Felipe catálogo planes pagos de prueba y métricas

Archivos principales: `backend/src/routes/plans.js`, `metrics.js`. Pruebas `backend/test/integration/c-*.test.mjs`. Servicios futuros: `plans`, `billing`, `metrics`. No implementar checkout completo ni aplicación del alumno.

- E23 `GET /admin/features` (1): catálogo de IDs asignables a planes.
- E24 `GET /admin/plans` (2): precio, funcionalidades, límites; conservar significado 0 ilimitado.
- E25 `POST /admin/plans` (3): nombre/precio obligatorios, precio y límites válidos, referencias de features existentes, 201.
- E26 `PUT /admin/plans/{id}` (8): modificar plan y sincronizar precio con Stripe de pruebas; tratamiento de fallos y reintentos sin duplicar objetos indebidamente. No simular éxito cuando Stripe falló. Cuenta test y acceso privado necesarios antes de aceptación externa, no para desarrollar validación/CRUD.
- E27 `DELETE /admin/plans/{id}` (5): comprobar suscripciones activas reales del modelo, no el estado administrativo del alumno; devolver 409 PLAN_HAS_SUBSCRIBERS cuando corresponda, 204/404 en los otros casos.
- E02 `GET /admin/metrics/overview` (8): datos persistidos de actividad/descargas/suscripciones/medallas/sponsors; MAU 30 días, conversión sobre activos, rangos y series; solo admin. Manejar período vacío y denominador cero; no sumar usuarios únicos diarios para obtener MAU.
- E03 `GET /admin/metrics/commercial` (8): DAU, MAU, conversión, recaudación/MRR por plan, embudo y badges; admin/finance. Frecuencia parametrizada, fecha de cálculo y consistencia con overview. El snapshot inicial del seed NO cuenta como cálculo backend implementado.

Primera tarea: E23–E25 y documentar junto a A la referencia usuario–suscripción–plan. Preparar casos numéricos de métricas desde el primer sprint; no esperar al cuarto para definir el denominador. Completar sincronización Stripe en sprint 3; cálculos periódicos y series en sprint 4.

## Archivos compartidos y cómo evitar choques

1. Cada archivo de rutas tiene un único responsable. Otra persona sugiere cambios por revisión, no mezcla trabajo sin aviso.
2. A coordina `src/index.js`, `config/firebase.js`, `middleware/*`, `lib/*`, `data/repo.js`, manifiesto y lockfile backend. Esto es coordinación, no que A escriba todas las funciones compartidas. Los demás pueden preparar un cambio pequeño separado y pedir su revisión.
3. No convertir `repo.js` en un archivo gigante con lógica de todos los módulos. Mantener helpers genéricos estables; funciones nuevas de dominio en archivos propios que importen `db`/helpers. Si se necesita una transacción común, acordar firma/efectos primero.
4. Fixtures, Compose y README técnico tienen un único cambio activo a la vez. Se entrega esta base común antes de abrir tres ramas divergentes. Cualquier cambio posterior se anuncia y revisa.
5. La prueba de contrato común inicial se conserva. Pruebas nuevas van en archivos A/B/C para no editar todos el mismo test. El runner debe ampliarse para incluir esos archivos cuando existan; no basta guardarlos sin ejecutarlos.
6. Un responsable funcional mantiene campos de su dominio. C puede leer actividad/sponsors para métricas, pero no renombra esos campos ni modifica sus rutas. B puede escribir saldo/recompensa transaccional según contrato compartido; A conserva esos campos al editar perfil.
7. No mezclar limpieza general, cambios de formato y una función nueva en un mismo pull request. No resolver conflictos aceptando todo lo de una rama sin entenderlo.

## Contratos entre módulos

- A → C: `users.id`, `plan`, `state`, `lastActivity`; `state=active` no significa MAU. Cambios de plan administrativo y suscripción son conceptos distintos, no inventar cobro al ajustar usuario.
- C → A/B: catálogo `plans.id`, suscripciones con `userId`, `plan`, `status`, `currentPeriodEnd`; cuenta cancelada no se cuenta como activa por tener `user.state=active`.
- B ↔ A: `corrections.userId` enlaza alumno y `questionId` pregunta; recompensa modifica `medals.bronze`, no solo contador genérico badges. Aviso in-app asociado al alumno; acuerdo de campos en guía de datos.
- B → C: estado de sponsor y beneficios/canjes disponibles para indicadores; no duplicar cálculos en `sponsors.js` y `metrics.js`.
- A → C: resultado real de salud y momento de medida para resumen; ausencia de observaciones se reporta, no equivale a operativo.

Estos nombres son decisiones internas de compatibilidad con el código inicial, no exigencias del Word descartado. Cambiarlos exige actualizar productores, consumidores, fixtures y tests en una transición coordinada.

## Revisión y ritmo de integración

C revisa A, A revisa B, B revisa C. Revisor comprueba contrato, pruebas, diff de archivos propios/compartidos y ausencia de secretos. Cambios de autenticación, transacciones o reinicio tienen además revisión del tercer integrante.

Una rama por tarea pequeña, por ejemplo `equipo-a/e12-paginacion`, no una rama gigante por persona durante todo el semestre. Partir de main integrado, guardar commits pequeños, publicar rama y abrir PR. Main no recibe código sin revisión. No prometer despliegue automático de autores externos con Vercel Hobby; mantener responsable de integración/despliegue hasta resolver permisos del plan.

Rebalanceo: después del sprint 1 comparar esfuerzo real y bloqueos. Si un bloque supera claramente la capacidad, trasladar una tarea independiente completa con tests y propiedad de archivo. No repartir E18 entre tres personas simultáneamente; puede haber trabajo en pareja con un autor e integración única.
