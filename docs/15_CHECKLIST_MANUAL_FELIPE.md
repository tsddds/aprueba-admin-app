# Pruebas manuales del bloque C de Felipe

Preparada el 19/10/2026 para la rama equipo-c/felipe-planes-metricas. Marcar las casillas solo después de realizar el paso. Esta checklist no declara aprobadas pruebas manuales que el estudiante aún no ha ejecutado.

## Preparación

- [ ] Abrir la aplicación LOCAL. En el computador de Felipe: http://localhost:15173. No usar la URL Vercel para este ejercicio.
- [ ] Abrir el visor de datos local en otra pestaña: http://127.0.0.1:14001/firestore. Proyecto demo-aprueba-equipo, base default.
- [ ] Iniciar sesión con admin@example.test, contraseña pública exclusiva del emulador SoloEmulador_2026_Prueba!, MFA vacío.
- [ ] Confirmar que el pie del menú indica Gerencia. Preparar una nota con fecha, caso, esperado, observado y resultado.

Los tests automáticos usan demo-aprueba-tests y no restablecen tu base de desarrollo. Los datos de desarrollo pueden conservar cambios de sesiones anteriores. No borrar volúmenes ni reiniciar la base para forzar valores esperados.

## Catálogo y planes E23-E25

- [ ] Abrir Planes y productos. Deben verse nombres de funcionalidades, planes, precios y límites, sin pantalla en blanco ni nombres undefined.
- [ ] Pulsar Nuevo plan e intentar crear uno sin nombre. Debe mostrar un error y no aparecer ningún plan nuevo.
- [ ] Crear un plan llamado Prueba manual Felipe 19-10, con precio 0 y un color reconocible. Debe aparecer como gratuito. Anotar su ID.
- [ ] Recargar el navegador. El plan debe seguir presente, con el mismo nombre, precio y color.
- [ ] Intentar crear otro plan con nombre Prueba negativa Felipe y precio -1. Debe rechazarse sin guardar el registro. Revisar el listado tras recargar.
- [ ] Arrastrar una funcionalidad al plan de prueba, guardar en su tarjeta y recargar. Debe permanecer asignada, con nombre visible.
- [ ] Intentar arrastrar la misma funcionalidad otra vez. No debe duplicarse.
- [ ] Quitar esa funcionalidad, guardar y recargar. No debe reaparecer.

## Edición y límites E26

- [ ] En el plan que tú creaste, cambiar el nombre a Prueba manual Felipe editada y cambiar el color, conservando precio 0. Guardar y recargar: ambos cambios deben persistir.
- [ ] Configurar preguntas/día 20, grupos 2 y pruebas 1. Guardar en la tarjeta y recargar: deben conservarse los tres valores.
- [ ] Poner uno de esos límites en 0. Guardar y recargar: debe conservarse el cero, cuyo significado es ilimitado. Los otros límites deben conservar sus valores.
- [ ] Cambiar un valor de badges por acción del plan de prueba, guardar y recargar. Debe persistir. No implica otorgar medallas a un alumno.
- [ ] Hacer un cambio en el plan de prueba y pulsar Guardar cambios global. Debe persistir tras recargar. Este botón guarda todas las tarjetas: comprobar antes que no hay cambios accidentales en otros planes.
- [ ] En el visor, localizar plans/{ID de tu plan}. Los campos deben coincidir con la interfaz.
- [ ] Revisar adminAudit filtrando por entityId del plan. Debe haber registros de creación y cambios efectivos con autor/fecha. Guardar una captura sin tokens.

## Precio sin Stripe configurado E26

Este caso se puede probar AHORA. El bloqueo es el resultado correcto mientras no exista la cuenta/configuración de Stripe test.

- [ ] En tu plan de prueba de precio 0, intentar cambiar el precio a 500. Debe aparecer un error que indica que Stripe de pruebas no está configurado; no debe anunciar que se guardó correctamente.
- [ ] Cancelar el diálogo y recargar. El precio debe seguir en 0. En Firestore también debe conservarse el anterior.
- [ ] Confirmar que después del error todavía puedes editar el nombre o los límites conservando el precio original.

No marcar Stripe como aceptado por pasar este caso. El éxito real con proveedor está en la sección final, pendiente de cuenta/configuración.

## Eliminación E27

- [ ] Intentar eliminar un plan con suscripción vigente. En los fixtures, uni (Una prueba ficticia) y all (Todas ficticio) tienen suscripciones; confirmar primero que sigan vigentes en subscriptions. Debe bloquearse con un mensaje de suscriptores y el plan debe permanecer tras recargar.
- [ ] Comprobar en el visor que el bloqueo corresponde a una suscripción cuyo campo plan es ese ID y estado active, con fin de período futuro. No basta con que un alumno tenga users.state=active.
- [ ] Eliminar únicamente el plan de prueba que creaste en esta checklist. Debe desaparecer y seguir ausente tras recargar; suscripciones y otros planes deben conservarse.

