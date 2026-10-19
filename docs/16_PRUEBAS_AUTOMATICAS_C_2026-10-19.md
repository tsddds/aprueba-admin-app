# Pruebas automáticas de Felipe

Ejecutadas el 19/10/2026 a solicitud de Felipe. Código evaluado: 8cf0a5154c4cb2e61d970d38d316637c72a0b0b2, rama equipo-c/felipe-planes-metricas. La rama fue publicada y su referencia remota se comprobó antes de ejecutar las suites. Esta guía y la checklist manual se añaden después en un commit documental; no cambia el código probado.

## Resultado de esta ejecución

| Suite | Aprobadas | Fallidas | Alcance |
|---|---:|---:|---|
| Unitarias | 15 | 0 | Preparación, TOTP, paginación, importación y cálculos/validación C. |
| c-catalog | 7 | 0 | Permisos, creación, tipos, negativos, referencias, persistencia, campos internos y baja por suscripciones reales. |
| c-billing | 5 | 0 | Proveedor simulado, timeout, reintentos, concurrencia, rechazo de respuesta live y conciliación. |
| c-metrics | 7 | 0 | Roles, oráculo MAU/conversión/MRR, rangos, expiración, emisión y planificador sin consultas HTTP. |
| contract | 8 | 0 | Casos contractuales comunes conservados. |
| smoke | 7 | 0 | Inicio, cuatro roles, rutas protegidas, lecturas, persistencia y precio con proveedor simulado. |
| Total | 49 | 0 | 19 casos de integración C y 30 unitarios/regresión. |

Compilación frontend: aprobada, Vite terminó con código 0. Comprobación posterior: interfaz local HTTP 200 y API health ok. No se repitieron las suites completas A/B ni las operaciones de reinicio en esta intervención. Los 64 casos del 16/10 siguen siendo otro corte de evidencia; no sumar ambas ejecuciones como casos únicos.

## Entorno y reproducción

Docker Desktop local, proyecto Compose aprueba-finanzas. Desarrollo en demo-aprueba-equipo; suites secuenciales en demo-aprueba-tests. El runner restablece solamente la base de tests. No se borraron volúmenes ni se restablecieron los datos de desarrollo.

Desde la raíz del repositorio, en el computador de Felipe, que usa puertos alternativos:

```sh
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test npm test
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test node dev/run-tests.mjs c-catalog
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test node dev/run-tests.mjs c-billing
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test node dev/run-tests.mjs c-metrics
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test node dev/run-tests.mjs contract
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml --profile test run --rm test node dev/run-tests.mjs smoke
docker compose -p aprueba-finanzas -f compose.yaml -f compose.finance-check.yaml exec -T frontend npm run build
```

El override de puertos es un archivo LOCAL de esta instalación, no un requisito del repositorio publicado. En otra copia que use los puertos estándar, omitir ese override y usar el nombre de proyecto local correspondiente. No arrancar dos copias con el mismo proyecto/puertos.

Los logs de esta ejecución se conservaron en `.local/felipe-evidence/2026-10-19/`, separados de los del 16/10, con resumen y huellas en results.json. No se publican tokens, secretos ni exportaciones de datos.

## Qué sigue sin quedar acreditado

- Stripe sandbox real: **pendiente de cuenta/configuración y demostración en el proveedor**. El test HTTP usa un proveedor simulado local; no es un pago ni una consulta a Stripe real.
- Aceptación del proyecto completo, suites B completas, pentest, carga, históricos completos de métricas y revisión humana.
- Los pasos de la checklist manual no se marcan aprobados por estos resultados. Felipe debe realizarlos y registrar lo observado.

Aplicación dejada en ejecución para las pruebas manuales: http://localhost:15173. Visor local: http://127.0.0.1:14001/firestore. Checklist: [pruebas manuales](15_CHECKLIST_MANUAL_FELIPE.md).
