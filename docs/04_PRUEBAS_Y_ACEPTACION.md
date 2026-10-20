# Pruebas y aceptación del backend

Fecha de preparación: 23 de septiembre de 2026. Este archivo distingue pruebas realmente ejecutadas, defectos observados y escenarios pendientes. No certifica API completa ni seguridad de producción.

## Revisión conjunta vigente — 20/10/2026

Código revisado: `db6c91693ee1368ff7d710a5fa78c3f2ac974f98`, rama local `codex/integracion-fase2`, en la carpeta principal existente. Incluye A93c8096, B completo con E18 y fixes abf31e0/15df2cb/720120f, y C8cf0a51/db6c916. Fetch y consulta read-only de GitHub realizados. PR1 figura merged a A; PR2–10 están cerrados sin merge individual según API. Esto no implica ausencia de sus cambios: la ascendencia y el árbol integrado sí los contienen. No se modificaron PR, main ni remotos.

Pruebas ejecutadas de nuevo, secuencialmente con emulador separado:

- B: diez suites,110/110. Incluyen transacción de E18, premio único, aviso in-app, importación de borradores y compatibilidad b1.
- C: catálogo7/7, billing5/5 con proveedor **simulado**, métricas7/7.
- A: Sprint1 8/8, Sprint2 7/7 y operaciones8/8, con medición HTTP/Docker y reinicio real del laboratorio autorizado.
- Smoke7/7; los ocho detectores contractuales originales8/8.
- Unitarias backend15/15; helpers frontend15/15; configuración Firestore2/2.
- Total199/199 ejecuciones de tests, cero fallos y skips en estas suites; compilación Vite aparte exitosa. No es porcentaje de cobertura de líneas ni aceptación integral. El diagnóstico adicional de `note` descrito abajo es un incumplimiento reproducido, fuera de esas suites.

Fuentes reproducibles: [resultados y comandos](evidencias/integracion/resultados.json), archivos `final-*.txt` del mismo directorio, [diagnóstico adicional](evidencias/integracion/probe.json) y [recorrido de navegador](evidencias/integracion/ui-resultados.json). Los logs anteriores de equipo-a conservan sus fechas; los ocho defectos de aquella lista histórica pasan ahora sus detectores sin cambiar las expectativas.

Comando de cada suite API desde la raíz del repositorio: `docker compose -f compose.yaml -f compose.ops.yaml --profile test run --rm test node dev/run-tests.mjs NOMBRE`. Nombres: `a-sprint1`, `a-sprint2`, `a-ops`, `b-sponsors`, `b-sponsors-create`, `b-sponsors-update`, `b-sponsors-delete`, `b-questions-list`, `b-questions-create`, `b-questions-update`, `b-questions-import`, `b-corrections-list`, `b-corrections-resolve`, `c-catalog`, `c-billing`, `c-metrics`, `smoke`, `contract`. No ejecutar simultáneamente contra el mismo emulador. Unitarias: mismo comando Compose seguido de `npm test`. El overlay operativo requiere el laboratorio local autorizado; nunca usarlo contra infraestructura productiva.

### Pendiente funcional B: E18 no acepta note

El Word original sección4 enumera `note` como string opcional de nota interna. En `backend/src/routes/corrections.js`, `bodyObject` solo permite `resolution` y `questionPatch`; `backend/src/data/corrections.js` tampoco recibe/persiste la nota. Prueba nueva sobre solicitud ficticia **pending**: enviar `{ "resolution":"rejected", "note":"Nota interna de prueba local" }` devuelve400 VALIDATION_ERROR field=note, cuando debe permitir la nota y resolver200. Verificado que solicitud/listado permanecen iguales tras el rechazo. No es error de sintaxis ni falta de E18 completo: falla un campo opcional concreto de una función ya implementada.

