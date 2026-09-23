# Guía práctica: desde esta base hasta el primer cambio

Estado del 23 de septiembre de 2026: publicación solicitada en rama codex/base-fase2-equipo, sin integrar main. Consultar primero guía 07, que permite recibir y trabajar desde esa rama. Esta guía no registra recepción ni trabajo individual ya realizado.

## 1. Recibir y verificar la base

Antes de repartir ramas, verificar Docker en un computador del equipo. Instalar Git, VS Code y Docker Desktop con contenedores Linux si todavía no están disponibles. Docker Desktop puede requerir WSL 2, virtualización y reinicio; seguir su instalador, sin modificar BIOS o seguridad sin entender el cambio. Linux puede usar Docker Engine con Compose v2.

En la copia preparada, seguir «Primer arranque» y «Pruebas preparadas» del README. No copiar archivos desde la carpeta original antigua ni ejecutar su seed. El entorno preparado no requiere JSON de Firebase, JWT de Vercel o acceso a la base en la nube.

Recepción mínima: motor disponible, Compose válido, imágenes construidas, seed con salida 0, API saludable, login y lectura con datos, visor en puerto 4001 accesible, tres unitarias y siete smoke verdes. Las ocho pruebas contractuales inicialmente fallan por tareas de implementación identificadas; no son motivo para ocultar esos tests. Guía 06 explica cómo observar cambios en la base local.

Comprobar también que editar un archivo provoca recarga y que un cambio de datos se conserva tras stop/up. Apagar normalmente para permitir exportación del emulador. La comprobación de persistencia no se sustituye por volver a cargar todos los fixtures.

## 2. Compartir una sola base por GitHub

Repositorio de código previsto: https://github.com/tsddds/aprueba-admin-app . No es el repositorio académico de evidencias.

Pendiente por el propietario: invitar a los dos compañeros como colaboradores del repositorio privado. No compartir contraseña de GitHub ni cuenta de Google. Para desarrollar con este emulador no necesitan acceso a tu Firebase remoto. Accesos a servicios compartidos se conceden por separado cuando sean necesarios.

Tras revisar y autorizar la publicación: revisar diff y archivos nuevos, crear commit del paquete, publicar rama `codex/base-fase2-equipo`, revisar PR e integrar una base común. No ejecutar `git add .` desde la raíz académica; esta copia es un worktree propio. Excluir .env, JSON privados, .local, node_modules, logs y datos exportados. No publicar los Word internos.

Para recepción anticipada usar guía 07 y comprobar rama remota. Un merge a main puede activar despliegues de Vercel según su configuración; revisar antes y no asumir que es una operación solo documental. No se requiere tocar variables del despliegue para usar este entorno aislado.

## 3. Cada integrante obtiene la base integrada

Estos comandos de main se reservan para DESPUÉS de integrar el paquete. Mientras tanto, usar los comandos de rama de guía 07; no es necesario esperar el merge para empezar:

```sh
git clone https://github.com/tsddds/aprueba-admin-app.git
cd aprueba-admin-app
git status
```

Quien ya tenga una copia revisa primero `git status`. Si hay trabajo sin guardar, conservarlo en su rama/commit antes de cambiar de rama. Con árbol limpio:

```sh
git switch main
git pull --ff-only
```

No usar reset --hard para ponerse al día. Verificar que existen compose.yaml y docs/00_CONTROL_FASE2.md. Ejecutar el README; repetir la recepción en al menos un segundo computador.

## 4. Primera tarea de cada persona

- Tsung-Hao: S1-A1 / E01, acceso y errores, con pruebas. Después E12/E13.
- Catalina: S1-B1 / E04, permisos y lista de sponsors. Después E05/E06/E07 para completar el flujo.
- Felipe: S1-C1 / E23–E24, catálogo y lectura de planes. Después E25 y casos numéricos de métricas.

No deben implementar todo su bloque de diez/siete endpoints antes de integrar. Una tarea pequeña por rama permite revisar y detectar diferencias temprano. Planificar fechas reales con la Carta Gantt y disponibilidad; los cinco sprints aquí son secuencia de trabajo, no actividades ya realizadas.

Ejemplo SOLO para la primera tarea de A:

```sh
git switch -c equipo-a/e01-acceso
```

B y C crean ramas distintas con su tarea, desde la misma base compartida (guía 07), o desde main cuando el paquete esté integrado. Editan en VS Code, no dentro de una sesión interactiva del contenedor. Docker ejecuta el código montado y contiene dependencias.

## 5. Programar, probar y revisar

1. Leer el endpoint original y su entrada del catálogo. Identificar archivo responsable y criterios.
2. Registrar EN_PROCESO en el control, sin sobrescribir avances de otros.
3. Escribir prueba, reproducir el fallo y corregir lógica. Añadir los tests nuevos al runner coordinadamente para que se ejecuten.
4. Correr unitarias, smoke y pruebas del módulo. Examinar cambios con `git diff` y `git status`.
5. Guardar solo archivos propios de la tarea, por rutas explícitas. El commit describe lo que cambió, no «todo listo».
6. Publicar su rama y abrir PR cuando esté revisable; adjuntar pruebas y pendientes, no tokens/capturas con secretos.
7. Revisión circular: Felipe revisa a Tsung-Hao; Tsung-Hao a Catalina; Catalina a Felipe. Seguridad/transacciones/reinicio: también tercer revisor.
8. Integrar tras revisión; los demás actualizan main con árbol limpio y crean la siguiente rama. Una rama ya abierta se actualiza de forma coordinada, sin forzar historial compartido.

Para evitar conflictos: cada uno mantiene sus archivos de rutas; helpers, fixtures, Compose y lockfiles se cambian mediante una tarea separada anunciada. No renombrar campos que leen los otros sin actualizar consumidores y pruebas.

## 6. Qué registrar para continuar después

En docs/00_CONTROL_FASE2.md: tarea, responsable, rama/commit, archivos, comando de prueba, resultado real, fallo pendiente y próxima acción. Las evidencias del sprint se registran cuando ocurren; no reconstruir retrospectivamente aportes individuales inventados.

Al volver con el asistente: «Lee MEMORIA_PROYECTO_APRUEBA_ADMINISTRACION.md y el control de Fase 2. Revisa los cambios desde el último punto y continúa la próxima tarea autorizada». Si un compañero cambió el repo, informar rama/PR; el asistente no observa automáticamente trabajo ajeno.

## Pendientes posteriores, no bloqueos para comenzar CRUD

- Cuenta y clave privada de Stripe de pruebas para validar E26.
- Recursos de desarrollo autorizados para monitorizar y reiniciar realmente en E09–E11; no son los contenedores internos de Vercel ni se resuelve exponiendo docker.sock.
- Mecanismo de actualización de métricas compatible con alojamiento; los valores 300/60 segundos están en datos, todavía no hay ejecución periódica implementada.
- Pruebas completas, revisión de dependencias y aceptación real de los 27 endpoints. Tener hosting/login no sustituye esas tareas.
