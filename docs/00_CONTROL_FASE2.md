# Control de Fase 2 Aprueba Administración

## Publicación y verificación C — 19/10/2026

Felipe solicitó publicar su rama y repetir pruebas. `equipo-c/felipe-planes-metricas` publicada; referencia 8cf0a51 verificada en remoto. Docker iniciado; aplicación disponible para revisión manual en localhost:15173 con datos de desarrollo conservados. Unitarias15/15, catálogo7/7, billing simulado5/5, métricas7/7, contrato8/8 y smoke7/7: 49/49 en esta ejecución. Frontend compila. Evidencias de hoy separadas de las históricas. [Resumen automático](16_PRUEBAS_AUTOMATICAS_C_2026-10-19.md) y [checklist manual sin autoaprobar](15_CHECKLIST_MANUAL_FELIPE.md). Próxima acción: Felipe realiza los casos manuales, Catalina revisa C y se obtiene Stripe sandbox para aceptar E26. Sin merge a main ni PR creado en esta intervención.

## Bloque C de Felipe — 16/10/2026

Rama local `equipo-c/felipe-planes-metricas`, desde `93c8096`. Implementados catálogo/validación de planes, baja según suscripciones y cálculo periódico de métricas; permisos E02/E03 contrastados con Notion y Word original. E26 tiene adaptador Stripe test con idempotencia y pruebas con proveedor simulado: aceptación sandbox real PENDIENTE (Felipe no dispone de cuenta configurada). Detalles, decisiones de datos y límites en [guía C](12_BLOQUE_C_FELIPE.md); revisión asistida de A en [guía 13](13_REVISION_A_PARA_FELIPE.md).

Pruebas Docker: unit15/15, C catálogo7/7, C billing5/5, C métricas7/7, contrato8/8, smoke7/7, A S1 8/8 y A S2 7/7. Frontend compila; Comercial comprobado como finance y constructor visible como admin. Evidencia local en `.local/felipe-evidence/`. No equivale a aceptación académica o cobertura total. Última acción: desarrollo y verificación local. Próxima: revisión humana de C por Catalina, confirmación de acuerdos compartidos y cuenta Stripe test para aceptar E26. Sin publicación, merge o despliegue.

## Publicación vigente — 03/10/2026

Incremento A publicado y verificado en `origin/equipo-a/backend-sprints`, commit de implementación `07f0f86ab14c43f40c2060de980c3f07d72b1b95`. Base compartida sigue c0bd41f; main sigue fe94dbf. No PR, merge ni despliegue manual. Ver guía10 para revisión. Las notas inferiores y los Excel mantienen su corte de pruebas del29/09: publicación ya realizada, revisión humana y aceptación aún pendientes. Hoy no se repitieron suites runtime ni se verificó el panel de Vercel.

## Estado vigente — 29 de septiembre de 2026

La copia local está en `equipo-a/backend-sprints`, base `c0bd41f`. Bloque A de Tsung-Hao: E01, E08–E16 implementados y comprobados localmente, con la salvedad de que E09 tiene una sonda de laboratorio, no cinco servicios empresariales configurados. Código y pruebas preparados con asistencia IA; revisión humana y demostración pendientes. No hay commit/push nuevo, merge, PR ni despliegue.

- S1 A: E01/E12/E13, 8/8 pruebas de integración.
- S2 A: E14–E16, 7/7, transacciones, concurrencia y auditoría incluidas.
- S3–S5 A: E08–E11, 8/8; medición HTTP real, recursos Docker reales y cambio real de StartedAt al reiniciar el contenedor dedicado autorizado.
- Unitarias: 5/5. Smoke base: 7/7. Smoke con laboratorio: 7/7.
- Contrato general: 1/8 aprobada; quedan 7 fallos de E02, E04, E05, E18, E20, E25 y E27. No se borraron ni saltaron las pruebas.
- Evidencia: `evidencias/equipo-a/resultados.json` y TAP individuales. Son 50 ejecuciones, 43 aprobaciones y 7 fallos; incluye repetición de smoke en dos configuraciones, no 50 casos únicos ni cobertura de líneas.
- Seguimiento: seis Excel en `seguimiento/`, copias de ejecución Fase 2; originales V3/V2 y documentos académicos intactos.
- Firebase remoto, Vercel y Corestream sin modificaciones. Pruebas aisladas en `demo-aprueba-tests`; desarrollo en `demo-aprueba-equipo`.

Siguiente acción: Tsung-Hao reproduce y explica S1; Felipe revisa A (incluidos auth/errores compartidos); acordar capacidad/fechas y alcance del Hito 1. Solicitar publicación de la rama si se desea compartir este incremento. Ver guías 08 y 09. Recepción en segundo computador, servicios de negocio, integración B/C y aceptación docente siguen pendientes.