Los casos de inexistente/404, expiradas/canceladas, suscripción sin vencimiento y código PLAN_HAS_SUBSCRIBERS están cubiertos automáticamente. No hace falta alterar manualmente suscripciones compartidas para reproducirlos ahora.

## Resumen y Comercial E02-E03

- [ ] Como Gerencia, abrir Resumen. Debe cargar sus indicadores y serie mensual sin errores.
- [ ] Abrir Comercial. MAU, convertidos, conversión y MRR deben coincidir con Resumen para el mismo corte de cálculo. Si acaba de vencer la caché, volver a cargar ambas vistas antes de comparar.
- [ ] Verificar que conversión usa convertidos / MAU x 100, no todos los alumnos registrados; si MAU es cero, debe dar cero y nunca NaN/Infinity.
- [ ] Comprobar MRR con las suscripciones activas: suma mensual de sus importes, normalizando anuales; usa importe propio de suscripción si existe, catálogo como fallback legado. Excluir vencidas/canceladas. No confundir MRR con pagos cobrados.
- [ ] Dejar Comercial abierto durante al menos el intervalo dashboardPollSeconds de appConfig/metrics (60 segundos por defecto). No debe perder la sesión ni producir un error al actualizar. En la pestaña Red del navegador, si la usas, deben repetirse consultas a metrics/commercial sin pedir metrics/overview para finanzas.
- [ ] En el visor, revisar metrics/commercial y metrics/overview: generatedAt y source=calculated_from_records. Para verificar actualización sin clics, esperar metricsRefreshSeconds (300 por defecto) y volver a leer el documento en el visor; generatedAt debe avanzar mientras la API siga en ejecución.

No exigir hoy MAU=4 o MRR=8000 de manera ciega: fueron ejemplos del conjunto inicial. La actividad cambia con el paso de los días y los datos persistentes pueden haber sido editados. Los tests automáticos generan fixtures nuevos y sí usan un oráculo controlado.

Sin movimientos de emisión, badges emitidos puede ser cero aunque haya saldos en alumnos. Sin historia suficiente, comparaciones anteriores MAU/MRR son null y no se muestra un porcentaje inventado. Sin observaciones operativas, salud puede ser unknown; no equivale a fallo del cálculo.

## Permisos y sesión

- [ ] Cerrar sesión e ingresar con finance@example.test y la misma contraseña local, MFA vacío. Debe mostrar Finanzas e iniciar en Comercial.
- [ ] En Finanzas, comprobar que NO aparecen Planes y productos, Sponsors ni Resumen en el menú.
- [ ] Como Finanzas, abrir directamente http://localhost:15173/planes y luego /sponsors. Ambas vistas deben indicar permisos insuficientes.
- [ ] Como Finanzas, abrir la raíz /. Debe redirigir a Comercial y cargar los indicadores, sin acceso al resumen ejecutivo reservado a admin.
- [ ] Como support@example.test, intentar abrir /planes y /comercial. Debe impedir ambas vistas.
- [ ] Como ops@example.test, repetir /planes y /comercial. Debe impedir ambas vistas.
- [ ] Cerrar sesión y recargar. Debe mostrarse el ingreso, no datos administrativos conservados en pantalla.

## Stripe real de pruebas pendiente

No ejecutar hasta disponer de cuenta sandbox y configuración privada. No pegar claves en esta checklist, capturas, Notion ni GitHub. No se necesitan cobros reales ni tarjetas para comprobar la creación de un precio de prueba.

- [ ] Configurar una clave privada test en el entorno local siguiendo la guía 12; nunca una clave live.
- [ ] Crear un plan descartable y cambiar su precio. Debe guardar únicamente después de completar la sincronización.
- [ ] Comprobar en el panel Stripe de pruebas el nuevo precio mensual, producto, importe CLP correcto y vínculo con el plan.
- [ ] Repetir el mismo envío y confirmar que no aparecen productos/precios duplicados para la misma operación.
- [ ] Con un fallo controlado del proveedor, comprobar que no se anuncia éxito y el precio local anterior se conserva.
- [ ] Recuperar y reintentar el mismo cambio según guía 12; confirmar estado completed y auditoría. No borrar operaciones pendientes para forzar el resultado.

## Registro final

- [ ] Marcar cada caso como aprobado, fallido o pendiente; explicar cualquier diferencia observada.
- [ ] Guardar capturas de persistencia, validación, permisos y bloqueo de eliminación. No incluir tokens o secretos.
- [ ] Compartir los resultados con Catalina para revisión de C; mantener Stripe real como pendiente hasta demostrarlo.

Formato de nota recomendado: caso | acción | esperado | observado | aprobado/fallido/pendiente | evidencia. Las pruebas automáticas y sus resultados se registran por separado en la guía 16.
