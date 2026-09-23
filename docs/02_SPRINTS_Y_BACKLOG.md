# Plan de inicio y sprints de Fase 2

Punto actual: preparación del entorno y planificación de Sprint 1. El asistente preparó entorno/fixtures/tests iniciales, no completó los endpoints por el equipo. No registrar esto como sprints terminados, pruebas de aceptación aprobadas o trabajo individual ya realizado.

Se conservan los cinco sprints del plan de 18 semanas. Esta secuencia detalla dependencias, no sustituye automáticamente las fechas de la Carta Gantt. Antes de iniciar, registrar fechas reales y disponibilidad de los tres; no traducir puntos a horas sin experiencia del equipo.

## Paso 0 entrega de la base común

Actualización de prioridad del 23 de septiembre: Hito 1, MVP con base operativa del 28 septiembre al 03 octubre; Hito 2, Docker completo del 26 al 31 octubre. Son hitos comunicados, no fechas inventadas para los cinco sprints. Recibir la rama según guía 07 sin esperar merge a main. La verificación Docker queda pendiente de motor, pero lectura, diseño de tests y programación pueden comenzar. No considerar MVP aceptado sin confirmar funciones mínimas y modalidad de demostración.

Responsable de preparación técnica: asistente; revisión y recepción: los tres.

- Archivos de Docker, fixtures, pruebas y guías creados localmente.
- Pruebas de preparación y smoke verificadas fuera de Docker con emulador.
- Pendiente: arranque Docker por falta de motor en este entorno y reproducción en otro computador.
- Publicación solicitada en rama codex/base-fase2-equipo, sin integrar main. Nadie debe clonar main y asumir que estos archivos ya están allí; comprobar rama remota y seguir guía 07.
- No cargar fixtures en Firebase remoto. No alterar el administrador de Vercel.

Salida de este paso: cada integrante sabe abrir la copia, arrancar, iniciar sesión, consultar datos y ejecutar tests; hay una base común identificada por commit. No es necesario que las ocho pruebas de contrato pasen para empezar, pues son pendientes del equipo.

## Sprint 1 acceso datos y primer flujo administrativo

Objetivo: primera porción funcional revisada, con autenticación y flujo completo de patrocinadores; usuarios y catálogo disponibles para siguientes módulos.

### A Tsung-Hao

- S1-A1 E01: revisar errores/validación/token y control de roles. Definir tratamiento de MFA opcional sin presentar OTP fijo como real. Revisar junto a C convenciones de errores compartidas antes de tocar `lib/envelope.js`.
- S1-A2 E12: filtros/paginación y cursor, incluyendo límite inválido y búsquedas vacías.
- S1-A3 E13: detalle y exclusión de datos sensibles; 404.
- Entrega: tests de acceso y consulta; informe de comportamiento que todavía falte, no afirmar seguridad productiva completa.

### B Catalina

- S1-B1 E04: permisos admin exclusivamente, lista con datos.
- S1-B2 E05: creación con validaciones de todos los campos/beneficios.
- S1-B3 E06: actualización correcta e inexistente.
- S1-B4 E07: baja y beneficios dejan de ofrecerse.
- Entrega: flujo crear → consultar → actualizar → baja, con persistencia, permisos y errores probados.

### C Felipe

- S1-C1 E23/E24: catálogo y lectura de planes.
- S1-C2 E25: crear plan, validar precio/limits/features; todavía no afirmar sincronización Stripe.
- S1-C3: acordar modelo mínimo de suscripción y casos de conversión/MRR con ejemplos calculados a mano. Estos son preparación de E02/E03/E27, no cierre de métricas.
- Entrega: catálogo coherente y tests positivos/negativos; corregir el caso de precio negativo conocido.

### Trabajo compartido del sprint

- Revisar guía de datos antes de programar; no discutir nombres en cada PR.
- Acordar rama y dueño de cada cambio; revisor circular C→A→B→C.
- Un integrante distinto del preparador reproduce el entorno desde cero.
- En el primer día registrar capacidad. Si el compromiso excede lo disponible, conservar como mínimo E01 revisado y sponsors completo; mover consultas adicionales al siguiente sprint sin declarar avance ficticio.
- Demostración: solicitudes HTTP de un admin, denegación de otro rol, registro nuevo, consulta persistente y errores válidos. Frontend opcional.

Aceptación del sprint: smoke verde; tests de las funciones comprometidas verdes; ninguna función marcada terminada con fallo contractual abierto; documentación breve, revisión ajena y evidencia reproducible. Otras pruebas rojas se mantienen identificadas como backlog, no se borran.

