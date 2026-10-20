# Bloque B de Catalina: trabajo y pruebas

Registro: 20/10/2026. Responsable: Catalina Yanara Padilla Astudillo.
Rama consolidada: equipo-b/catalina-sponsors-preguntas.
Base de código revisada: 93c80965ff4e3f934c656c3af260b4b0e4f1c736, ya publicada en equipo-a/backend-sprints.

## Trabajo realizado

El bloque B comprende diez endpoints:

| Área | Endpoints | Comportamiento implementado |
| --- | --- | --- |
| Sponsors | E04, E05, E06, E07 | Listar, crear, editar y dar de baja; validaciones, permisos de administrador, beneficios e historial. |
| Preguntas | E19, E20, E21, E22 | Listado con filtros y paginación; creación, edición e importación JSON; errores por fila y duplicados. |
| Recorrecciones | E17, E18 | Cola con alumno y pregunta vinculados; confirmación o rechazo transaccional, premio único de 250 bronce y aviso in-app persistido. |

También se conservaron las explicaciones estructuradas acordadas con Martín, la compatibilidad con texto, las preguntas de Biología b1 y los borradores importados con clasificación pendiente. Se ajustaron las cuentas demo del login y la navegación según rol.

La rama reúne el trabajo existente sin reescribir commits anteriores. No incorpora por sí sola los cambios posteriores de Felipe en la rama C. No representa una integración a main ni un despliegue.

## Entorno y alcance de la evidencia

Las comprobaciones manuales fueron realizadas por Catalina en la app local, con acompañamiento del asistente y capturas compartidas en la conversación. Las pruebas automáticas finales fueron ejecutadas por Catalina en PowerShell/Docker; este informe transcribe los resultados mostrados, no una nueva ejecución hecha al redactarlo.

- Interfaz local: http://localhost:5173.
- Desarrollo: Firestore Emulator, proyecto demo-aprueba-equipo, con datos ficticios persistentes.
- Pruebas automáticas: proyecto separado demo-aprueba-tests, restablecido por el runner antes de cada suite.
- Sin pruebas contra datos reales ni contra el despliegue publicado.
- Las capturas y la salida completa no se adjuntan a este commit: la evidencia compartida se encuentra en la conversación de revisión.

## Pruebas automáticas de cierre

| Ejecución | Resultado observado | Alcance |
| --- | --- | --- |
| b-corrections-resolve | 13 aprobadas, 0 fallidas | Confirmar/rechazar, permisos, validaciones, referencias, notificación, movimiento, premio único, concurrencia y rollback. |
| b-sponsors-delete | 10 aprobadas, 0 fallidas | Baja lógica, desactivación de beneficios, historial, repetición, concurrencia y permisos. |
| Regresión secuencial de ocho suites B y smoke | El bloque llegó a smoke sin detenerse; smoke mostró 7 aprobadas y 0 fallidas | La aprobación de las ocho suites anteriores se infiere del bloque con detención al primer fallo ejecutado por Catalina. No se conserva aquí el log individual completo. |
| Compilación frontend en Docker | Vite: 52 módulos transformados; built in 1.20s | Compilación de producción correcta; no sustituye las comprobaciones manuales. |

El texto [error] Error de la suite E18 corresponde al fallo de persistencia provocado deliberadamente para verificar rollback. La prueba terminó aprobada y el resumen fue 13/13.

Comandos reproducibles desde la raíz del repositorio:

~~~powershell
docker compose --profile test run --rm test node dev/run-tests.mjs b-corrections-resolve
docker compose --profile test run --rm test node dev/run-tests.mjs b-sponsors-delete

$suites = @(
  'b-sponsors',
  'b-sponsors-create',
  'b-sponsors-update',
  'b-questions-list',
  'b-questions-create',
  'b-questions-update',
  'b-questions-import',
  'b-corrections-list',
  'smoke'
)
foreach ($suite in $suites) {
  docker compose --profile test run --rm test node dev/run-tests.mjs $suite
  if ($LASTEXITCODE -ne 0) { throw "Falló la suite: $suite" }
}
docker compose --profile ui run --rm --no-deps frontend npm run build
~~~

No se repitió el contrato global ni la aceptación de otros bloques en esta ronda. Los defectos históricos de C no se presentan como estado vigente de su rama: Felipe publicó cambios posteriores que requieren su propia revisión.

## Checklist manual realizada

