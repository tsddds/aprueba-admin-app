# Desarrollo del bloque A

Responsable del bloque: Tsung-Hao Liu Hsiao. Preparación de código y pruebas asistida por IA a petición del responsable. Revisión humana, comprensión y demostración siguen pendientes hasta registrarse realmente. Corte: 29 de septiembre de 2026. Rama local `equipo-a/backend-sprints`, base `c0bd41f`.

## Plan de ejecución

1. Sprint 1: E01, E12 y E13. Implementados y 8/8 pruebas locales aprobadas. Login, TOTP opcional real, tokens/permisos, paginación y detalle sin secretos. Revisión humana pendiente.
2. Sprint 2: E14, E15 y E16. Implementados y 7/7 aprobadas. Actualización transaccional, unicidad concurrente de correo, auditoría y respuestas conservadas. Revisión humana pendiente.
3. Sprint 3: E08. Lectura de plataformas ficticias persistidas y permisos verificados en suite operativa.
4. Sprint 4: E09/E10. Adaptadores HTTP/Docker reales implementados. Una sonda HTTP local configurada; no son los servicios empresariales. Recursos del contenedor dedicado comprobados.
5. Sprint 5: E11. Reinicio real de `aprueba-ops-lab` y auditoría verificada mediante cambio de StartedAt. Suite operativa S3–S5: 8/8 aprobadas.
6. Regresión y entrega local: 5/5 unitarias, 7/7 smoke base, 7/7 smoke ops; contrato general 1/8. Seis Excel, reportes TAP y guía preparados. Publicación, revisión de pares y aceptación pendientes.

Se respeta la secuencia funcional, sin declarar cinco ceremonias Scrum realizadas ni inventar fechas de reuniones. El Hito 1 está entre 28/09 y 03/10; el avance de A no certifica el MVP grupal ni completa los bloques B/C.

## Límites y decisiones

- Conservar JavaScript, Node.js, Express y el contrato original de 27 endpoints administrativos. No incluir los documentos FastAPI descartados.
- Usar únicamente `demo-aprueba-tests` para pruebas destructivas y `demo-aprueba-equipo` para desarrollo. No publicar ni desplegar sin nueva autorización.
- El usuario autorizó expresamente Docker local y un contenedor dedicado para monitoreo y reinicio. No operar otros contenedores, nube ni Corestream.
- Mantener módulos B/C intactos. Los cambios compartidos de autenticación/errores requieren regresión y revisión de Felipe antes de integrar.
- Rechazar MFA fijo. Usar TOTP estándar si está habilitado, sin añadir endpoints de enrolamiento al alcance.
- Auditar acciones en colecciones independientes, mediante transacciones, sin sobrescribir medallas ni historial.
- Mantener originales académicos y Fase 1 como línea base histórica. El seguimiento de ejecución se guardará en Fase 2, enlazado con esa línea base.

## Fuentes académicas revisadas

Rúbricas originales de avance y final Fase 2, guía 2.4 y guía 2.6. Exigen metodología, ajustes justificados, documentación/programación/almacenamiento, evidencias en Git, aportes identificables y conocimiento demostrado. No asignar nota ni copiar las marcas de ejemplo de las planillas docentes. Las reflexiones, intereses y participación personal deben ser confirmados por el estudiante.

## Registro de comprobaciones

Inspección inicial: árbol de trabajo limpio, base remota c0bd41f, rutas A y contrato original revisados. Docker instalado pero motor apagado al inicio. Las verificaciones históricas no se presentan como ejecuciones de esta intervención.

Motor Docker local iniciado y probado. Las ejecuciones se registran en `evidencias/equipo-a/resultados.json`, con comandos, horas UTC, códigos de salida y conteos. El corte local es 29/09/2026; los registros UTC corresponden al 30/09. No se modifica el reloj ni se retrofechan ceremonias.

La prueba contractual existente pasa ahora el conflicto de correo E14. Siguen abiertos: E02 permisos de métricas, E04 permisos de sponsors, E05 validación de sponsor, E18 repetición de recorrección, E20 alternativa inválida, E25 precio negativo y E27 error de baja de plan con suscriptores. Responsables B/C conservan sus módulos. Revisión académica no equivale a calificación: no se asignaron notas.

Cambios comunes a revisar con Felipe: `lib/jwt.js`, `lib/envelope.js`, `middleware/auth.js` y `middleware/error.js`. El JWT exige secreto de al menos 32 bytes; antes de un despliegue futuro debe comprobarse su configuración, sin copiar secretos al repositorio. El emulador ya usa un valor público exclusivo de laboratorio suficiente.

Una repetición detectó un fallo intermitente en E14 concurrente (200/500 en vez de 200/409). Se conservó `a-sprint2-antes-correccion-bloqueos.txt`. Causa corregida: adquirir el bloqueo global antes de leer el usuario; el orden previo permitía una espera circular al consultar la colección. Los resultados vigentes son los de la repetición posterior, no se oculta la ejecución fallida.

## Pendientes que no deben ocultarse

- Configurar URLs autorizadas de los servicios de negocio en E09; la implementación admite hasta veinte sondas, pero no prueba por sí sola pagos/notificaciones/preguntas reales.
- Aceptación/revisión de A, comprensión del código y defensa personal del estudiante.
- Corregir los siete defectos B/C, integrar y ejecutar regresión completa.
- Confirmar mínimo de MVP, modalidad local/remota y calendario real con el equipo/docente. Gantt histórico conservado, no reprogramado arbitrariamente.
- Endurecimiento previo a producción: limitación de intentos de login, rotación/revocación de refresh, custodia/provisión del secreto TOTP, auditoría de dependencias y pruebas de carga. No se certifica seguridad productiva.
- Mejorar paginación y unicidad a gran escala: actualmente se lee la colección y se usa un bloqueo transaccional compartido para correo; los demás escritores deben respetar ese mecanismo.
- Publicación de esta rama y recepción en segundo computador. No están realizadas.
