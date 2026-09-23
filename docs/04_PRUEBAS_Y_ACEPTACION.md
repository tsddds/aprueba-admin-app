# Pruebas y aceptación del backend

Fecha de preparación: 23 de septiembre de 2026. Este archivo distingue pruebas realmente ejecutadas, defectos observados y escenarios pendientes. No certifica API completa ni seguridad de producción.

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
