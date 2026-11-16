/* Ficha PETS referencial en el FORMATO DEL ANEXO 10 del D.S. 024-2016-EM
   (1. Personal · 2. EPP · 3. Equipos/herramientas/materiales · 4. Procedimiento · 5. Restricciones
    · Preparado por Supervisor del área · Revisado por Gerente del área · Revisado por Gerente de SSO · Aprobado por Gerente de Operaciones)
   El paso a paso sigue el Análisis de Riesgos de la Tarea de OSHA 3071 (paso → peligro → control)
   y los controles se ordenan por la jerarquía de la ISO 45001:2018 (8.1.2) y el Art. 96 del D.S. 024-2016-EM. */
window.FICHA = {
  base: {
    personal: ["Trabajador(es) capacitado(s), entrenado(s) y autorizado(s) para la tarea", "Supervisor del área"],
    epp: ["Casco de seguridad con barbiquejo", "Lentes de seguridad", "Protección auditiva", "Guantes según la tarea", "Zapatos de seguridad", "Ropa de trabajo con cintas reflectivas"],
    equipos: ["Herramientas inspeccionadas con cinta de color del mes", "Conos y cinta de señalización", "Radio de comunicación"],
    inicio: [["Leer y comprender este PETS; llenar el IPERC continuo de la tarea en el lugar de trabajo.", "Riesgos no identificados", "Administrativo (IPERC, PETS)"],
             ["Verificar EPP, equipos y herramientas (pre-uso). Retirar y reportar lo defectuoso.", "Falla de equipo / herramienta", "Administrativo / EPP"],
             ["Inspeccionar el área: orden y limpieza, accesos, iluminación y ventilación. Señalizar y delimitar.", "Caídas al mismo nivel, golpes, terceros expuestos", "Ingeniería / Administrativo"]],
    cierre: [["Al terminar: dejar el área ordenada y limpia, retirar señalización y segregar residuos según su color.", "Tropiezos, contaminación", "Administrativo"],
             ["Comunicar al supervisor el término de la tarea y cualquier incidente, acto o condición subestándar.", "Peligros no reportados", "Administrativo"]],
    restricciones: ["No realizar la tarea sin IPERC continuo llenado y sin conocer este PETS.", "No realizar la tarea con EPP, equipos o herramientas en mal estado.", "Si las condiciones cambian o aparece un peligro no controlado: detener la tarea y comunicar al supervisor (derecho a negarse al trabajo inseguro)."]
  },
  fam: {
    alt:  { norma: "Art. 129 y 134 (trabajo en altura ≥ 1.80 m · PETAR)", petar: 1, personal: ["Vigía en piso"], epp: ["Arnés de cuerpo completo con línea de anclaje y absorbedor", "Barbiquejo"], equipos: ["Puntos de anclaje certificados / línea de vida", "Portaherramientas con cordón"],
            pasos: [["Inspeccionar arnés, líneas de anclaje y punto de anclaje.", "Caída a distinto nivel", "Ingeniería (anclaje) / EPP"], ["Delimitar el área inferior y asegurar herramientas con cordón.", "Caída de objetos", "Administrativo / Ingeniería"], ["Mantenerse anclado al 100 % durante el desplazamiento y el trabajo.", "Caída a distinto nivel", "EPP"]],
            restricciones: ["Sin sistema de protección contra caídas.", "Con tormenta eléctrica, lluvia intensa o viento fuerte.", "Trabajador sin aptitud médica para trabajos en altura."] },
    and:  { norma: "Art. 129 y 134 (trabajo en altura) · estándar de andamios", petar: 1, epp: ["Arnés de cuerpo completo"], equipos: ["Andamio certificado con tarjeta de inspección", "Placas base, barandas y rodapiés"],
            pasos: [["Verificar la tarjeta del andamio (verde) y sus barandas, rodapiés y plataformas.", "Colapso, caída", "Ingeniería / Administrativo"], ["Subir por la escalera del andamio con tres puntos de apoyo.", "Caída", "Administrativo"]],
            restricciones: ["Andamio con tarjeta roja o sin tarjeta.", "Superar la capacidad de carga de la plataforma."] },
    conf: { norma: "Art. 129 y 132 (espacio confinado · PETAR · monitoreo de gases)", petar: 1, personal: ["Vigía permanente en el exterior", "Personal de rescate disponible"], epp: ["Equipo de protección respiratoria según la medición", "Arnés con línea de rescate"], equipos: ["Detector de gases calibrado", "Ventilador / extractor", "Trípode de rescate", "Equipo de comunicación"],
            pasos: [["Aislar y bloquear energías y líneas de ingreso al espacio.", "Ingreso de material / energía", "Eliminación / Ingeniería"], ["Medir O₂ (19.5 %–23.5 %), inflamables y tóxicos antes y durante el trabajo; ventilar.", "Asfixia, intoxicación, explosión", "Ingeniería / Administrativo"], ["El vigía controla el ingreso y la comunicación; ante emergencia activa el rescate sin ingresar.", "Rescate improvisado", "Administrativo"]],
            restricciones: ["Sin medición de gases o sin vigía.", "Atmósfera fuera de rango o alarma del detector."] },
    cal:  { norma: "Art. 129 y 131 (trabajo en caliente · PETAR)", petar: 1, personal: ["Vigía contra incendio"], epp: ["Careta de soldar / careta facial", "Casaca, pantalón, escarpines y guantes de cuero", "Respirador para humos metálicos"], equipos: ["Extintor PQS operativo", "Mantas ignífugas y biombos", "Máquina de soldar / equipo de oxicorte con arrestallamas"],
            pasos: [["Retirar o proteger con mantas ignífugas el material combustible en el radio indicado en el PETAR.", "Incendio", "Eliminación / Administrativo"], ["Instalar biombos y ubicar al vigía con extintor durante el trabajo.", "Quemaduras, radiación, incendio", "Ingeniería / Administrativo"], ["El vigía permanece al menos 30 min después del término verificando puntos calientes.", "Incendio latente", "Administrativo"]],
            restricciones: ["Sin vigía contra incendio o sin extintor.", "Presencia de gases o vapores inflamables."] },
    ele:  { norma: "Art. 129 y 135 (trabajos eléctricos en alta tensión · PETAR · desenergizar y bloquear)", petar: 1, personal: ["Electricista calificado y autorizado"], epp: ["Guantes dieléctricos de la clase de tensión", "Calzado dieléctrico", "Ropa resistente al arco eléctrico"], equipos: ["Revelador / detector de tensión", "Candados y tarjetas de bloqueo", "Puesta a tierra temporal", "Herramientas aisladas"],
            pasos: [["Desenergizar, bloquear y etiquetar el circuito.", "Contacto eléctrico", "Eliminación / Ingeniería"], ["Verificar ausencia de tensión y colocar puesta a tierra temporal.", "Energización accidental", "Ingeniería"], ["Señalizar la zona de trabajo y respetar distancias de seguridad.", "Arco eléctrico", "Administrativo"]],
            restricciones: ["Sin bloqueo de energía.", "Personal no autorizado o herramientas no dieléctricas."] },
    blq:  { norma: "Art. 96 (jerarquía de controles) · 7 Reglas de Tolerancia Cero (desenergizar y bloquear)", epp: ["Guantes de protección mecánica"], equipos: ["Candado personal y tarjeta de bloqueo", "Caja / pinza de bloqueo grupal"],
            pasos: [["Identificar todas las fuentes de energía (eléctrica, hidráulica, neumática, mecánica, térmica).", "Liberación inesperada de energía", "Administrativo"], ["Colocar candado y tarjeta personal en cada punto de aislamiento.", "Arranque inesperado", "Ingeniería"], ["Liberar energía residual y hacer la prueba de arranque (energía cero).", "Atrapamiento, golpes", "Ingeniería"]],
            restricciones: ["Intervenir un equipo sin bloqueo personal.", "Retirar un candado que no es propio."] },
    iza:  { norma: "Regla de oro de izaje · estándar de izaje de cargas", personal: ["Operador de grúa autorizado", "Rigger / señalero"], equipos: ["Grúa / tecle con certificación vigente", "Eslingas, grilletes y ganchos con código de color", "Vientos (cuerdas guía)"],
            pasos: [["Verificar peso de la carga, tabla de carga y que la capacidad del equipo sea mayor.", "Volcadura, caída de carga", "Ingeniería / Administrativo"], ["Inspeccionar accesorios de izaje y estrobar la carga.", "Rotura de accesorios", "Ingeniería"], ["Delimitar el radio de giro; nadie bajo la carga; guiar con vientos.", "Aplastamiento", "Administrativo"]],
            restricciones: ["Accesorios dañados o sin código de color.", "Viento fuerte o personas bajo la carga."] },
    exc:  { norma: "Art. 129 y 133 (excavaciones ≥ 1.50 m · PETAR)", petar: 1, equipos: ["Sistema de sostenimiento / entibado", "Escalera de acceso", "Barreras y señalización de borde"],
            pasos: [["Identificar interferencias (cables, tuberías) antes de excavar.", "Contacto con servicios enterrados", "Administrativo"], ["Colocar el material excavado a una distancia del borde no menor a la mitad de la profundidad.", "Derrumbe", "Ingeniería"], ["Instalar sostenimiento o talud según el tipo de suelo; delimitar el borde.", "Derrumbe, caída", "Ingeniería"]],
            restricciones: ["Excavación sin sostenimiento o talud adecuado.", "Paredes inestables, agua o lluvia sin evaluación."] },
    veh:  { norma: "Regla de oro de tránsito · Reglamento Interno de Tránsito (RITT)", personal: ["Conductor con licencia y autorización interna"], equipos: ["Vehículo con check list de pre-uso", "Circulina y pértiga", "Tacos y conos"],
            pasos: [["Realizar el check list de pre-uso del vehículo.", "Falla mecánica", "Administrativo"], ["Conducir respetando velocidades y señalización; cinturón para todos; sin celular.", "Choque, volcadura, atropello", "Administrativo / EPP"], ["Estacionar en retroceso, con freno y tacos (2 tacos y cono fuera de estacionamiento).", "Desplazamiento del vehículo", "Ingeniería"]],
            restricciones: ["Conducir con fatiga, alcohol o sin autorización.", "Vehículo con fallas en frenos, luces o dirección."] },
    eqp:  { norma: "Estándar de equipos móviles · Regla de oro de tránsito", personal: ["Operador acreditado y autorizado para el equipo"], equipos: ["Equipo con check list de pre-uso", "Extintor operativo en el equipo"],
            pasos: [["Inspeccionar el equipo (frenos, luces, alarma de retroceso, extintor).", "Falla del equipo", "Administrativo"], ["Hacer contacto visual con peatones; respetar puntos ciegos y distancias.", "Atropello", "Administrativo"], ["Al estacionar, bajar implementos, freno de parqueo y bajar con tres puntos de apoyo.", "Desplazamiento, caída", "Ingeniería / Administrativo"]],
            restricciones: ["Operador no autorizado.", "Equipo con fallas de frenos o dirección."] },
    sub:  { norma: "Art. 214 (geomecánica y sostenimiento) · Tolerancia Cero: zona no sostenida", epp: ["Lámpara minera", "Autorrescatador", "Respirador"], equipos: ["Barretillas de desatado de longitud adecuada", "Detector de gases"],
            pasos: [["Verificar ventilación y gases antes de ingresar a la labor.", "Intoxicación, asfixia", "Ingeniería / Administrativo"], ["Desatar rocas desde zona sostenida hacia la no sostenida.", "Caída de rocas", "Administrativo"], ["Instalar el sostenimiento según la recomendación geomecánica.", "Caída de rocas", "Ingeniería"]],
            restricciones: ["Labor sin desatar o sin sostenimiento según geomecánica.", "Ventilación deficiente o alarma de gases."] },
    exp:  { norma: "Reglamento de explosivos (SUCAMEC) · estándar de voladura", personal: ["Personal con licencia de manipulador de explosivos", "Vigías de voladura"], equipos: ["Explosivos y accesorios en recipientes separados", "Atacadores de madera / PVC"],
            pasos: [["Transportar explosivos y accesorios por separado en recipientes autorizados.", "Detonación accidental", "Ingeniería / Administrativo"], ["Cargar los taladros sin golpear ni forzar; nunca en tacos o tiros cortados.", "Detonación accidental", "Administrativo"], ["Evacuar, colocar vigías y dar aviso antes del disparo.", "Proyección de rocas", "Administrativo"]],
            restricciones: ["Personal sin licencia.", "Tormenta eléctrica o tiros cortados sin tratar."] },
    quim: { norma: "Regla de oro de materiales peligrosos · Hoja de Datos de Seguridad (HDS)", epp: ["Guantes de nitrilo / neopreno", "Careta facial", "Respirador con filtros para vapores"], equipos: ["HDS del producto", "Kit antiderrame", "Ducha y lavaojos operativos"],
            pasos: [["Leer la HDS: peligros, EPP e incompatibilidades.", "Exposición química", "Administrativo"], ["Verificar rotulado y rombo NFPA del recipiente.", "Confusión de productos", "Administrativo"], ["Manipular con el EPP indicado y kit antiderrame cerca.", "Quemaduras químicas", "EPP / Ingeniería"]],
            restricciones: ["Sin HDS o recipiente sin rotular.", "Mezclar productos incompatibles (p. ej. cianuro con ácidos)."] },
    her:  { norma: "Estándar de herramientas manuales y de poder", epp: ["Careta facial (herramientas de poder)"], equipos: ["Herramientas con guardas y cinta del mes", "Extensiones industriales en buen estado"],
            pasos: [["Inspeccionar la herramienta: guarda, cable, disco/broca adecuado.", "Cortes, proyección de partículas", "Ingeniería"], ["Sujetar la pieza y usar la herramienta con ambas manos.", "Cortes, golpes", "Administrativo"]],
            restricciones: ["Herramientas hechizas o sin guarda.", "Cambiar discos con el equipo conectado."] },
    pres: { norma: "Estándar de sistemas presurizados · bloqueo de energías", equipos: ["Manómetro", "Acoples con seguro y cable antilatigazo"],
            pasos: [["Despresurizar, drenar y bloquear antes de abrir líneas.", "Liberación de presión", "Eliminación / Ingeniería"], ["Verificar presión cero en el manómetro.", "Proyección, latigazo", "Ingeniería"]],
            restricciones: ["Intervenir una línea con presión.", "Usar aire comprimido sobre el cuerpo."] },
    man:  { norma: "R.M. 375-2008-TR (ergonomía) · manipulación de cargas", equipos: ["Medios mecánicos de ayuda (carretilla, estoca)"],
            pasos: [["Evaluar peso y forma de la carga; pedir ayuda o medios mecánicos si es necesario.", "Lesión lumbar", "Ingeniería / Administrativo"], ["Levantar con rodillas flexionadas, espalda recta y carga pegada al cuerpo.", "Lesión lumbar", "Administrativo"]],
            restricciones: ["Cargas que excedan lo recomendado sin ayuda mecánica."] },
    maq:  { norma: "Tolerancia Cero: fajas sin guardas · bloqueo de energías", equipos: ["Guardas y barandas instaladas", "Parada de emergencia (pull cord) operativa"],
            pasos: [["Verificar guardas, barandas y paradas de emergencia.", "Atrapamiento", "Ingeniería"], ["Detener y bloquear el equipo antes de limpiar o desatorar.", "Atrapamiento", "Eliminación / Ingeniería"]],
            restricciones: ["Equipos sin guardas o con dispositivos de seguridad anulados.", "Ropa suelta cerca de partes móviles."] },
    ord:  { norma: "Regla interna de orden y limpieza (5S)", equipos: ["Cilindros de residuos por color"], pasos: [["Mantener accesos y salidas libres; limpiar o señalizar derrames.", "Tropiezos, resbalones", "Administrativo"]], restricciones: ["Trabajar con accesos obstruidos o pisos con derrames sin señalizar."] },
    hig:  { norma: "Gestión de la salud ocupacional: monitoreo de agentes físicos y químicos", epp: ["Respirador con filtros para polvo", "Tapones / orejeras"], equipos: ["Sistema de humedecimiento / riego"],
            pasos: [["Usar riego o humedecimiento para controlar polvo.", "Neumoconiosis (silicosis)", "Ingeniería"], ["Usar respirador con prueba de ajuste y protección auditiva.", "Exposición a polvo y ruido", "EPP"]],
            restricciones: ["Trabajar en zonas de ruido o polvo sin protección."] },
    inc:  { norma: "Prevención y protección contra incendios · abastecimiento de combustible", equipos: ["Extintor PQS operativo", "Puesta a tierra para abastecimiento", "Kit antiderrame"],
            pasos: [["Apagar motor, no fumar ni usar celular y conectar la puesta a tierra.", "Incendio, explosión", "Eliminación / Ingeniería"], ["Mantener extintor operativo y kit antiderrame cerca.", "Incendio, derrame", "Ingeniería"]],
            restricciones: ["Abastecer con el motor encendido o fuentes de ignición cerca."] },
    perf: { norma: "Estándar de perforación · Tolerancia Cero: zona no sostenida", epp: ["Respirador", "Protección auditiva doble"], equipos: ["Perforadora inspeccionada", "Agua para perforación húmeda"],
            pasos: [["Verificar desatado, sostenimiento y ausencia de tiros cortados.", "Caída de rocas, detonación", "Administrativo"], ["Perforar en húmedo y nunca en tacos de taladros anteriores.", "Polvo, detonación", "Ingeniería / Administrativo"]],
            restricciones: ["Perforar en tacos o con tiros cortados.", "Labor sin desatar o sin sostener."] },
    conc: { norma: "Norma G.050 Seguridad durante la construcción · estándar de shotcrete", epp: ["Guantes de jebe y botas de jebe (cemento)"], equipos: ["Encofrados apuntalados", "Capuchones para fierros"],
            pasos: [["Verificar encofrados y apuntalamiento antes del vaciado.", "Colapso", "Ingeniería"], ["Mantener al personal fuera del área de lanzado / canaleta.", "Golpes, proyección", "Administrativo"]],
            restricciones: ["Encofrado sin revisar.", "Personal bajo el área de lanzado."] },
    mont: { norma: "Estándar de montacargas y equipos de manipulación", personal: ["Operador de montacargas autorizado"], equipos: ["Montacargas con check list", "Placa de capacidad visible"],
            pasos: [["Verificar la placa de capacidad y el estado del equipo.", "Volcadura", "Administrativo"], ["Circular con la carga baja; sin personas en las horquillas.", "Atropello, caída de carga", "Administrativo"]],
            restricciones: ["Transportar personas en las horquillas."] },
    neu:  { norma: "Estándar de neumáticos (jaula de inflado)", equipos: ["Jaula de inflado", "Manómetro y válvula de control remoto", "Caballetes"],
            pasos: [["Desinflar completamente y retirar el núcleo de la válvula antes de desmontar.", "Explosión del neumático", "Eliminación"], ["Inflar dentro de la jaula y fuera de la zona de trayectoria.", "Proyección del aro", "Ingeniería"]],
            restricciones: ["Soldar o calentar el aro con la llanta montada."] },
    lab:  { norma: "Estándar de laboratorio · HDS de reactivos", epp: ["Mandil", "Guantes de nitrilo", "Ropa aluminizada (ensayo al fuego)"], equipos: ["Campana extractora", "Ducha y lavaojos"],
            pasos: [["Manipular reactivos volátiles bajo campana extractora.", "Inhalación", "Ingeniería"], ["Desechar vidrio roto y residuos en recipientes específicos.", "Cortes, contaminación", "Administrativo"]],
            restricciones: ["Comer o beber en el laboratorio.", "Pipetear con la boca."] },
    amb:  { norma: "Ley 28611 General del Ambiente · plan de manejo de residuos", equipos: ["Kit antiderrame", "Bandejas de contención", "Cilindros por color"],
            pasos: [["Colocar bandejas de contención bajo equipos y recipientes.", "Derrame", "Ingeniería"], ["Ante un derrame: contener, recoger y reportar a Medio Ambiente.", "Contaminación de suelo y agua", "Administrativo"]],
            restricciones: ["Arrojar residuos a cuerpos de agua o al suelo."] },
    agua: { norma: "Regla de oro: trabajo en agua (chaleco salvavidas, nunca solo)", epp: ["Chaleco salvavidas"], equipos: ["Aro salvavidas con cuerda", "Línea de vida"],
            pasos: [["Usar chaleco salvavidas y trabajar siempre en pareja.", "Ahogamiento", "EPP / Administrativo"], ["Mantenerse en accesos autorizados; no pisar el relave.", "Hundimiento, atrapamiento", "Administrativo"]],
            restricciones: ["Trabajar solo o sin chaleco salvavidas."] },
    gen:  { norma: "Arts. 98 y 99 (PETS) · Art. 44 (obligaciones del trabajador)", pasos: [], restricciones: [] }
  }
};