| Caso | Resultado observado |
| --- | --- |
| E04: listado de sponsors | Tabla e indicadores visibles para admin. |
| E05: crear sponsor con beneficio | Sponsor Silver, aporte 1500, un beneficio; total 3 sponsors y 4500/mes. |
| E06: editar nombre, aporte y estado | Nombre actualizado, aporte 2000 y Degradado; conservó un beneficio; total 5000/mes. |
| E06: aporte negativo | Mensaje de validación; al cancelar y reabrir permaneció 2000. |
| E07: baja del sponsor de prueba | Desapareció del listado; 2 sponsors, 3000/mes y 2 beneficios cobrados. La desactivación interna se cubrió además con la suite de baja. |
| E04: Finanzas por enlace directo | Sponsors oculto del menú; vista denegada sin datos. |
| E19: filtros combinados | M1+Borrador sin coincidencias; M2+Borrador mostró solo la pregunta de 2 al cuadrado; limpiar restauró el listado. |
| E20: crear pregunta con dos alternativas | Guardada como Borrador, prueba m1, dificultad D1 y respuesta B; total 4 preguntas. |
| E20: código de prueba en mayúsculas | M1 fue rechazado; con m1 se pudo guardar, conforme al código de prueba aceptado por el backend. |
| E21: explicación estructurada | Se guardaron y recuperaron título, materia, pasos, verificación y concepto clave. |
| E21: respuesta E sin texto | Rechazada; al cancelar y reabrir permaneció B y la explicación estructurada. |
| E22: lote mixto de tres filas | 1 importada, 1 omitida por duplicado y 1 error INVALID_CORRECT_ANSWER en fila 3. |
| E22: reintentar el mismo lote | 0 importadas, 2 omitidas y 1 error; se observó una sola pregunta válida en el listado. |
| E22: clasificación pendiente | Importó sin eje/dificultad como Borrador; publicar sin eje o sin dificultad fue rechazado; con Números+D1 se publicó. |
| E22: explicación estructurada importada | Los cinco campos y el paso se conservaron; respuesta A. |
| E21: editar otro campo | Cambiar habilidad a Restar números naturales conservó la explicación estructurada completa. |
| E22: seleccionar archivo .json | Leyó el archivo con testId=m1; 1 importada, 0 omitidas, 0 errores. |
| E22: archivo m1 y destino m2 | Rechazó la diferencia de destino; la pregunta siguió en m1. |
| E17: cola pendiente | Mostró alumno ficticio 01 y pregunta qst_demo_02 vinculados; una pendiente. |
| E18: confirmar y corregir respuesta | Pendientes pasó a 0; pregunta de 3+4 cambió de C a D, manteniendo su estado Marcada. |
| E18: premio de confirmación | Medallas de bronce pasaron de 10 a 260; badges permaneció en 10. |
| E18: solicitudes resueltas | Dos solicitudes Confirmadas con Resolver deshabilitado. Una ya estaba confirmada en la semilla; no se interpretó como premio duplicado. |
| E17: rol Soporte | Accedió a la cola con referencias. |
| E19: restricción de Soporte | Acceso directo a Contenido denegado sin exponer el banco de preguntas. |

El rechazo sin premio, el aviso almacenado, los conflictos HTTP 409 y la concurrencia fueron comprobados por tests automáticos. No se atribuye a la interfaz una segunda ejecución manual de esos casos. El aviso se persiste para el alumno; esta revisión no acredita su lectura en una aplicación de alumnos.

## Consolidación de ramas y siguiente paso

Las diez ramas originales del bloque B están incluidas en la base 93c8096 de esta rama: e04-sponsors, e05-crear-sponsors, e06-editar-sponsors, e07-baja-sponsors, e19-listar-preguntas, e20-crear-preguntas, e21-editar-preguntas, e22-importar-preguntas, e17-listar-recorrecciones y e18-resolver-recorrecciones.

Las ramas e18 y e22 contienen las dos líneas finales de trabajo; su integración está preservada en 93c8096, junto con las ramas anteriores. La nueva rama mantiene la base A compartida y el historial del bloque B; no duplica commits ni cambia sus autores.

Antes de limpiar las ramas anteriores: publicar este registro con mensaje de commit confirmado por Catalina, comprobar la rama consolidada en GitHub y volver a verificar que no haya commits exclusivos nuevos en las ramas antiguas. Los PR borradores anteriores son historial de revisión, no una indicación de que falte su código en esta rama. Revisar su estado antes de borrar sus ramas base o de origen.

Conservar main, la rama A y la rama C. No modificar estas ramas durante la organización de B.
