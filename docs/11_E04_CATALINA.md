# E04 — Listado de sponsors, preparado para primer commit

Fecha: 14 de octubre de 2026. Bloque B: Catalina; implementación con asistencia de Codex.

## Base y alcance

Rama personal local `equipo-b/e04-sponsors`, creada desde `equipo-a/backend-sprints` en `f31cec908a7b8d71d8204ce59bed03039477571f`. Conserva el historial remoto. No se modificaron las rutas de A/C ni se copió el middleware antiguo sobre los controles nuevos de A. No hay push ni PR.

- GET /admin/sponsors: solo admin; paginación por page o cursor, límite predeterminado 20 y máximo 100; validación de parámetros; sort ascendente/descendente con desempate por id; meta.pagination.
- Pantalla Sponsors consulta páginas sucesivas para mantener listado e indicadores completos.
- Suite b-sponsors y ampliación mínima del runner, conservando smoke/contract/a-sprint1/a-sprint2/a-ops.
- E05/E06/E07 no se consideran corregidos por este commit.

## Autenticación al recibir la base nueva

El contrato original incluye AUTH_REQUIRED y AUTH_TOKEN_EXPIRED en su catálogo general. Se conserva el middleware de A: token inválido o refresh presentado como acceso devuelve AUTH_REQUIRED; access token expirado devuelve AUTH_TOKEN_EXPIRED. La prueba B se ajustó a esa distinción. No se necesita un commit adicional que reemplace middleware/auth.js.

Esto corrige el criterio demasiado general del registro anterior, que agrupaba también la expiración como AUTH_REQUIRED. La base A ya incorpora validaciones de cuenta, estado, rol y firma; no se debilitaron para hacer pasar E04.

## Verificación sobre esta rama nueva

Compilación frontend confirmada después por captura de Catalina: `docker compose --profile ui run --rm --no-deps frontend npm run build` ejecutó Vite 5.4.21, transformó 49 módulos y terminó correctamente en 1.22 s. Antes se construyó correctamente la imagen con `docker compose --profile ui build frontend`. Son comprobaciones distintas; ambas están confirmadas. Las menciones inferiores a compilación pendiente son históricas. Falta revisión ajena y crear el primer commit local.

Confirmación posterior por capturas de Catalina: b-sponsors en Docker, 11/11 y cero fallos (12123.887643 ms); test:integration en Docker, 7/7 y cero fallos (7963.019001 ms). Se recuperó el emulador reconstruyendo firestore-test sin caché tras ERR_INVALID_PACKAGE_CONFIG en firebase-tools/package.json. Compilación frontend en Docker pendiente. Las referencias inferiores a repetir estas dos suites describen el estado anterior.

Ejecutado por el asistente fuera de Docker, con Node 24.19.0, Java 17 y Firestore Emulator 1.19.8, exclusivamente demo-aprueba-tests:

- b-sponsors: 11/11 aprobadas, incluidos 107 registros para paginación y validaciones.
- smoke: 7/7 aprobadas.
- a-sprint1: 8/8 aprobadas.
- a-sprint2: 7/7 aprobadas.
- Unitarias backend: 5/5; configuración Firestore: 2/2.
- Cargador frontend: 4/4 con `node --test frontend/test/sponsors.test.mjs`.
- Contrato común: 2/8 aprobadas (E04 y E14). Persisten seis fallos de otros endpoints: E02/E05/E20/E18/E27/E25. No se alteraron sus expectativas.
- Build frontend intentado: bloqueado por EPERM de realpath en el entorno del asistente; no se certifica compilación de esta combinación.
- Emulador temporal detenido al terminar.

La usuaria ya verificó 11/11 B y 7/7 smoke en Docker sobre la copia anterior a recibir A. Esas capturas no sustituyen la repetición sobre esta base nueva.

## Repetir en Docker antes del commit

Desde la raíz de esta carpeta nueva:

```powershell
docker compose --profile test run --build --rm test node dev/run-tests.mjs b-sponsors
docker compose --profile test run --rm test npm run test:integration
docker compose --profile ui build frontend
```

Esperado: 11 pruebas B, 7 smoke y build frontend aprobado. Los tests no publican puertos y usan la base de TESTS; no ejecutar suites de escritura simultáneas. El comando build no inicia frontend ni cambia el volumen de desarrollo. Para cambiar posteriormente la aplicación en ejecución desde la copia anterior, detener primero el entorno anterior: ambas copias comparten nombre de proyecto Compose. No borrar volúmenes.

## Primer commit propuesto

`fix(sponsors): restringir listado a admin y agregar paginacion`

Incluye rutas sponsors, suite B, runner, cargador/interfaz y pruebas frontend, y este registro. No incluir .env, dependencias, build, datos exportados, ZIP o documentos históricos de otras carpetas. La aceptación del equipo y el destino del futuro PR requieren coordinarse con A; no integrar main automáticamente.

## Límites

La paginación lee toda la colección en memoria; el cursor de desplazamiento no garantiza continuidad ante altas/bajas concurrentes. La interfaz también carga el conjunto completo para sus totales. Revisar escala antes de grandes volúmenes. Falta revisión de otro integrante y comprobación visual tras recibir esta base.