function fichaPets(pets) {
  const B = FICHA.base, fs = (pets.f && pets.f.length ? pets.f : ["gen"]).map(k => FICHA.fam[k]).filter(Boolean);
  const uni = a => [...new Set(a)];
  const personal = uni([...B.personal, ...fs.flatMap(f => f.personal || [])]);
  const epp = uni([...B.epp, ...fs.flatMap(f => f.epp || [])]);
  const equipos = uni([...fs.flatMap(f => f.equipos || []), ...B.equipos]);
  const petar = fs.some(f => f.petar);
  const pasos = [...B.inicio];
  if (petar) pasos.splice(1, 0, ["Obtener el PETAR (Anexo 18) autorizado y firmado por el supervisor y el jefe de área para el turno.", "Trabajo de alto riesgo sin autorización", "Administrativo (PETAR)"]);
  fs.forEach(f => (f.pasos || []).forEach(p => { if (!pasos.some(x => x[0] === p[0])) pasos.push(p); }));
  pasos.push(...B.cierre);
  const restricciones = uni([...(petar ? ["No iniciar sin PETAR autorizado y firmado para el turno."] : []), ...fs.flatMap(f => f.restricciones || []), ...B.restricciones]);
  const normas = uni(["D.S. 024-2016-EM Arts. 98–99 (PETS) y Anexo 10 (formato)", ...fs.map(f => "D.S. 024-2016-EM / estándar: " + f.norma)]);
  return { personal, epp, equipos, pasos, restricciones, normas, petar };
}