## Sprint 2 soporte banco de preguntas y restricciones de planes

- A: E14–E16, correo único, auditoría y tickets; investigación temprana del mecanismo real de operación. Entregar decisión sobre recursos propios/externos, permisos y límites; no crear facturación sin autorización.
- B: E19–E21, listar/crear/editar preguntas con validación coherente. Preparar función reutilizable de validación para importación y recorrección.
- C: E27, suscripciones activas y bloqueo de eliminación correcto. Preparar diseño Stripe test, identificadores y fallo/reintento; crear/configurar acceso privado solo cuando se autorice.
- Dependencia: acordar en este sprint interfaz de transacción que E18 utilizará sobre pregunta y medallas del usuario.
- Cierre: soporte y preguntas operables, eliminación de plan protegida, pendientes de infraestructura/pasarela con responsable y fecha de revisión.

## Sprint 3 recorrecciones importación y Stripe de prueba

- A: E08 y consolidar adaptador/permisos de operación; apoyar revisión de concurrencia y seguridad de E18 sin modificar el módulo por su cuenta.
- B: E22 y E17/E18: importación, recorrección idempotente, 250 bronce una vez y notificación in-app consultable.
- C: E26 y sincronización de precios en Stripe test, verificación en proveedor y pruebas de error; no checkout del alumno.
- Cierre: doble confirmación/concurrencia no duplica recompensa; precio cambiado se refleja en sandbox y fallo no produce falso éxito. Fixtures no sustituyen esas demostraciones.

## Sprint 4 cálculos y observaciones reales

- A: E09/E10 sobre recursos de desarrollo autorizados; medir, no simular.
- B: reforzar pruebas de importación/recorrección, disponibilidad de beneficios y concurrencia; aportar revisión e integración de datos que consume C.
- C: E02/E03 desde registros, fórmulas, rangos, frecuencia configurable, timestamps y coherencia de series. Elegir implementación de planificación compatible con entorno, sin asumir cron cada 5 minutos en Vercel Hobby.
- Cierre: indicadores cambian cuando cambian datos, no permanecen en snapshot; salud y recursos tienen evidencia real y ausencia de observaciones tratada correctamente.

## Sprint 5 reinicio integración y cierre de funciones

- A: E11, reinicio real controlado, autorización, 202 y seguimiento del resultado; fallos 503 y recurso inexistente 404.
- B/C: regresión cruzada y corrección de defectos de sus dominios, escenarios completos e integración.
- Todos: revisar cobertura de los 27 endpoints, comandos Docker y manual, seguridad/dependencias, criterios de aceptación, evidencias y pendientes residuales. No equiparar tests verdes de ocho casos con cobertura total.
- Publicación en Vercel solo tras autorización y revisión de variables/accesos, nunca enviar `.env` o export del emulador a GitHub. El cierre académico posterior sigue la Gantt vigente.

## Cómo trabajar cada tarea

1. Leer su endpoint original, criterios en `endpoints.json` y pruebas existentes.
2. Registrar estado EN_PROCESO y rama en control; máximo una tarea funcional principal por persona para no acumular cambios sin integrar.
3. Escribir/reproducir test del comportamiento esperado; programar validación, permisos, lógica y persistencia.
4. Ejecutar prueba de su módulo y smoke de conjunto. Si modifica un contrato interno, ejecutar pruebas de consumidores.
5. Preparar PR pequeño con ID de endpoint, evidencia, cambios de esquema, pruebas y límites. No pegar secretos.
6. Revisor inspecciona y reproduce; después integración por persona designada, respetando permisos de GitHub/Vercel.
7. Actualizar control con archivo, commit, comando, resultado, fecha y siguiente tarea. VERIFICADO requiere evidencia y no solo declaración del autor.

## Seguimiento Scrum mínimo

Planificación: objetivo, tareas concretas, capacidad y dependencias. Seguimiento breve: qué terminó, qué sigue, qué bloquea; no reportar únicamente porcentaje. Revisión: demostrar el incremento real. Retrospectiva: una mejora concreta para el siguiente sprint. No inventar actas o asistencia; registrar cuando ocurran.

Al retomar con el asistente, pedir: «Lee la memoria y docs/00_CONTROL_FASE2.md; revisa cambios desde la última verificación y continúa con la próxima acción registrada. No publiques ni toques la base remota sin autorización». La memoria raíz no se publica; este control de equipo sí puede compartirse sin secretos.
