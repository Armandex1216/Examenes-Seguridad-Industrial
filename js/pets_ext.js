/* Ampliación del catálogo de PETS (se agrega DESPUÉS del catálogo base para no cambiar los códigos existentes).
   Formato: "nombre|familias". Combinaciones: [área, ["equipo|fam"], ["actividad|fam"]] */
window.PETS_EXT = {
  areas: { ADM: "Oficinas y administración", SAL: "Salud ocupacional y servicios médicos" },
  F: {
    AMB: `Monitoreo de calidad de agua superficial en ríos y quebradas|amb,agua,veh
Monitoreo de agua subterránea en pozos|amb,agua,pres
Monitoreo de efluentes mineros en punto de descarga|amb,agua,quim
Monitoreo de efluentes domésticos|amb,agua,quim
Monitoreo de calidad de aire (PM10 y PM2.5)|amb,hig,ele
Monitoreo de emisiones de chimeneas|amb,alt,quim
Monitoreo de vibraciones por voladura|amb,exp
Monitoreo hidrobiológico|amb,agua
Monitoreo de aves y mamíferos|amb,veh
Monitoreo de bofedales y humedales|amb,agua
Monitoreo de lagunas altoandinas|amb,agua,hig
Monitoreo participativo con comunidades|amb,veh,gen
Monitoreo de calidad de agua potable|amb,agua,lab
Aforo de caudales en canales y ríos|amb,agua
Muestreo de sedimentos|amb,agua,her
Mantenimiento de estación meteorológica|amb,alt,ele
Instalación de piezómetros ambientales|amb,perf,exc
Segregación de residuos en puntos de acopio|amb,man,ord
Recolección de residuos sólidos domésticos|amb,man,veh
Transporte interno de residuos peligrosos|amb,quim,veh
Operación de relleno sanitario|amb,eqp,hig
Compactación y cobertura de residuos en relleno sanitario|amb,eqp
Operación de incinerador de residuos|amb,cal,inc
Manejo de residuos biocontaminados (hospitalarios)|amb,quim,man
Manejo de aceites usados|amb,quim,inc
Manejo de baterías usadas|amb,quim,man
Manejo de llantas en desuso|amb,neu,man
Manejo de chatarra metálica|amb,man,her
Manejo y lavado de envases de reactivos|amb,quim,pres
Manejo de envases de cianuro|amb,quim
Manejo de lodos de planta de tratamiento|amb,quim,conf
Operación de planta de tratamiento de agua residual doméstica (PTARD)|amb,quim,conf,pres
Mantenimiento de PTARD|amb,conf,blq,quim
Operación de planta de tratamiento de agua ácida (HDS)|amb,quim,pres
Dosificación de cal para tratamiento de agua|amb,quim,hig
Limpieza de pozas de sedimentación con equipo|amb,agua,eqp
Mantenimiento de canales de coronación|amb,agua,exc
Mantenimiento de cunetas y alcantarillas|amb,exc,man
Producción de plantones en vivero|amb,her,man
Riego y mantenimiento de vivero|amb,agua,her
Revegetación con especies nativas|amb,her,man
Instalación de champas en taludes|amb,alt,man
Reforestación de taludes|amb,alt,her
Control de erosión con geomallas|amb,man,her
Hidrosiembra|amb,pres,eqp
Rescate y reubicación de fauna silvestre|amb,man
Rescate y reubicación de flora|amb,her,man
Manejo de top soil (suelo orgánico)|amb,eqp
Cierre progresivo de botaderos|amb,eqp,exc
Cobertura de depósitos de desmonte|amb,eqp
Respuesta ante derrames de hidrocarburos|amb,quim,inc
Respuesta ante derrames de reactivos químicos|amb,quim
Respuesta ante derrames de relave|amb,agua,pres
Remediación de suelos contaminados|amb,quim,eqp
Biorremediación en landfarming|amb,quim,man
Inspección ambiental de empresas contratistas|amb,ord
Simulacro ambiental de derrame|amb,quim,gen
Aplicación de supresor de polvo en vías|amb,quim,eqp
Riego de vías para control de polvo|amb,hig,eqp
Fumigación de áreas verdes|amb,quim,her
Lombricultura|amb,man
Cloración de agua para consumo|amb,quim,agua
Inspección y mantenimiento de geomembranas|amb,cal,man
Monitoreo ambiental de depósito de relaves|amb,agua,veh
Instalación de trampas de sedimentos|amb,exc,man
Instalación de barreras de contención en cuerpos de agua|amb,agua,man
Muestreo de agua desde bote|amb,agua
Monitoreo de ruido en campamento|amb,hig
Medición de radiación UV|amb,hig
Limpieza de playas de acopio de residuos|amb,ord,man`,
    ADM: `Trabajo en oficina con computadoras|man,ord
Uso de impresoras y fotocopiadoras|ele,ord
Archivo y manejo de documentos|man,alt,ord
Atención al público en recepción|ord,gen
Reuniones y capacitaciones en sala|ord,gen
Mantenimiento de equipos de cómputo|ele,her
Instalación de cableado de red|ele,alt,her
Mantenimiento de servidores y centro de datos|ele,inc
Mudanza de mobiliario de oficina|man
Uso de escaleras en oficinas|alt
Recorrido de visitas a operación|veh,gen
Trabajo en campo de personal administrativo|veh,gen
Trabajo remoto en campamento|man,ord
Uso de cafetera y microondas en oficina|ele,ord`,
    SAL: `Atención de pacientes en tópico|quim,ord
Atención de emergencias médicas en campo|veh,gen
Traslado de pacientes en ambulancia|veh,man
Manejo de residuos biocontaminados del tópico|quim,amb
Manejo de medicamentos y farmacia|quim,ord
Toma de muestras de laboratorio clínico|quim,lab
Uso de oxígeno medicinal|pres,inc
Esterilización de material médico|cal,pres
Evaluaciones médicas ocupacionales|ord,gen
Pruebas de alcoholemia y descarte de drogas|ord,gen
Monitoreo de ruido ocupacional|hig
Monitoreo de polvo y sílice ocupacional|hig
Monitoreo de gases ocupacionales|hig,conf
Monitoreo de estrés térmico|hig
Evaluación ergonómica de puestos|man
Atención psicológica y bienestar|ord,gen`,
    MSU: `Ventilación auxiliar de frentes ciegos|sub,ele,hig
Medición de caudales de aire en labores|sub,hig
Instalación de cortinas de ventilación|sub,man
Construcción de muros de concreto en interior mina|sub,conc
Instalación de puerta de refugio minero|sub,her,iza
Mantenimiento de refugios mineros|sub,ele,pres
Lavado de frentes con agua a presión|sub,pres
Control de calidad de pernos (prueba de arranque)|sub,pres
Instalación de pernos de anclaje con resina|sub,perf,quim
Instalación de cable bolting|sub,perf,iza
Construcción de echaderos y tolvas|sub,conc,alt
Destatoro de echaderos de mineral|sub,conf,exp
Rehabilitación de rampas|sub,eqp
Mantenimiento de vías en interior mina|sub,eqp
Instalación de estaciones de carguío|sub,ele
Construcción de bocaminas|sub,conc,exc
Transporte de personal en volquete adaptado|sub,veh
Inspección de labores en guardia|sub,gen
Supervisión de frentes de avance|sub,gen
Control de orden y limpieza en interior mina|sub,ord`,
    MTA: `Diseño y marcado de mallas de perforación|perf,veh
Muestreo de detritos de perforación|perf,hig
Limpieza de collares de taladros|perf,man
Construcción de diques y accesos|eqp,exc
Mantenimiento de bermas de seguridad|eqp
Señalización de vías en tajo|veh,ord
Operación de chancadora móvil|maq,eqp,hig
Inspección de taludes post voladura|exc,gen
Control de agua en tajo con bombas|pres,ele,agua`,
    PLC: `Cambio de placas de chancadora de quijada|maq,blq,iza
Cambio de rodillos de faja|maq,blq,man
Cambio de forros de chute|maq,blq,cal,conf
Cambio de bolas de molino de remolienda|maq,iza,man
Calibración de densímetro nuclear|maq,ele,gen
Preparación y dosificación de floculante|quim,man
Limpieza de canaletas de concentrado|maq,ord,quim
Limpieza de pozas de derrames en planta|ord,pres,quim
Operación de planta de chancado|maq,hig
Operación de planta de flotación|maq,quim
Operación de planta de filtrado|maq,pres
Operación de planta de espesamiento|maq,quim
Muestreo automático y manual de concentrados|lab,maq
Operación de cuarto de reactivos|quim,ord
Ingreso a tanques agitadores para limpieza|conf,blq,quim`,
    MET: `Recepción de cal viva a granel|quim,hig,veh
Preparación de solución de soda cáustica|quim
Limpieza de filtros clarificadores|quim,blq,pres
Manipulación de zinc en polvo|quim,inc
Operación de planta ADR|quim,cal,pres
Cosecha de cátodos|quim,ele,man
Lixiviación en tanques agitados|quim,maq
Operación de planta de detoxificación|quim,pres
Muestreo de soluciones cianuradas|quim,lab`,
    MMC: `Cambio de cuchillas y dientes de cucharón|iza,blq,her
Cambio de mangueras de alta presión|pres,blq
Cambio de llantas de equipo de bajo perfil|neu,iza
Overhaul de motores diésel|blq,iza,man
Reparación de transmisiones|blq,iza,man
Mantenimiento de sistemas de aire acondicionado de equipos|blq,pres,quim
Mantenimiento de sistemas de lubricación centralizada|pres,blq
Análisis de aceite (toma de muestras)|quim,blq
Lavado y desengrase de piezas|quim,ord
Pintura de equipos en taller|quim,pres,hig
Soldadura de estructuras de equipos|cal,blq
Mantenimiento de puertas enrollables y portones|alt,blq,her
Mantenimiento de ascensores y montacargas de personas|alt,ele,blq
Mantenimiento de grúas puente de taller|alt,iza,blq
Inspección por ultrasonido y ensayos no destructivos|her,alt
Alineamiento láser de ejes|blq,her
Balanceo dinámico de rotores|maq,blq
Mantenimiento de bombas de concreto|pres,blq,conc`,
    MEL: `Instalación de tableros temporales de obra|ele,her
Mantenimiento de alumbrado en interior mina|ele,sub,alt
Instalación de sistemas de detección de incendios|ele,alt
Mantenimiento de sistemas de radiocomunicación|ele,alt
Mantenimiento de antenas y repetidoras|ele,alt
Instalación de sensores de gases fijos|ele,sub
Mantenimiento de sistema de pesaje|ele,blq
Mantenimiento de analizadores en línea|ele,quim
Calibración de detectores portátiles de gases|ele,lab
Instalación de sistemas fotovoltaicos|ele,alt
Mantenimiento de sistemas de pararrayos|ele,alt
Pruebas de relés de protección|ele,blq`,
    CON: `Instalación de techos de policarbonato|alt,her
Construcción de losas deportivas|conc,eqp
Construcción de reservorios de agua|conc,exc,agua
Instalación de cercos perimétricos|her,exc,man
Construcción de muros de gaviones|man,agua
Construcción de puentes peatonales|alt,iza,conc
Instalación de barandas metálicas|alt,cal,her
Pavimentación con adoquines|man,her,hig
Instalación de estructuras de drywall en altura|and,her
Pintura de fachadas|alt,and,quim
Impermeabilización de reservorios|quim,conf,cal
Construcción de rampas de concreto|conc,eqp
Demolición de estructuras de concreto con martillo|her,hig,exc
Instalación de carpas y toldos|alt,man
Construcción de sistemas de drenaje pluvial|exc,conc`,
    SOL: `Soldadura de recipientes a presión|cal,pres
Soldadura bajo agua de tuberías|cal,agua
Soldadura en interior mina|cal,sub
Corte de estructuras con arco aire (arc air)|cal,hig,inc
Soldadura de rieles|cal,man
Fabricación de rejillas y escaleras|cal,her
Fabricación de guardas para equipos|cal,her
Reparación de tanques por soldadura|cal,conf,alt
Soldadura de aluminio|cal,hig
Soldadura de cobre y latón|cal,hig`,
    GAS: `Instalación de redes de agua caliente|pres,cal
Instalación de paneles solares térmicos|alt,pres
Mantenimiento de calentadores a gas|inc,pres
Instalación de sistemas de riego|pres,exc
Desatoro de sumideros|pres,hig
Limpieza de pozos sépticos|conf,hig,amb
Instalación de sistemas de bombeo de desagüe|pres,ele
Reparación de tuberías de cobre|cal,pres
Instalación de tuberías de acero galvanizado|her,pres
Prueba de hermeticidad de redes de gas|inc,pres`,
    LAB: `Preparación de muestras de agua|lab,quim
Análisis de cianuro libre y total|lab,quim
Análisis granulométrico por tamizado|lab,maq,hig
Ensayos de humedad de concentrados|lab,cal
Manejo de ácidos concentrados|lab,quim
Manejo de mercurio en laboratorio|lab,quim
Mantenimiento de hornos de laboratorio|lab,cal,blq
Limpieza de campanas extractoras|lab,quim
Pruebas de flotación en laboratorio|lab,quim,maq
Recepción de muestras de campo|lab,man,veh`,
    LOG: `Almacenamiento de cilindros de gases comprimidos|inc,man
Almacenamiento de reactivos químicos|quim,mont
Almacenamiento de cianuro de sodio|quim,mont
Almacenamiento de aceites y lubricantes|inc,quim,mont
Despacho de EPP|man,ord
Despacho de explosivos desde polvorín principal|exp,man
Recepción de combustible en tanques|inc,veh
Carga de contenedores|mont,iza
Descarga de cilindros de combustible|inc,man,mont
Embalaje de muestras para envío|man,lab
Uso de racks selectivos en altura|mont,alt
Manejo de bobinas de cable|iza,man`,
    TRA: `Transporte de explosivos por carretera|veh,exp
Transporte de ácido sulfúrico|veh,quim
Transporte de cal|veh,quim,hig
Transporte de cilindros de gas|veh,inc
Transporte de residuos peligrosos|veh,quim,amb
Transporte de agua potable en cisterna|veh,agua
Conducción en vías de alta pendiente|veh
Conducción en vías no asfaltadas con polvo|veh,hig
Escolta de convoy|veh
Remolque con grúa plataforma|veh,iza
Abastecimiento de combustible a vehículos livianos|inc,veh
Conducción de minicargador en campamento|eqp,veh`,
    GEO: `Mapeo geológico en tajo|veh,exc
Muestreo de canales en superficie|her,hig
Transporte de cajas de testigos|man,veh
Medición de desviación de taladros diamantinos|perf
Recuperación de testigos orientados|perf,man
Instalación de extensómetros|perf,ele
Topografía con estación total en interior mina|sub,gen
Topografía con GPS en zonas de altura|veh,alt
Vuelo de dron para levantamiento topográfico|veh,gen
Cierre de plataformas de perforación|amb,eqp`,
    IZA: `Izaje de componentes de molino|iza,blq
Izaje de tuberías de relave|iza,pres
Izaje de transformadores|iza,ele
Izaje de bombas sumergibles|iza,agua
Izaje con camión grúa articulado|iza,veh
Izaje de estructuras para torres eléctricas|iza,alt,ele
Izaje en interior mina con tecles|iza,sub
Maniobras de arrastre con tractor|iza,eqp`,
    REL: `Operación de cajón de bombeo de relave|pres,maq
Inspección de tuberías de relave|pres,veh
Mantenimiento de bombas de relave|pres,blq
Instalación de geomembrana en presa|cal,man
Operación de sistema de drenaje de presa|pres,agua
Recrecimiento de dique con material de préstamo|eqp,exc
Monitoreo de presa con topografía|veh,agua
Operación de barcaza de recirculación|agua,pres,ele`,
    ENE: `Maniobras de seccionadores|ele,blq
Mantenimiento de interruptores de potencia|ele,blq
Lavado de aisladores|ele,pres,alt
Medición de malla a tierra en subestación|ele
Cambio de fusibles de media tensión|ele,blq
Mantenimiento de banco de baterías de subestación|ele,quim
Mantenimiento de tableros de transferencia|ele,blq
Operación de grupos electrógenos de respaldo|ele,inc`,
    SER: `Recepción y almacenamiento de alimentos|man,ord
Uso de cámaras frigoríficas|conf,ele
Limpieza de cocinas industriales|quim,cal
Uso de freidoras industriales|cal,inc
Uso de cortadoras y moledoras de carne|maq,her
Lavado de vajilla industrial|cal,quim
Limpieza de tanques de agua de campamento|conf,quim,alt
Mantenimiento de habitaciones de campamento|her,ord
Mantenimiento de áreas deportivas|her,man
Recolección de ropa de lavandería|man
Uso de secadoras industriales|cal,maq
Lavado de mamelucos con hidrocarburo|quim,inc
Barrido de vías con barredora|eqp,hig
Corte de césped con podadora|her,hig
Poda de árboles|alt,her`,
    SEG: `Inspección de extintores|inc
Inspección de equipos de rescate|gen
Inspección de duchas de emergencia y lavaojos|pres
Prueba de sistemas de alarma|ele
Inspección de arneses y líneas de vida|alt
Inspección de herramientas portátiles (código de colores)|her
Auditoría de PETS y PETAR en campo|gen
Investigación de incidentes en campo|gen
Brigada de rescate en altura|alt,iza
Rescate en zanjas y excavaciones|exc
Rescate acuático|agua
Combate de incendios en interior mina|inc,sub
Uso de equipo de respiración autónoma (SCBA)|pres,conf
Atención de materiales peligrosos (HAZMAT)|quim`
  },
  C: [
    ["HER", ["amoladora angular de 4½\"|her,cal,hig","amoladora angular de 7\"|her,cal,hig","amoladora angular de 9\"|her,cal,hig","esmeril de banco|her,maq","taladro de columna|her,maq","taladro inalámbrico|her","rotomartillo SDS|her,hig","martillo demoledor eléctrico|her,hig","sierra sable|her","sierra de banco|her,maq","sierra ingletadora|her,maq","sierra circular|her,maq","cortadora de baldosa|her,hig","cortadora de fierro|her,maq","dobladora de fierro|her,maq,conc","cepillo eléctrico|her","lijadora orbital|her,hig","lijadora de banda|her,hig","fresadora manual (router)|her,hig","pistola de calor|her,cal","cautín y soldador de estaño|her,cal,ele","atornillador eléctrico|her","remachadora neumática|her,pres","engrapadora neumática|her,pres","clavadora neumática|her,pres","pistola de clavos de pólvora|her,exp","motosierra|her,hig","desbrozadora|her,hig","cortasetos eléctrico|her","sopladora|her,hig","aspiradora industrial|her,ele","bomba sumergible portátil|her,ele,agua","apisonador (vibropisón)|her,hig","mezcladora de concreto (trompo)|her,maq,conc","roscadora de tubos|her,maq,pres","prensa hidráulica de taller|her,pres","torquímetro hidráulico|her,pres","tensionador hidráulico de pernos|her,pres","máquina de soldar inverter|cal,ele","equipo de oxicorte portátil|cal,inc","pistola de pintura airless|quim,pres","equipo de arenado|pres,hig","escarificadora de concreto|her,hig","pulidora de pisos|her,ele","taladro magnético|her,maq","llave de impacto neumática|her,pres","pistola de impacto inalámbrica|her","cortadora de plasma|cal,her","termofusionadora de tubería|cal,pres","multímetro y pinza amperimétrica|ele"],
      ["Uso seguro de|", "Inspección pre-uso de|gen", "Mantenimiento y reparación de|blq,ele"]],
    ["AMB", ["agua superficial|agua","agua subterránea|agua,pres","efluentes|agua,quim","aire|hig","ruido|hig","suelos|her","flora|veh","fauna|veh"],
      ["Muestreo y preservación de muestras de|lab,quim", "Transporte y entrega de muestras de|veh,man"]],
    ["SER", ["comedor","cocina","lavandería","habitaciones","oficinas","servicios higiénicos","gimnasio","áreas comunes"],
      ["Limpieza y desinfección de|ord,quim", "Fumigación y control de plagas en|quim,hig"]],
    ["MSU", ["galería","rampa","crucero","subnivel","tajeo","chimenea","by pass","cámara de carguío"],
      ["Desatado y sostenimiento en|sub,perf", "Perforación y voladura en|perf,exp,sub", "Limpieza y acarreo de mineral en|eqp,sub"]],
    ["MMC", ["scaler","jumbo empernador","mixer","telehandler","motoniveladora","cargador frontal","excavadora","tractor de orugas","camión cisterna","bus","volquete","compresora portátil"],
      ["Cambio de aceite y filtros de|blq,quim,amb", "Lavado de|pres,amb"]]
  ]
};
