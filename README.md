# Evaluación de Ingreso SSOMA · U.M. Pallancata – Selene

Examen de ingreso por QR que **reemplaza la entrevista**: 40 preguntas para marcar, 50 minutos, aprobación con 75 %.

| Sección | Preguntas |
|---|---|
| PETS de la tarea del trabajador (según su código) | 15 |
| Normas internas, reglas de oro y tolerancia cero | 10 |
| Emergencias, reporte, peligro/riesgo y documentación | 10 |
| IPERC y derecho a negarse al trabajo inseguro | 5 |

## Páginas
- `index.html`: examen del trabajador (es la página a la que lleva el QR). Solo escribe su DNI y aparecen sus datos del Excel; rinde el examen, ve su nota y firma su constancia.
- `admin.html`: panel de la cuenta de Seguridad Industrial (correo y contraseña; sesión de 12 h). Permite crear jornadas cargando la plantilla Excel, mostrar el QR, ver resultados en vivo, exportar a Excel, imprimir constancias, habilitar reintentos y subir PETS propios.
- `index.html?c=CODIGO`: verificación pública de la constancia (es el QR impreso en cada constancia).

## Flujo semanal (lunes)
1. Gestión Humana llena `plantilla/Plantilla_Evaluacion_Ingreso.xlsx` (DNI, nombres, empresa, CIA/contratista, cargo y código PETS).
2. En `admin.html` → **Programar evaluación** → elegir el día → cargar el Excel → **Programar**. La evaluación se activa sola ese día (hora de Lima). Los exámenes no se guardan: cada uno se arma al iniciar, con una semilla por trabajador, a partir del banco fijo (1576 PETS, más de 370 preguntas generales y 68 propias de la unidad: tolerancia cero, reglas de oro, reglas internas, ADN, propósito y Central Z1, tomadas del Panel Informativo), así no se genera nada nuevo cada semana.
3. Proyectar o imprimir el **QR general**. Es fijo y siempre abre la jornada del día.
4. Al terminar, **Cerrar** la jornada, exportar el Excel e imprimir las constancias.

## Antiplagio
El examen se abre en pantalla completa y muestra una marca de agua con el nombre y el DNI. Se bloquean copiar, pegar, el clic derecho y el botón atrás. Cada salida (cambiar de app o pestaña, minimizar) queda registrada, y a la 3.ª el examen se envía solo. Las preguntas y las alternativas salen en distinto orden para cada persona. El tiempo se mide con el reloj del servidor y sigue corriendo aunque se recargue la página.

## Base de datos
Usa el mismo proyecto Supabase de las diapositivas (**OPT control**), solo con tablas `eval_` (ver `supabase/eval_schema.sql`). Las tablas `diapo_` no se modifican. El acceso es únicamente por funciones (RPC) protegidas por DNI o por la sesión de la cuenta de Seguridad Industrial (contraseña cifrada con bcrypt). Para no salir del plan gratuito:
- No se guarda ningún archivo en Storage.
- La firma se guarda como PNG pequeño (unos 10–20 KB).
- No usa Realtime: el panel consulta cada 20 s solo mientras está abierto.
- Un examen completo ocupa unos 15–30 KB, así que 50 trabajadores por semana suman unos 70 MB al año (el límite gratuito es 500 MB).

## Base normativa de los PETS
- **D.S. 024-2016-EM**: Arts. 98–99 (elaboración con participación de los trabajadores, difusión y verificación; ATS si la tarea no tiene PETS), **Anexo 10** (formato: 1. Personal · 2. EPP · 3. Equipos/herramientas/materiales · 4. Procedimiento · 5. Restricciones · Preparado por el supervisor del área, revisado por el gerente del área y el gerente de SSO, aprobado por el gerente de operaciones), Arts. 129–136 (trabajos de alto riesgo y PETAR).
- **Referencias internacionales**: el paso a paso sigue el Análisis de Riesgos de la Tarea de OSHA 3071 (paso → peligro → control), y los controles se ordenan según la jerarquía de la ISO 45001:2018 (8.1.2).
- En el panel, **Catálogo PETS → Ficha PETS** genera para cada tarea su ficha referencial en el formato del Anexo 10. El examen evalúa lo que dice esa ficha. La ficha no reemplaza el PETS oficial de la empresa.
