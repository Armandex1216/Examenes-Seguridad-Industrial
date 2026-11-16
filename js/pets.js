/* Catálogo de PETS · código → nombre, área y familias de riesgo.
   Código: PETS-<ÁREA>-<NNN>. Se generan +1000 tareas de minería, construcción, plantas,
   metalurgia, mantenimiento, oficios (soldadura, electricidad, gasfitería), herramientas de poder,
   medio ambiente, laboratorio, logística, transporte y servicios. */
(function () {
  const AREAS = {
    MSU: "Mina subterránea", MTA: "Mina a tajo abierto", PLC: "Planta concentradora", MET: "Metalurgia y procesos",
    MMC: "Mantenimiento mecánico", MEL: "Mantenimiento eléctrico e instrumentación", CON: "Construcción civil",
    SOL: "Soldadura y metalmecánica", GAS: "Gasfitería y fontanería", HER: "Herramientas de poder",
    AMB: "Medio ambiente", LAB: "Laboratorio", LOG: "Almacén y logística", TRA: "Transporte",
    GEO: "Geología, perforación diamantina y topografía", IZA: "Izajes y maniobras", REL: "Relaves y recursos hídricos",
    ENE: "Energía y subestaciones", SER: "Servicios generales y campamento", SEG: "Seguridad, emergencias y rescate"
  };
  // Tareas fijas por área: "nombre|familias"
  const F = {
    MSU: `Desatado manual de rocas con barretilla|sub,gen
Desatado mecanizado con scaler|sub,eqp
Sostenimiento con pernos helicoidales|sub,perf,her
Sostenimiento con pernos Split Set|sub,perf
Instalación de malla electrosoldada|sub,man,her
Sostenimiento con cuadros de madera|sub,man,her
Sostenimiento con cimbras metálicas|sub,iza,man
Lanzado de shotcrete vía húmeda|sub,conc,eqp
Lanzado de shotcrete vía seca|sub,conc,hig
Perforación de frentes con jackleg|perf,sub,hig
Perforación de chimeneas con stoper|perf,sub,alt
Perforación de taladros largos|perf,sub,eqp
Carguío de taladros con explosivo encartuchado|exp,sub
Carguío de taladros con ANFO neumático|exp,sub,pres
Carguío de taladros con emulsión a granel|exp,sub,quim
Voladura de frentes en galería|exp,sub
Voladura de tajeos|exp,sub
Voladura secundaria (plasteo) de bancos|exp,sub
Tratamiento de tiros cortados|exp,sub
Limpieza de mineral con winche de arrastre|sub,maq,iza
Limpieza de labores con pala neumática|sub,pres,eqp
Acarreo de mineral con carros mineros y locomotora|eqp,sub
Relleno hidráulico de tajeos|sub,pres,agua
Relleno detrítico de tajeos|sub,eqp
Relleno cementado en pasta|sub,pres,conc
Instalación de mangas de ventilación|sub,alt,man
Instalación de ventiladores auxiliares|sub,ele,iza
Construcción de tapones de ventilación|sub,conc,man
Monitoreo de gases en interior mina|sub,conf
Ingreso y tránsito por escaleras de chimeneas|sub,alt
Construcción de chimeneas con plataforma trepadora|sub,alt,perf,exp
Desquinche de labores|sub,perf,exp
Desate y regado de carga después de la voladura|sub,hig
Instalación de tuberías de aire y agua en interior mina|sub,pres,alt
Instalación de redes eléctricas en interior mina|sub,ele,alt
Bombeo y drenaje de agua en interior mina|sub,pres,ele,agua
Construcción de cunetas y canaletas en interior mina|sub,her,man
Construcción de refugios mineros|sub,conc,ele
Instalación de puertas de ventilación|sub,her,man
Inspección geomecánica de labores|sub,gen
Mapeo geológico en interior mina|sub,gen
Muestreo de canales en interior mina|sub,her,hig
Transporte de explosivos a interior mina|exp,veh,sub
Abastecimiento de explosivos a polvorín auxiliar|exp,sub,man
Rehabilitación de labores antiguas|sub,conf,perf
Taponeo de labores abandonadas|sub,conc,man
Instalación de señalización en interior mina|sub,her,alt
Limpieza de cunetas y pozas de sedimentación|sub,agua,man
Traslado de personal en interior mina|veh,sub
Uso de jaula y winche en pique|sub,iza,alt,maq
Mantenimiento de pique y compartimientos|sub,alt,iza,blq
Señalización y bloqueo de labores críticas|sub,gen`,
    MTA: `Perforación de bancos con perforadora DTH|perf,eqp,hig
Perforación primaria con perforadora rotativa|perf,eqp
Carguío de taladros con camión fábrica|exp,eqp,quim
Voladura primaria en tajo|exp,eqp
Voladura de precorte|exp
Señalización y evacuación de área de voladura|exp,veh
Carguío de mineral con pala hidráulica|eqp
Carguío de desmonte con excavadora|eqp,exc
Acarreo de mineral con camión minero|eqp,veh
Descarga de material en botadero|eqp
Construcción y mantenimiento de bermas de seguridad|eqp,exc
Mantenimiento de vías con motoniveladora|eqp
Riego de vías con camión cisterna|eqp,hig,agua
Desatado de taludes|exc,eqp,alt
Construcción de rampas en tajo|eqp,exc
Limpieza de bancos con tractor de orugas|eqp
Control de polvo en tajo|hig,eqp
Despacho de equipos en tajo|veh,gen
Operación de torre de iluminación|ele,eqp
Monitoreo geotécnico de taludes|exc,gen
Abastecimiento de combustible en campo con cisterna|inc,eqp,quim
Lubricación de equipos en campo|eqp,quim,blq
Remolque de equipos pesados|eqp,iza
Traslado de equipos con cama baja|eqp,iza,veh
Construcción de pozas y canales de drenaje en tajo|exc,agua,eqp
Topografía en bancos del tajo|veh,eqp,gen`,
    PLC: `Operación de chancadora primaria|maq,hig,blq
Operación de chancadora secundaria y terciaria|maq,hig,blq
Desatoro de chancadora|maq,blq,iza
Cambio de mantos y cóncavos de chancadora|blq,iza,cal,maq
Operación de molino de bolas|maq,hig,blq
Carguío de bolas al molino|iza,man,maq
Cambio de liners de molino|blq,iza,conf,maq
Operación de celdas de flotación|maq,quim
Limpieza de celdas de flotación|conf,blq,quim
Preparación de reactivos de flotación|quim,man
Dosificación de reactivos|quim,pres
Preparación de lechada de cal|quim,hig
Operación de espesadores|maq,quim,alt
Operación de filtro prensa|maq,pres,blq
Descarga y manejo de concentrado|maq,hig,man
Operación de fajas transportadoras|maq,blq
Limpieza de derrames bajo fajas transportadoras|maq,blq,ord
Cambio de polines de faja|maq,blq,man
Empalme vulcanizado de faja|maq,blq,quim,cal
Alineamiento de fajas transportadoras|maq,blq
Operación de zarandas vibratorias|maq,hig
Cambio de mallas de zaranda|blq,iza,maq
Operación de bombas de pulpa|pres,maq,blq
Cambio de bombas de pulpa|pres,blq,iza
Operación de hidrociclones|pres,maq
Cambio de apex y vortex de hidrociclones|pres,blq
Muestreo de pulpa en planta|lab,maq,ord
Limpieza de cajones de bombeo|conf,blq,pres
Operación de alimentadores de mineral|maq,blq
Inspección de planta en operación|maq,ord,gen
Limpieza de tolvas de finos|conf,maq,blq,alt
Desatoro de tolvas y chutes|conf,blq,alt
Operación de balanza de fajas|maq,ele
Operación de sala de control|ele,gen
Limpieza de canaletas de relave en planta|agua,ord,pres
Operación de planta de agua|quim,pres
Operación de compresoras de planta|pres,ele,hig
Embolsado y despacho de concentrado|man,mont,hig
Pesaje y despacho de camiones de concentrado|veh,man`,
    MET: `Operación de tanques de lixiviación|quim,conf,alt
Recepción y almacenamiento de cianuro de sodio|quim,mont,man
Preparación de solución cianurada|quim,conf
Operación de columnas de carbón activado|quim,pres
Desorción y regeneración de carbón|quim,inc,cal
Electrodeposición de oro y plata|quim,ele
Fundición de precipitados en horno|cal,quim,hig
Refinación de metales preciosos|quim,cal
Operación de planta Merrill Crowe|quim,pres,blq
Manejo de ácido sulfúrico|quim,pres
Operación de planta de destrucción de cianuro|quim,pres
Manejo de peróxido de hidrógeno|quim,inc
Lixiviación en pilas|quim,eqp,agua
Riego de pilas de lixiviación|quim,pres,agua
Instalación de geomembrana|cal,man,her
Operación de horno de retorta de mercurio|quim,cal,hig
Operación de planta de tostación|cal,quim,hig
Colado de barras doré|cal,quim,iza
Manipulación de escoria de fundición|cal,man
Limpieza de tanques de solución|conf,quim,blq
Muestreo de soluciones de proceso|lab,quim
Operación de planta de cal|quim,hig,maq`,
    MMC: `Inspección y diagnóstico de equipos|blq,gen
Lubricación de equipos de planta|blq,quim
Cambio de aceite de motor|blq,quim,amb
Cambio de filtros de combustible y aceite|blq,quim,amb
Reparación de sistema hidráulico|pres,blq
Cambio de mangueras hidráulicas|pres,blq
Cambio de componentes mayores (motor, transmisión)|iza,blq,man
Reparación de tren de rodamiento|iza,blq,her
Alineamiento de ejes y acoplamientos|blq,her
Cambio de rodamientos|blq,her,man
Mantenimiento de reductores|blq,iza
Mantenimiento de compresoras|pres,blq,ele
Mantenimiento de bombas|pres,blq
Mantenimiento de ventiladores principales|blq,iza,alt
Mantenimiento de chancadoras|blq,iza,maq
Mantenimiento de molinos|blq,iza,conf
Mantenimiento de fajas transportadoras|blq,maq
Mantenimiento de equipos de bajo perfil|blq,eqp
Mantenimiento de camiones mineros|blq,eqp,alt
Mantenimiento de palas y excavadoras|blq,eqp,iza,alt
Lavado de equipos con hidrolavadora|pres,ord,amb
Mantenimiento de puentes grúa|alt,blq,iza
Mantenimiento de sistemas de frenos|blq,eqp
Reparación de cucharones y tolvas|cal,iza,blq
Desmontaje y montaje de cilindros hidráulicos|pres,iza,blq
Calibración de válvulas|blq,her
Prueba de equipos post-mantenimiento|eqp,blq
Mantenimiento de sistemas de supresión de incendios|inc,pres,blq
Mantenimiento de grupos electrógenos|ele,blq,inc
Mantenimiento de calderos|pres,cal,blq
Mantenimiento de tanques de almacenamiento|conf,alt,blq
Fabricación de piezas en torno|maq,her
Fabricación de piezas en fresadora|maq,her
Trabajos en taller mecánico|her,maq,ord
Mantenimiento de equipos de perforación|perf,blq
Mantenimiento de scooptram|eqp,blq
Mantenimiento de jumbos|eqp,blq,perf
Mantenimiento de volquetes|eqp,blq,alt`,
    MEL: `Mantenimiento de tableros eléctricos de baja tensión|ele,blq
Mantenimiento de tableros de media tensión|ele,blq
Mantenimiento de motores eléctricos|ele,blq,iza
Instalación de luminarias|ele,alt
Tendido de cables eléctricos|ele,man,alt
Empalme de cables de media tensión|ele,blq
Instalación de puesta a tierra|ele,exc
Medición de resistencia de puesta a tierra|ele
Mantenimiento de variadores de velocidad|ele,blq
Mantenimiento de arrancadores|ele,blq
Termografía de equipos eléctricos|ele
Mantenimiento de UPS y bancos de baterías|ele,quim
Calibración de instrumentos de proceso|ele,pres
Mantenimiento de sensores y transmisores|ele,alt
Mantenimiento de PLC y sistemas de control|ele
Instalación de bandejas portacables|ele,alt,her
Mantenimiento de alumbrado público|ele,alt,and
Instalación de tomacorrientes y circuitos|ele,her
Mantenimiento de sistemas de comunicación|ele,alt
Instalación de cámaras y fibra óptica|ele,alt
Mantenimiento de sistemas contra incendio (detección)|ele,inc
Mantenimiento de transformadores|ele,blq,quim
Lectura de medidores|ele
Pruebas eléctricas de aislamiento (megado)|ele,blq
Instalación eléctrica en interior mina|ele,sub,alt
Mantenimiento de cargadores de lámparas mineras|ele,quim
Mantenimiento eléctrico de equipos móviles|ele,eqp,blq
Instalación de pararrayos|ele,alt
Mantenimiento de bombas sumergibles|ele,pres,agua`,
    CON: `Trazo y replanteo topográfico|gen,ord
Excavación manual de zanjas|exc,man,her
Excavación con maquinaria|exc,eqp
Relleno y compactación con plancha|exc,her,hig
Compactación con rodillo|eqp,exc
Encofrado de columnas y muros|conc,her,alt
Desencofrado|conc,her,man
Armado de acero de refuerzo|conc,man,her
Vaciado de concreto con mixer|conc,eqp
Vaciado de concreto con bomba|conc,pres,eqp
Vibrado de concreto|conc,ele
Curado de concreto|conc,quim
Albañilería y asentado de ladrillos|conc,man,and
Tarrajeo de muros|conc,and
Instalación de cobertura metálica|alt,iza,her
Montaje de estructuras metálicas|alt,iza,cal
Armado y desarmado de andamios|and,alt,man
Instalación de drywall|her,and
Pintura de interiores|quim,and,ord
Pintura de estructuras en altura|alt,quim,and
Instalación de pisos y cerámicos|her,man,hig
Demolición manual|her,hig,man
Demolición con equipo|eqp,hig
Construcción de muros de contención|conc,exc
Construcción de cunetas y alcantarillas|exc,conc
Instalación de geomembranas en obra|cal,man
Colocación de gaviones|man,agua
Impermeabilización de techos|alt,quim,cal
Instalación de carpintería metálica|her,cal
Instalación de carpintería de madera|her,man
Instalación de vidrios y ventanas|man,alt,her
Construcción de veredas y pavimentos|conc,eqp
Asfaltado de vías|eqp,quim,cal
Señalización de vías|veh,quim
Construcción de campamentos modulares|iza,alt,her
Perforación con rotomartillo|her,hig
Corte de concreto con cortadora|her,hig
Mezclado de concreto con trompo|conc,maq,ele
Transporte de materiales con carretilla|man,ord
Construcción de cimentaciones|exc,conc
Instalación de mallas perimétricas|her,man,exc
Montaje de tanques metálicos|iza,alt,cal`,
    SOL: `Soldadura por arco eléctrico (SMAW)|cal,ele
Soldadura MIG/MAG|cal,ele,inc
Soldadura TIG|cal,ele
Soldadura en altura|cal,alt
Soldadura en espacios confinados|cal,conf
Corte con oxiacetileno|cal,inc
Corte con plasma|cal,ele
Esmerilado de piezas|her,cal
Biselado de tuberías|cal,her
Soldadura de tuberías|cal,pres
Termofusión de tuberías HDPE|cal,pres
Electrofusión de tuberías HDPE|cal,ele,pres
Soldadura de recubrimiento duro (hardfacing)|cal,eqp
Reparación de cucharones por soldadura|cal,iza,eqp
Fabricación de estructuras metálicas|cal,iza,her
Habilitación de planchas metálicas|cal,man,her
Rolado de planchas|maq,man
Doblado de planchas|maq,man
Taladrado de estructuras|her,maq
Precalentamiento de piezas|cal,inc
Arenado de estructuras|pres,hig
Pintura industrial con pistola|quim,pres,hig
Inspección de soldaduras con tintes penetrantes|quim,cal
Manejo de cilindros de gases comprimidos|inc,man,cal
Trabajos en taller de maestranza|her,maq,cal`,
    GAS: `Instalación de tuberías de agua potable|pres,her
Reparación de fugas de agua|pres,her
Instalación de tuberías de desagüe|pres,exc
Desatoro de redes de desagüe|pres,conf,hig
Limpieza de buzones|conf,pres
Instalación de aparatos sanitarios|her,man
Instalación de termas eléctricas|ele,pres
Mantenimiento de termas y calentadores|ele,pres,cal
Instalación de tanques elevados|alt,iza,pres
Limpieza y desinfección de tanques de agua|conf,quim,alt
Instalación de bombas de agua|pres,ele
Mantenimiento de redes contra incendio|pres,inc
Instalación de tuberías de aire comprimido|pres,alt
Instalación de redes de gas GLP|inc,pres
Mantenimiento de plantas de tratamiento de agua residual|pres,quim,conf
Roscado de tuberías|her,maq
Pegado de tuberías PVC|quim,her
Pruebas hidráulicas de redes|pres
Instalación de válvulas y accesorios|pres,her
Mantenimiento de trampas de grasa|conf,amb
Instalación de duchas de emergencia y lavaojos|pres,her`,
    HER: `Uso de amoladora angular|her,cal
Uso de esmeril de banco|her,maq
Uso de taladro eléctrico|her,ele
Uso de rotomartillo|her,hig
Uso de sierra circular|her,maq
Uso de sierra caladora|her
Uso de tronzadora|her,cal
Uso de cortadora de concreto|her,hig
Uso de pistola de impacto neumática|her,pres
Uso de llave de impacto eléctrica|her,ele
Uso de herramientas manuales|her
Uso de hidrolavadora|pres,her
Uso de compresora portátil|pres,hig
Uso de generador portátil|ele,inc
Uso de gata hidráulica|neu,pres
Uso de torquímetro y multiplicador de torque|her,pres
Uso de pistola de calor|her,cal
Uso de motosierra|her,hig
Uso de desbrozadora|her,hig
Uso de plancha compactadora|her,hig
Uso de vibrador de concreto|her,conc,ele
Uso de extensiones eléctricas|ele,her
Uso de pistola fulminante (de clavos)|her,exp
Uso de remachadora|her
Uso de escaleras portátiles|alt,her`,
    AMB: `Monitoreo de calidad de agua|amb,agua
Monitoreo de calidad de aire|amb,hig
Monitoreo de ruido ambiental|amb,hig
Muestreo de suelos|amb,her
Gestión de residuos sólidos|amb,man
Recolección y transporte de residuos peligrosos|amb,quim,veh
Manejo de almacén central de residuos|amb,quim,mont
Respuesta ante derrames|amb,quim
Revegetación de áreas disturbadas|amb,her,man
Reforestación|amb,her
Monitoreo de flora y fauna|amb,veh
Mantenimiento de canales de coronación|amb,agua,exc
Operación de planta de tratamiento de agua de mina|amb,quim,pres
Control de erosión|amb,exc
Mantenimiento de pozas de sedimentación|amb,agua,eqp
Compostaje de residuos orgánicos|amb,man
Inspección ambiental de áreas|amb,ord
Cierre de componentes mineros|amb,eqp,exc
Monitoreo de efluentes|amb,agua,quim
Riego de áreas revegetadas|amb,agua`,
    LAB: `Recepción y codificación de muestras|lab,man
Secado de muestras en horno|lab,cal
Chancado de muestras|lab,maq,hig
Pulverizado de muestras|lab,maq,hig
Cuarteo de muestras|lab,hig
Ensayo al fuego (fundición)|lab,cal,quim
Copelación|lab,cal,quim
Digestión ácida|lab,quim
Análisis por absorción atómica|lab,quim,inc
Análisis volumétrico|lab,quim
Preparación de reactivos de laboratorio|lab,quim
Manejo de residuos de laboratorio|lab,amb,quim
Pruebas metalúrgicas|lab,quim,maq
Análisis granulométrico|lab,maq
Limpieza de laboratorio|lab,ord,quim
Manejo de cilindros de gases de laboratorio|lab,inc`,
    LOG: `Recepción de materiales en almacén|man,mont
Despacho de materiales|man,mont
Almacenamiento en racks|mont,alt,man
Operación de montacargas|mont
Carga y descarga de camiones|mont,iza,man
Almacenamiento de materiales peligrosos|quim,mont
Almacenamiento de combustibles y lubricantes|inc,quim
Inventario de almacén|man,alt,ord
Despacho de combustible en grifo|inc,quim,veh
Manejo de cilindros de gas|inc,man
Almacenamiento de explosivos en polvorín|exp,man
Estiba y desestiba de carga|man,mont
Uso de transpaleta|mont,man
Embalaje de materiales|man,her
Recepción de bolas de molienda|iza,mont,man
Manejo de neumáticos en almacén|neu,mont,man`,
    TRA: `Conducción de camioneta en la unidad|veh
Conducción de camioneta en carretera|veh
Transporte de personal en bus|veh
Transporte de personal en combi|veh
Conducción en condiciones de neblina y nieve|veh
Conducción nocturna|veh
Transporte de materiales peligrosos|veh,quim
Transporte de concentrado|veh,hig
Transporte de cianuro|veh,quim
Transporte de combustible|veh,inc
Transporte de carga sobredimensionada|veh,iza
Remolque de vehículos|veh,eqp
Cambio de llantas de vehículo liviano|neu,veh
Cambio de llantas de equipo pesado|neu,iza
Inflado de neumáticos|neu,pres
Vulcanizado de neumáticos|neu,quim,cal
Lavado de vehículos|pres,ord
Inspección de vehículos|veh
Conducción de ambulancia|veh,gen
Conducción de cisterna de agua|veh,eqp,agua`,
    GEO: `Perforación diamantina en superficie|perf,eqp,hig
Perforación diamantina en interior mina|perf,sub
Traslado e instalación de máquina diamantina|perf,iza,eqp
Preparación de plataformas de perforación|exc,eqp,perf
Preparación de lodos de perforación|perf,quim
Cambio de barras de perforación|perf,iza,man
Logueo geológico de testigos|gen,man,ord
Corte de testigos con sierra diamantina|her,maq,hig
Muestreo de testigos|man,hig
Almacenamiento de cajas de testigos|man,mont
Levantamiento topográfico en superficie|veh,gen
Levantamiento topográfico en interior mina|sub,gen
Mapeo geológico en superficie|veh,gen
Muestreo geoquímico|her,man
Uso de drones para topografía|gen,veh
Instalación de instrumentos geotécnicos|perf,ele,exc
Lectura de piezómetros e inclinómetros|agua,gen
Cierre de pozas de lodos|amb,exc`,
    IZA: `Izaje con grúa telescópica|iza
Izaje con grúa de celosía|iza,alt
Izaje con camión grúa|iza,veh
Izaje con puente grúa|iza,mont
Izaje con tecle de cadena|iza,man
Izaje con tirfor|iza,man
Izaje crítico con dos grúas|iza
Rigging y estrobado de cargas|iza,man
Montaje de equipos mayores|iza,alt
Desmontaje de equipos mayores|iza,blq
Traslado de cargas con montacargas|mont,iza
Izaje de personal con canastilla|iza,alt
Armado y desarmado de grúas|iza,alt
Inspección de accesorios de izaje|iza`,
    REL: `Operación de presa de relaves|agua,eqp
Recrecimiento de presa de relaves|agua,eqp,exc
Operación de balsa de bombeo en presa|agua,pres,ele
Instalación de tuberías de relave|pres,cal,agua
Mantenimiento de tuberías de relave|pres,blq,agua
Operación de cicloneo de relaves|pres,agua
Monitoreo de piezómetros en presa|agua,gen
Operación de bocatoma y captación de agua|agua,pres
Limpieza de canales de derivación|agua,man,her
Operación de planta de bombeo de agua fresca|pres,ele,agua
Mantenimiento de reservorios|agua,conf,amb
Trabajos sobre plataformas flotantes|agua,alt
Desembalse y limpieza de pozas|agua,eqp,amb`,
    ENE: `Operación de subestación eléctrica|ele,blq
Maniobras en celdas de media tensión|ele,blq
Mantenimiento de líneas de transmisión|ele,alt
Poda de árboles cerca de líneas eléctricas|ele,alt,her
Mantenimiento de postes y crucetas|ele,alt,iza
Operación de central hidroeléctrica|ele,pres,agua
Operación de grupos electrógenos|ele,inc,hig
Mantenimiento de paneles solares|ele,alt
Mantenimiento de bancos de condensadores|ele,blq
Operación de sala de tableros principales|ele`,
    SER: `Limpieza de oficinas|ord,quim
Limpieza de campamentos y habitaciones|ord,quim
Limpieza de servicios higiénicos|ord,quim
Preparación de alimentos en cocina|inc,her,ord
Uso de equipos de cocina industrial|inc,cal,maq
Atención en comedor|ord,man
Lavandería industrial|maq,quim,cal
Mantenimiento de jardines|her,hig
Fumigación y control de plagas|quim,hig
Vigilancia y control de accesos|veh,gen
Mantenimiento de áreas comunes|her,ord
Trabajo en oficina y uso de computadoras|man,ord
Recojo de residuos de campamento|amb,man
Mantenimiento de piscinas y gimnasio|quim,ord
Atención en tópico y centro médico|quim,gen`,
    SEG: `Inspecciones de seguridad en campo|gen,ord
Respuesta ante emergencias|inc,gen
Rescate en espacios confinados|conf,iza
Rescate en altura|alt,iza
Rescate vehicular|veh,her
Rescate minero|sub,conf
Combate de incendios|inc
Inspección y recarga de extintores|inc,pres
Monitoreo de agentes ocupacionales|hig,gen
Capacitación en campo|gen,ord
Simulacros de emergencia|gen,inc
Atención de primeros auxilios|gen`
  };
  // Combinaciones equipo × actividad (tareas reales de flota y planta)
  const C = [
    ["MSU", ["scooptram","jumbo frontonero","jumbo empernador (bolter)","scaler","camión de bajo perfil (dumper)","mixer de bajo perfil","robot lanzador de shotcrete","cargador de ANFO","equipo utilitario","telehandler","locomotora","winche eléctrico","volquete en interior mina","camión de servicio","plataforma tijera en interior mina"],
     ["Operación de","Inspección pre-uso de","Abastecimiento de combustible de","Traslado de","Lavado de","Remolque de"], {"Operación de":"eqp,sub","Inspección pre-uso de":"eqp,gen","Abastecimiento de combustible de":"inc,eqp","Traslado de":"eqp,veh,sub","Lavado de":"pres,ord","Remolque de":"eqp,iza"}],
    ["MTA", ["pala hidráulica","excavadora","cargador frontal","volquete","camión minero","tractor de orugas","tractor sobre llantas","motoniveladora","rodillo compactador","perforadora DTH","cisterna de agua","camión lubricador","retroexcavadora","minicargador"],
     ["Operación de","Inspección pre-uso de","Abastecimiento de combustible de","Lavado de","Estacionamiento y parqueo de"], {"Operación de":"eqp","Inspección pre-uso de":"eqp,gen","Abastecimiento de combustible de":"inc,eqp","Lavado de":"pres,ord","Estacionamiento y parqueo de":"eqp,veh"}],
    ["MMC", ["scooptram","jumbo","camión de bajo perfil","pala hidráulica","excavadora","cargador frontal","volquete","camión minero","tractor de orugas","motoniveladora","perforadora DTH","compresora estacionaria","bomba de pulpa","chancadora","molino","faja transportadora","grupo electrógeno","montacargas","camioneta","bus de personal"],
     ["Mantenimiento preventivo de","Mantenimiento correctivo de","Cambio de componentes de","Reparación de sistema hidráulico de","Soldadura de reparación en"], {"Mantenimiento preventivo de":"blq,her","Mantenimiento correctivo de":"blq,her,iza","Cambio de componentes de":"blq,iza,man","Reparación de sistema hidráulico de":"pres,blq","Soldadura de reparación en":"cal,blq"}],
    ["PLC", ["chancadora primaria","chancadora cónica","molino de bolas","molino SAG","celda de flotación","espesador","filtro prensa","faja transportadora","zaranda vibratoria","bomba de pulpa","hidrociclón","tanque agitador","alimentador de placas","tolva de gruesos","tolva de finos"],
     ["Inspección operativa de","Limpieza de","Bloqueo y desbloqueo de","Arranque y parada de"], {"Inspección operativa de":"maq,ord","Limpieza de":"maq,blq,ord","Bloqueo y desbloqueo de":"blq,ele","Arranque y parada de":"maq,ele"}],
    ["MEL", ["motor eléctrico","tablero de distribución","variador de frecuencia","transformador","celda de media tensión","banco de baterías","sistema de alumbrado","sistema de puesta a tierra","sensor de nivel","medidor de flujo","sistema de control distribuido","cargador de baterías"],
     ["Mantenimiento preventivo de","Mantenimiento correctivo de","Instalación de","Pruebas y puesta en servicio de"], {"Mantenimiento preventivo de":"ele,blq","Mantenimiento correctivo de":"ele,blq","Instalación de":"ele,her,alt","Pruebas y puesta en servicio de":"ele,blq"}],
    ["SOL", ["acero estructural","acero inoxidable","tubería de acero al carbono","planchas antidesgaste","chutes y tolvas","tanques metálicos","barandas y escaleras","rieles"],
     ["Soldadura de","Corte de","Esmerilado de","Reparación de"], {"Soldadura de":"cal,ele","Corte de":"cal,inc","Esmerilado de":"her,cal","Reparación de":"cal,her,iza"}],
    ["CON", ["oficinas","talleres","almacenes","campamentos","comedores","subestaciones","plataformas","muros","losas","tanques de concreto","canales","caminos de acceso"],
     ["Construcción de","Mantenimiento de","Demolición de"], {"Construcción de":"conc,exc,her","Mantenimiento de":"her,and,ord","Demolición de":"her,hig,eqp"}],
    ["GAS", ["red de agua potable","red de desagüe","red de agua industrial","red contra incendio","red de aire comprimido","sistema de bombeo","tanque de agua","planta de tratamiento"],
     ["Instalación de","Mantenimiento de","Reparación de"], {"Instalación de":"pres,her,exc","Mantenimiento de":"pres,blq","Reparación de":"pres,her"}],
    ["IZA", ["bolas de molienda","motores eléctricos","bombas","liners de molino","neumáticos gigantes","estructuras metálicas","tuberías","contenedores","módulos de campamento","componentes de chancadora"],
     ["Izaje de","Traslado y estiba de"], {"Izaje de":"iza","Traslado y estiba de":"iza,mont,man"}],
    ["MET", ["tanque de lixiviación","columna de carbón activado","horno de fundición","celda electrolítica","filtro clarificador","tanque de solución rica","bomba dosificadora de cianuro","reactor de destrucción de cianuro","horno de regeneración de carbón"],
     ["Operación de","Limpieza de","Mantenimiento de"], {"Operación de":"quim,maq","Limpieza de":"quim,conf,blq","Mantenimiento de":"quim,blq,her"}],
    ["HER", ["amoladora de 4½\"","amoladora de 7\"","taladro percutor","rotomartillo","sierra circular","tronzadora","esmeril de banco","pistola de impacto","llave de impacto","hidrolavadora","compresora portátil","generador portátil"],
     ["Inspección y código de color de","Cambio de accesorios (discos, brocas) de"], {"Inspección y código de color de":"her,ele","Cambio de accesorios (discos, brocas) de":"her,blq"}],
    ["LAB", ["horno de secado","chancadora de quijada de laboratorio","pulverizador de anillos","horno de copelación","espectrofotómetro de absorción atómica","campana extractora"],
     ["Operación de","Limpieza y mantenimiento de"], {"Operación de":"lab,maq","Limpieza y mantenimiento de":"lab,blq,ord"}],
    ["TRA", ["camioneta 4x4","bus","combi","camión de carga","cisterna de combustible","camión grúa","ambulancia","camión de bomberos"],
     ["Inspección pre-uso de","Conducción de","Mantenimiento básico de"], {"Inspección pre-uso de":"veh,gen","Conducción de":"veh","Mantenimiento básico de":"blq,veh,neu"}]
  ];
  const L = [];
  const add = (a, n, f) => { const k = (L.filter(x => x.a === a).length + 1); L.push({ c: `PETS-${a}-${String(k).padStart(3, "0")}`, n, a, f: f.split(",") }); };
  for (const a in F) F[a].split("\n").forEach(l => { const [n, f] = l.split("|"); add(a, n.trim(), f.trim()); });
  C.forEach(([a, eqs, acts, fam]) => eqs.forEach(e => acts.forEach(ac => add(a, `${ac} ${e}`, fam[ac]))));
  window.AREAS_PETS = AREAS;
  window.PETS = L;
  window.PETS_MAP = Object.fromEntries(L.map(p => [p.c, p]));
})();
