# Recepción del incremento A

Publicación confirmada: 03/10/2026. Rama `equipo-a/backend-sprints`, commit de implementación `07f0f86ab14c43f40c2060de980c3f07d72b1b95`, derivado de la base compartida c0bd41f. Esta guía se añade en un commit documental posterior de la misma rama.

## Qué se publicó

Diez endpoints de A, helpers compartidos, tests, laboratorio Docker optativo, evidencias y seis Excel de seguimiento. No se reescribieron las rutas de B/C, ni se mezcló main ni se hizo despliegue manual. La configuración Vercel de frontend/backend deshabilita los despliegues Git para equipo-a/**; no se inspeccionó el panel remoto ni otros mecanismos de despliegue.

## Revisar sin sobrescribir trabajo propio

Primero abrir la rama en GitHub con la cuenta personal invitada al repositorio. Si aparece404, comprobar sesión y permisos; no hacer público el repositorio.

Para probarla en un directorio NUEVO, separado de la copia de trabajo de cada integrante:

```powershell
git clone --branch equipo-a/backend-sprints https://github.com/tsddds/aprueba-admin-app.git aprueba-revision-a
cd aprueba-revision-a
git log -2 --oneline
```

No ejecutar el clone sobre una carpeta existente. No hacer reset, checkout forzado ni sustituir archivos de la rama de Catalina/Felipe. Si se usa una copia existente, guardar primero el trabajo propio y acordar cómo incorporar la rama.

Antes de arrancar Docker, detener de forma normal el entorno Aprueba anterior si ya está usando los mismos puertos. Las copias usan el mismo nombre de proyecto Compose; no arrancarlas simultáneamente ni asumir que sus volúmenes están separados. No usar down -v. Seguir guía09 para arranque, cuentas demo, pruebas secuenciales y apagado del bridge privilegiado.

## Orden de revisión

1. Leer control00, reparto01, plan08 y guía09.
2. Felipe revisa A: autenticación, JWT, errores compartidos, validación, transacciones/auditoría y restricciones del laboratorio. Catalina revisa con A la compatibilidad de datos de usuarios/medallas para recorrecciones.
3. Reproducir pruebas A y revisar suite contractual común. Últimas evidencias son del29/09: A23/23, unit5/5, smoke7/7 en dos configuraciones, contrato1/8 con siete fallos B/C. No representan revisión de las ramas actuales de compañeros.
4. Comunicar observaciones con archivo, caso, resultado observado y esperado. No borrar tests que revelan incumplimientos.
5. Acordar integración mediante revisión, sin copiar todo sobre ramas propias ni mezclar directamente en main. No se ha abierto PR automáticamente.

E09 tiene una sonda HTTP real de laboratorio: faltan destinos autorizados de servicios de negocio. Aún faltan revisión/aceptación, recepción en segundo equipo, integración B/C y controles previos a producción. Las planillas son del corte29/09 y sus celdas de publicación pendiente quedan superadas por esta guía; no se inventan revisiones ni fechas de pruebas.