function htmlFicha(pets) {
  const F = fichaPets(pets), L = a => a.map((x, i) => `<div>${i + 1}. ${esc(x)}</div>`).join("");
  return `<div class="doc ficha"><div class="noprint small" style="background:#fff8e6;border:1px solid var(--gold);padding:8px 10px;border-radius:6px;margin-bottom:10px">Ficha referencial generada por el sistema en el formato del <b>Anexo 10 del D.S. 024-2016-EM</b>. Sirve para estandarizar y evaluar; <b>no reemplaza el PETS oficial</b> de la empresa, que debe elaborarse con participación de los trabajadores y ser aprobado (Art. 98).</div>
  <table class="fhd"><tr><td rowspan="2" style="width:22%;text-align:center"><b>LOGO</b><br><span class="small">Unidad minera / Empresa</span></td><td rowspan="2" style="text-align:center"><div class="small">PROCEDIMIENTO ESCRITO DE TRABAJO SEGURO</div><b style="font-size:15px">${esc(pets.n)}</b></td><td style="width:24%"><b>Código:</b> ${esc(pets.c)}<br><b>Versión:</b> 01</td></tr><tr><td><b>Área:</b> ${esc(pets.a || "—")}<br><b>Página:</b> ___ de ___</td></tr></table>
  ${F.petar ? `<div class="small" style="margin:6px 0"><span class="tag tag-bad">Trabajo de alto riesgo · requiere PETAR (Art. 129–130)</span></div>` : ""}
  <h4>1. PERSONAL</h4>${L(F.personal)}
  <h4>2. EQUIPOS DE PROTECCIÓN PERSONAL</h4>${L(F.epp)}
  <h4>3. EQUIPOS / HERRAMIENTAS / MATERIALES</h4>${L(F.equipos)}
  <h4>4. PROCEDIMIENTO</h4><table><tr><th style="width:6%">N°</th><th>Paso de la tarea</th><th style="width:24%">Peligro / riesgo</th><th style="width:20%">Control (jerarquía)</th></tr>${F.pasos.map((p, i) => `<tr><td>4.${i + 1}</td><td>${esc(p[0])}</td><td>${esc(p[1])}</td><td>${esc(p[2])}</td></tr>`).join("")}</table>
  <h4>5. RESTRICCIONES</h4>${L(F.restricciones)}
  <table style="margin-top:14px"><tr><th style="width:25%;text-align:center">PREPARADO POR</th><th style="width:25%;text-align:center">REVISADO POR</th><th style="width:25%;text-align:center">REVISADO POR</th><th style="width:25%;text-align:center">APROBADO POR</th></tr>
  <tr><td style="height:56px"></td><td></td><td></td><td></td></tr><tr><td class="small" style="text-align:center">Supervisor del área</td><td class="small" style="text-align:center">Gerente del área</td><td class="small" style="text-align:center">Gerente de Seguridad y Salud Ocupacional</td><td class="small" style="text-align:center">Gerente de Operaciones</td></tr>
  <tr><td colspan="2" class="small">Fecha de elaboración: __/__/____</td><td colspan="2" class="small">Fecha de aprobación: __/__/____</td></tr></table>
  <div class="pie"><b>Base normativa:</b> ${F.normas.map(esc).join(" · ")}. Paso a paso según el Análisis de Riesgos de la Tarea (OSHA 3071) y controles según la jerarquía de la ISO 45001:2018 (8.1.2) y el Art. 96 del D.S. 024-2016-EM.</div></div>`;
}