## Registro histórico de preparación y recepción

Las notas siguientes describen comprobaciones anteriores. Las menciones a motor ausente, ocho fallos o simulación operativa no son el estado vigente de esta rama A.

Actualizado: 23 de septiembre de 2026. Base desde fe94dbf en rama codex/base-fase2-equipo, preparada para publicación autorizada por el usuario en esta fecha, sin merge a main. Confirmar recepción con git ls-remote y guía 07. Fuente funcional: sección 4 del Word original, 27 endpoints, Node.js/Express. Los dos Word nuevos están descartados; Cloud Run no obligatorio. Respuestas de Max incorporadas en guía de datos/aceptación.

## Estamos aquí

Seguimiento de recepción Docker: primer build/up del usuario creó 45 documentos; backend y Firestore saludables. Frontend falló EACCES al escribir configuración temporal Vite. Este commit incluye la corrección en frontend/Dockerfile.dev: chown de /app a node conservando USER node; reconstruido solo frontend con --no-deps, sin reiniciar seed/base/backend. Navegador Chrome1440x1000: login local200 → resumen con datos ficticios → logout aprobado; métricas/services200 vía proxy, sin pageerror/overlay, dos advertencias futuras React Router. Frontend sigue en ejecución. Publicación solicitada en codex/base-fase2-equipo, sin merge a main. Persistencia stop/up, recarga y suites completas Docker siguen pendientes. Registro detallado en memoria raíz sección43.

Para quienes ya descargaron la rama: con cambios propios guardados y estando en codex/base-fase2-equipo, ejecutar `git pull --ff-only` y `docker compose --profile ui up --build -d --no-deps frontend`. Quienes aún no iniciaron el entorno usan el arranque completo del README. No borrar volúmenes. Si trabajan en su propia rama de endpoint, incorporar la base actualizada de forma coordinada; no sobrescribir su trabajo.

Publicación realizada el 23 de septiembre: paquete `0e199ba` subido a `origin/codex/base-fase2-equipo`. Main conservada en `fe94dbf`; sin merge ni PR. La recepción por compañeros y ejecución Docker siguen PENDIENTES. Guía 07 es la siguiente acción. Las notas inferiores de «sin commit/push» son bitácora histórica de preparación, no estado vigente.

Prioridad vigente: Hito 1 (28 septiembre–03 octubre), MVP con base operativa; Hito 2 (26–31 octubre), proyecto completo en Docker. No esperar Docker completo para revisar/programar endpoints. Alcance mínimo aceptado del MVP y modalidad de demostración aún por confirmar. Fechas de Sprint 1 y capacidad se acuerdan con el equipo, no se inventan. Guía 07 sustituye el requisito histórico de integrar main antes de recibir la base.

Paso 0 de preparación y recepción, antes de iniciar el compromiso de Sprint 1. Archivos creados; smoke con emulador verificado; falta validar Docker con un motor disponible y entregar la base común a los tres. Ningún endpoint se marca completado por generar este paquete.

## Estado del paquete

- Reparto y catálogo: ACTUALIZADO; catálogo de 27 rutas únicas validado, puntos A34/B33/C35 y cantidad A10/B10/C7. Asignación inicial A Tsung-Hao, B Catalina, C Felipe.
- Plan de sprints: ACTUALIZADO; fechas/capacidad todavía PENDIENTE de planificación real.
- Dockerfiles y Compose: ACTUALIZADO; verificación de build/up BLOQUEADO_POR_INSUMO (motor Docker no disponible), no por falta de requisito de empresa.
- Fixtures y guardia: VERIFICADO por pruebas unitarias, carga y lectura en emulador. No cargar en nube.
- Smoke: VERIFICADO 7/7 fuera de Docker (añadida prueba de cambio de precio).
- Visor Firestore: configuración ACTUALIZADA; navegación y precio actualizado por API VERIFICADOS fuera de Docker. Ver guía 06. Docker y monitor Requests pendientes de comprobación.
- Contrato: tests ACTUALIZADOS y ejecutados, 8 fallos funcionales abiertos. No confundir ejecución del test con cumplimiento del requisito.
- Build frontend: VERIFICADO como compilación solamente.
- Publicación de base: VERIFICADA por push y referencia remota 0e199ba; reproducción por otro integrante: PENDIENTE.
- Stripe real de pruebas, medición/reinicio de recursos de desarrollo: PENDIENTE; no implementados.

## Registro por endpoint

