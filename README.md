# Evaluación de Ingreso SSOMA · U.M. Pallancata – Selene

Examen de ingreso por QR que **reemplaza la entrevista**: 40 preguntas para marcar, 50 minutos, aprobación con 75 %.

| Sección | Preguntas |
|---|---|
| PETS de la tarea del trabajador (según su código) | 15 |
| Normas internas, reglas de oro y tolerancia cero | 10 |
| Emergencias, reporte, peligro/riesgo y documentación | 10 |
| IPERC y derecho a negarse al trabajo inseguro | 5 |

## Páginas
- `index.html`: examen del trabajador (es la página a la que lleva el QR). Busca su nombre, confirma con su DNI, rinde el examen, ve su nota y firma su constancia.
- `admin.html`: panel de Seguridad (PIN). Permite crear jornadas cargando la plantilla Excel, mostrar el QR, ver resultados en vivo, exportar a Excel, imprimir constancias, habilitar reintentos y subir PETS propios.
- `index.html?c=CODIGO`: verificación pública de la constancia (es el QR impreso en cada constancia).

## Flujo semanal (lunes)
1. Gestión Humana llena `plantilla/Plantilla_Evaluacion_Ingreso.xlsx` (DNI, nombres, empresa, CIA/contratista, cargo y código PETS).
2. En `admin.html` → **Nueva jornada** → cargar el Excel → **Crear**. Los exámenes no se guardan: cada uno se arma al iniciar, con una semilla por trabajador, a partir del banco fijo (1040 PETS y más de 370 preguntas), así no se genera nada nuevo cada semana.
3. Proyectar o imprimir el **QR general**. Es fijo y siempre abre la jornada del día.
4. Al terminar, **Cerrar** la jornada, exportar el Excel e imprimir las constancias.

## Antiplagio
El examen se abre en pantalla completa y muestra una marca de agua con el nombre y el DNI. Se bloquean copiar, pegar, el clic derecho y el botón atrás. Cada salida (cambiar de app o pestaña, minimizar) queda registrada, y a la 3.ª el examen se envía solo. Las preguntas y las alternativas salen en distinto orden para cada persona. El tiempo se mide con el reloj del servidor y sigue corriendo aunque se recargue la página.

## Base de datos
Usa el mismo proyecto Supabase de las diapositivas (**OPT control**), solo con tablas `eval_` (ver `supabase/eval_schema.sql`). Las tablas `diapo_` no se modifican. El acceso es únicamente por funciones (RPC) protegidas por DNI o por PIN de administrador. Para no salir del plan gratuito:
- No se guarda ningún archivo en Storage.
- La firma se guarda como PNG pequeño (unos 10–20 KB).
- No usa Realtime: el panel consulta cada 20 s solo mientras está abierto.
- Un examen completo ocupa unos 15–30 KB, así que 50 trabajadores por semana suman unos 70 MB al año (el límite gratuito es 500 MB).
