# Recibir la base y empezar Sprint 1

23 de septiembre de 2026. Rama de base: `codex/base-fase2-equipo`. Repositorio: https://github.com/tsddds/aprueba-admin-app . No usar el repositorio académico. Esta entrega prepara el trabajo; no certifica MVP ni Docker funcionando.

## 1. Accesos y descarga

El propietario debe invitar a los dos compañeros como colaboradores del repositorio privado si todavía no tienen acceso. Cada uno usa su propia cuenta GitHub. No compartir contraseñas, JSON Firebase, JWT de Vercel ni tokens. El emulador no necesita acceso a Firebase real.

Quien NO tenga copia ejecuta, en una carpeta donde quiera guardar el proyecto:

```sh
git clone --branch codex/base-fase2-equipo https://github.com/tsddds/aprueba-admin-app.git
cd aprueba-admin-app
git status
git log -1 --oneline
```

Quien YA tenga copia revisa `git status`. Si hay cambios, guardarlos en su rama antes de cambiar; no usar reset --hard. Con copia limpia y sin rama local de base:

```sh
git fetch origin
git switch --track origin/codex/base-fase2-equipo
```

Si ya existe esa rama local, usar `git switch codex/base-fase2-equipo` y `git pull --ff-only`. No copiar carpetas node_modules ni la base exportada entre computadores.

## 2. Primera prueba de recepción, todavía pendiente

Instalar/abrir Docker Desktop con motor Linux, Git y VS Code. La copia preparada se verificó con emulador fuera de Docker; aquí no había motor Docker. No prometer que el primer build ya fue probado.

Desde la raíz donde está compose.yaml:

```sh
docker version
docker compose version
docker compose config --quiet
docker compose --profile ui up --build -d
docker compose ps -a
docker compose logs --tail=60 seed backend
```

Esperado: seed Exit 0, backend saludable. Abrir frontend http://localhost:5173 y visor http://127.0.0.1:4001/firestore. Health http://localhost:4000/health no prueba por sí solo la base. Usar cuentas SOLO locales del README y guía 06 para demostrar escritura y lectura. No abrir Vercel mientras se prueba local.

```sh
docker compose run --rm --no-deps backend npm test
docker compose --profile test run --build --rm test
```

Resultado previo fuera de Docker: tres unitarias y siete smoke aprobadas. Ocho casos contractuales conocidos fallan; son backlog explícito, no borrarlos ni declarar endpoints aceptados por eso. Probar recarga del código y conservación de cambios de datos después de `docker compose stop` y nuevo `up`; no usar `down -v`, que elimina el volumen.

No es necesario correr Docker para leer contratos/escribir código. Para ejecutar sin Docker hace falta preparar Node y Java/emulador con las mismas guardias; no improvisar ejecución contra Firebase real. Si el arranque falla, compartir error sin secretos y conservar el avance.

## 3. Primera rama y tarea de cada integrante

Todos parten del mismo commit de base, pero cada uno crea SOLO su rama:

- Tsung-Hao: `git switch -c equipo-a/e01-acceso`. S1-A1: E01 login, validaciones, errores y tokens; estudiar MFA opcional sin usar un código fijo como solución real. Después E12/E13. Módulos auth.js/users.js.
- Catalina: `git switch -c equipo-b/e04-sponsors`. S1-B1: E04 listar sponsors y permitir solo admin. Después E05 crear, E06 actualizar y E07 baja. Módulo sponsors.js.
- Felipe: `git switch -c equipo-c/e23-e24-catalogo`. S1-C1: E23 funcionalidades y E24 planes. Después E25 creación/validaciones, incluido precio negativo. Módulo plans.js.

Ver rutas y criterios exactos en endpoints.json y guía 02. Leer sección 4 del contrato original por el canal privado del equipo; no publicar Word internos. No implementar operaciones del alumno, cambiar a FastAPI ni asumir que todas las rutas existentes ya cumplen.

Una tarea pequeña por rama, pruebas propias y revisión circular: Felipe revisa A, Tsung-Hao revisa B, Catalina revisa C. Helpers compartidos, fixtures y lockfiles requieren avisar y acordar un cambio común para evitar conflictos.

## 4. Compartir cambios sin tocar el despliegue

Después de probar: `git status`, `git diff`, añadir solo rutas de su tarea, commit descriptivo y `git push -u origin HEAD`. No subir .env, secretos, node_modules, logs o exportaciones.

Mientras la base no esté integrada en main, abrir PR de la tarea con destino `codex/base-fase2-equipo`, no main. No hacer merge automático ni force-push. Un revisor reproduce pruebas antes de integrar; los otros incorporan la base actualizada sin sobrescribir trabajo propio.

backend/vercel.json y frontend/vercel.json desactivan despliegues Git automáticos para la base y `equipo-a/**`, `equipo-b/**`, `equipo-c/**`. Se conservan rewrites del frontend y no se cambia main. Ramas con otros nombres NO están cubiertas; deploy manual/CLI o workflows independientes tampoco quedan bloqueados por esta configuración. No pulsar Deploy ni cambiar variables de Vercel para el trabajo local.

Fuente: https://vercel.com/docs/project-configuration/git-configuration . Es configuración preventiva, no evidencia de haber inspeccionado el panel remoto de Vercel.

## 5. Compromiso del Sprint 1 e hitos

Antes de comprometer trabajo, reunión breve de los tres: confirmar reparto, fechas reales/capacidad y un responsable de validar Docker. Objetivo propuesto: acceso revisado + sponsors completo; catálogo/consultas adicionales según capacidad. No declarar que esto ya fue aprobado como MVP por Karina.

- Hito 1: 28 septiembre–03 octubre, MVP con base operativa. Confirmar funcionalidades mínimas y modalidad local/remota. Datos locales no se sincronizan con Firebase.
- Hito 2: 26–31 octubre, todo el proyecto en Docker. No bloquear programación esperando este hito.
- Entrega documentada: Duoc 16–28 noviembre; Utem 30 noviembre–04 diciembre. Usar la institución correspondiente, aún no elegida en esta guía.

Cerrar una tarea requiere entrada/salida contractuales, persistencia, permisos/validaciones, pruebas y revisión ajena. Registrar en control fecha, rama/commit, resultado real y próxima acción. Los 27 endpoints siguen alcance final, no obligación inventada para Hito 1.

## 6. Qué falta realmente

Recepción Docker en al menos un equipo y después otro, invitaciones/aceptación de colaboradores, compromiso de Sprint 1 y confirmación de MVP. Cuenta Stripe test y recursos reales autorizados de operación siguen pendientes de sus módulos, no bloquean sponsors/catálogo. Carga de datos cloud y despliegue son tareas separadas: este paquete no los realiza.