Todos comienzan PENDIENTE de aceptación, aunque exista código. Para cada fila lógica de `endpoints.json`, registrar aquí cuando se tome: ID, responsable, rama, estado, evidencia, siguiente paso. No duplicar métodos/rutas a mano: catálogo es fuente de asignación.

- E01, E12, E13 → A, candidatos Sprint 1, PENDIENTE.
- E04–E07 → B, candidatos Sprint 1, PENDIENTE.
- E23–E25 → C, candidatos Sprint 1, PENDIENTE.
- Restantes E02/E03/E08–E11/E14–E22/E26/E27 → PENDIENTE según secuencia de sprints. Las series anteriores son agrupaciones: consultar catálogo para responsable exacto.

## Pendientes antes de programar en paralelo

- Confirmar recepción de los bloques asignados y capacidad/fechas, no conocimientos supuestos.
- Publicación solicitada: usar rama compartida, sin modificar main ni repo académico. Recibir el commit publicado y confirmar accesos personales.
- Verificar Docker en un computador con motor disponible; reproducir README desde una segunda copia/equipo. Esta recepción sigue pendiente, no es motivo para detener lectura de contrato y preparación de tests.
- Acordar interfaces usuario/suscripción/medallas/pregunta y dueño de archivos compartidos.
- Elegir rama por tarea pequeña y revisor circular.

## Pendientes que no detienen todo el sprint

- Cuenta Stripe test y acceso privado para E26; sin compartir contraseña personal.
- Recursos de desarrollo autorizados y mecanismo seguro para E09–E11. Cloud Run no impuesto. No asumir control de contenedores de Vercel.
- Compatibilidad/diseño de planificación periódica de métricas, actualización parametrizada aún no implementada.
- Expandir pruebas de aceptación y regresión a todos los criterios del contrato.
- Remediación de dependencias antes de exposición productiva; no actualizar mayores a ciegas.

## Bitácora

2026-09-23 — Preparador: asistente. Creada copia de trabajo aislada desde remoto comprobado, Docker/Compose, guardias, fixtures, pruebas y guías. Sin cambios funcionales de endpoints; solo HOST opcional de arranque y proxy Vite configurable para contenedores. Carga/pruebas en demo-aprueba-tests, sin usar Firebase real. Tres unitarias y seis smoke aprobadas; ocho pruebas de contrato fallan y se asignan a responsables. Build frontend aprobado. Docker no ejecutado por falta de motor. No publicación ni modificación de Vercel.

Última acción terminada: preparación y verificación local de las partes disponibles. Próxima acción: validar Docker y revisar/publicar base común con autorización; después iniciar S1-A1, S1-B1 y S1-C1 en ramas separadas.

Comprobación final: catálogo contrastado 27/27 contra el Word original; YAML/JSON/sintaxis y enlaces locales revisados. Corregido recuento del seed a 45 documentos. Repetida suite contractual después del ajuste del runner: conserva sus ocho fallos conocidos. Emulador temporal detenido y puertos liberados. Añadida guía 05 para recepción, ramas, revisión y reanudación. No hay commit/push nuevo.

## Plantilla de actualización

Actualización posterior 2026-09-23: petición de interfaz para revisar cambios locales. Habilitada Firebase Emulator Suite UI en 4001, puertos auxiliares solo loopback; tests usan configuración sin visor. Precarga de UI en Dockerfile. Prueba Chrome/Playwright escritorio: login → PUT precio 1000 a 1250 → documento visible con 1250 → GET coincidente. Precio restaurado, procesos temporales detenidos. Sin cambios en servicios remotos ni publicación Git. Avisos app/app-deleted del visor oficial permanecen aunque el flujo funcionó; sin excepciones pageerror. Añadido color a fixtures de planes tras reproducir 500 por color undefined; no se cambió lógica del endpoint. Documentado cómo completar color en un emulador previamente cargado sin sobrescribir datos. 3 unitarias + 2 tests de configuración + 7 smoke aprobados. Ocho fallos contractuales previos no se consideran corregidos. Próximo: instalar/disponer de motor y validar Compose completo, luego publicación autorizada y recepción del equipo.

Fecha:
Endpoint o tarea:
Responsable y rama:
Archivos modificados:
Estado (PENDIENTE / EN_PROCESO / ACTUALIZADO / VERIFICADO / BLOQUEADO_POR_INSUMO):
Comprobación ejecutada y resultado real:
Pendiente o bloqueo:
Última acción terminada:
Próxima acción exacta:

No incluir credenciales o datos personales reales. Si no se pudo ejecutar algo, anotar NO_EJECUTADO con causa; no inferir éxito de otro entorno. El asistente también actualiza memoria raíz al cerrar una intervención. No hay seguimiento automático de cambios que el equipo no comparta o que todavía no se hayan inspeccionado.