Responsable propuesto: Catalina, con revisión de transacción por A/C. Corrección: admitir `note`, validar tipo y longitud con límite interno explícito, pasarla al servicio y persistirla dentro de la misma transacción de resolución. Mantenerla como nota interna, no copiarla al mensaje del alumno. Añadir casos con/sin nota, tipo inválido, persistencia y reintento sin duplicar premio/aviso. No basta añadirla a la lista de campos permitidos sin guardarla. La revisión no hizo ese cambio funcional por cuenta propia.

### Pendiente externo C: Stripe real de pruebas

El adaptador está implementado y pasa pruebas simuladas de cambio de precio, fallo, reintento e idempotencia. No se recibió/configuró cuenta Stripe test ni se ejecutó una solicitud real al proveedor. Sin configuración,503 STRIPE_NOT_CONFIGURED y precio sin cambios son el bloqueo previsto, no un fallo de Docker. Felipe debe completar la aceptación en cuenta de pruebas según guía12 y checklist15, usando secreto privado fuera de Git. No crear cobros reales ni compartir claves en chat. No eliminar `planPriceOperations` para desbloquear reintentos.

Se contrastó el uso de Prices e idempotencia con [creación de precios](https://docs.stripe.com/api/prices/create) y [reintentos idempotentes](https://docs.stripe.com/api/idempotent_requests). Esto valida la orientación del adaptador, no sustituye la prueba de aceptación real. Antes de publicar en Vercel, resolver también el disparador periódico: el temporizador Node funciona con Docker activo, pero no garantiza ejecución continua en serverless. La caché se renueva por consulta al vencer.

### Dos ajustes menores de interfaz, sin bloqueo de API

- `frontend/src/i18n.js`, `q_intro` ES/EN: sigue diciendo importar publicadas; el importador guarda borradores. Catalina debe alinear ese texto con la política de importación ya correcta, sin cambiar el importador para satisfacer un texto desactualizado.
- `frontend/src/pages/Overview.jsx`, mapa de servicios: usa `key={s.id}` pero E09 devuelve `key` (por ejemplo lab), no `id`. El navegador muestra aviso React de claves no únicas. Ajuste compartido A/C: usar la clave estable `s.key`. No renombrar IDs de Firestore ni cambiar el contrato E09 para silenciar un warning. Es compatibilidad del cliente auxiliar, no fallo del reinicio ni de la base.

### Navegador, datos y límites

Skills de pruebas frontend y revisión React aplicadas. Browser plugin/skill ausente; Playwright/Chrome existente, escritorio1440×1000, URL5173. Login admin, Resumen, formulario Sponsors/beneficios, pregunta estructurada, listado de recorrecciones, constructor de planes, logout y login finance→Comercial comprobados. Finanzas no ve Sponsors/Resumen/Planes; Comercial carga sin consultar overview. Sin pageerror, pantalla vacía ni overlay Vite. Consola con advertencias conocidas de Router y aviso key de Overview descrito arriba; no se afirma consola limpia. No se probaron todos los guardados por UI ni móvil. Las escrituras están cubiertas por API en base de tests.

Conservado el volumen previo de desarrollo, sin reset: suscripciones antiguas ya pueden vencer y MAU disminuir. En la base persistida se observaron MAU2, convertidos0 y MRR0; el cálculo con fixtures nuevos aislados produce4/2/50%/8000. No es por sí solo un error ni motivo para borrar datos. La semilla create-only no desplaza fechas de documentos existentes.

No hay diferencias de manifiestos/lockfiles ni de configuración/middleware A entre f31cec9 y db6c916; no hizo falta instalar plugins ni cambiar dependencias. Se conservan IDs físicos/referencias y no hubo migración ni carga masiva de datos. `subscriptions.plan` usa el ID del plan; `users.state` no sustituye vigencia de suscripción. El cambio de plan administrativo E14 sigue sin cobrar ni modificar la suscripción. Métricas añade snapshots calculados, no reemplaza registros fuente. No se certifica ausencia de todos los defectos ni seguridad productiva.

Siguiente orden: corregir E18 note y repetir su suite/contrato; verificar Stripe test; revisar manualmente en los tres computadores; aprobar integración y solicitar publicación/PR final; solo después planificar despliegue y aceptación. Fechas y ceremonias de sprints requieren registro humano, no se dan por cumplidas por las pruebas.

## Resultados iniciales

- Unitarias de preparación: 3 de 3 aprobadas (guardia, fixtures, catálogo/reparto).
- Smoke de API con emulador: 7 de 7 aprobadas; incluyen login cuatro roles, 26 operaciones protegidas sin token, lecturas, escritura/consulta de sponsor y cambio de precio con lectura posterior (añadida al habilitar visor).
- Configuración del visor: 2 de 2 pruebas aprobadas con `node --test infra/firestore/config.test.mjs` desde raíz.
- Visor oficial: Chrome/Playwright escritorio 1440×1000, navegación plans → pl_demo_empty y actualización observada 1000→1250 enviada por API; lectura posterior confirma dato. Sin excepciones pageerror; avisos app/app-deleted del visor oficial al navegar, no consola completamente limpia. Detalle/límites en guía 06. No se probaron los botones del frontend Aprueba ni edición manual con lápiz.
- Contrato inicial: 0 de 8 aprobadas; ocho incumplimientos del código base detectados. No se ocultaron como skip/todo.
- Build frontend Vite: completado. Es compilación, no revisión visual o test de navegación.
- Docker build/up: NO EJECUTADO por ausencia de motor Docker disponible. No inferir que pasar tests fuera de Docker valida imagen, red, volúmenes, recarga y export/import.
- Comprobaciones estáticas: YAML analizado con soporte de anclas/merge; seis servicios, proyectos demo separados y puertos publicados en loopback. Diez archivos MJS pasan comprobación de sintaxis; JSON válidos y enlaces locales comprobados. Los 27 métodos/rutas del catálogo coinciden exactamente con encabezados del Word original. Esto no sustituye `docker compose config` ni build/up.

Ejecución local de comprobación: Node 24.16.0, Java 17.0.12, Firebase CLI 14.12.0 y Firestore Emulator 1.19.8. Las imágenes propuestas usan Node 22 y Java 21; esa diferencia de runtime queda pendiente de verificar con Docker. No se accedió a Firebase/Vercel ni se usaron credenciales reales.

Al finalizar se detuvo el emulador temporal y se comprobó que sus puertos 8082/4402/4502/9150 ya no estaban escuchando. Los procesos API de las suites también finalizaron. No se dejó un servidor de desarrollo ejecutándose.

## Ocho defectos reproducidos

- E02, C: support obtiene 200 en overview; debe 403 por contrato original.
- E04, B: finance obtiene 200 en sponsors; debe 403.
- E05, B: sponsor sin tier/monthlyFee obtiene 201; debe 400 y VALIDATION_ERROR.
- E20, B: alternativa E con solo dos opciones obtiene 201; debe 400 INVALID_CORRECT_ANSWER.
- E18, B: solicitud ya confirmed vuelve a resolverse con 200; debe 409 CORRECTION_ALREADY_RESOLVED.
- E14, A: correo repetido de otro alumno obtiene 200; debe 409 EMAIL_ALREADY_EXISTS.
- E27, C: responde 409 con PLAN_HAS_SUBSCRIPTIONS; contrato exige PLAN_HAS_SUBSCRIBERS. El test no valida por sí solo la lógica completa de suscripciones.
- E25, C: precio negativo obtiene 201; debe 400 VALIDATION_ERROR.

Son pruebas parciales concretas, no lista exhaustiva de todos los defectos. Reinicio simulado, Stripe pendiente y snapshots de métricas se observaron por lectura de código; aún requieren escenarios automatizados de integración real.

## Capas de pruebas

Preparación: protege semilla/destinos y coherencia de datos. Smoke: comprueba que la base técnica permite trabajar. Contrato: comprueba reglas/errores específicos; debe ponerse verde a medida que se implementa. Integración externa: Stripe sandbox y recursos reales de desarrollo; no sustituir con mocks al demostrar su aceptación.

`test:contract` debe seguir devolviendo código de salida 1 mientras falle. No cambiarlo a éxito incondicional, borrar asserts, excluir archivos o marcar tests skip para presentar el sprint terminado. Si cambia el requisito, documentar fuente y actualizar implementación/test juntos.

## Ampliación por integrante

Guardar nuevos tests en `backend/test/integration/a-*.test.mjs`, `b-*.test.mjs` o `c-*.test.mjs`. Actualizar el runner de manera coordinada para ejecutarlos (el runner inicial solo selecciona smoke/contract). Reutilizar helper/login y emulador de tests, no URL de Vercel. Separar suites por módulo cuando crezcan. No introducir credenciales en fixtures.

Para cada endpoint: camino correcto; entrada obligatoria ausente; tipo/enum inválido; recurso inexistente; token ausente/inválido/expirado; rol permitido/prohibido; persistencia y error del proveedor cuando aplica. 204 sin JSON. Revisar envelope data/error/meta y códigos del Word. Paginación sin duplicados, límite máximo y cursor mal formado.

Para escritura: no filtrar campos sensibles, no sobreescribir campos ajenos, comprobación de idempotencia/concurrencia donde hay efectos de recompensa/sincronización. Registrar auditoría de acciones requeridas. No ejecutar tests destructivos en ambiente compartido.

## Criterio de terminado de cada tarea

1. Código cumple método/ruta/entrada/salida/permisos/errores del contrato original y respuestas vigentes de Max.
2. Test específico reproduce criterio, pasa y no depende de estado accidental de pruebas anteriores.
3. Smoke de conjunto sigue verde; consumidores afectados están probados.
4. Persistencia/reglas y efectos secundarios están comprobados, no solo HTTP 200.
5. Revisión de otro integrante y sin secretos/datos reales en diff.
6. README/contrato interno actualizado si cambió uso/configuración; evidencia registrada con comando, fecha y resultado.
7. No marcar integración externa terminada por tener stub/fixture; se verifica el servicio correspondiente.

## Criterio de aceptación del paquete Docker

Pendiente ejecutar en motor Docker: `config --quiet`, build de las tres imágenes, arranque sin .env, seed código 0, login y lectura, UI opcional, test aislado, recarga al editar, stop/up con conservación de cambios, y apagar sin procesos huérfanos. Repetir desde copia limpia en otro integrante. No borrar un volumen para simular que la persistencia funciona.

## Dependencias y límites de seguridad

Se instalaron dependencias únicamente en esta copia y se generaron lockfiles reproducibles. No se ejecutó `npm audit fix --force` ni se migraron versiones mayores. `npm audit --omit=dev` en backend informa 8 avisos moderados en la cadena Firebase/uuid (cero altos/críticos en ese chequeo). No son ocho exploits demostrados ni un certificado de seguridad. Revisar compatibilidad y remediación antes de una entrega productiva.

Herramientas de emulador también tienen dependencias históricas/deprecadas. Se fijó CLI para reproducibilidad; no publicarla como servicio de Internet. Revisar actualizaciones en tarea separada con pruebas. El build/test local no elimina la necesidad de revisión de seguridad del backend.

## Evidencia y reanudación

Cada ejecución nueva debe indicar commit/estado del árbol y entorno. En `00_CONTROL_FASE2.md` registrar última tarea, resultado real, fallo pendiente y próxima acción. No copiar contraseña, hash, token o clave a reportes. Estos ejemplos son datos ficticios; no guardar exportaciones de Firebase empresarial para probar.
