/* Flujo del trabajador: buscar → confirmar DNI → examen → resultado → firma → constancia */
(function () {
  const V = ["inicio", "confirmar", "examen", "resultado", "constancia"];
  const ver = v => { V.forEach(x => $("#v-" + x).classList.toggle("hide", x !== v)); window.scrollTo(0, 0); document.body.classList.toggle("exam", v === "examen"); };
  const qs = new URLSearchParams(location.search);
  let jornada = null, part = null, dni = "", EX = null, st = null, offset = 0, tick = null, enviando = false, activo = false;
  const KEY = () => `evx_${part.id}_${part.intento}`;
  const guardar = () => { try { localStorage.setItem(KEY(), JSON.stringify(st)); } catch (e) {} };

  /* ---------- constancia pública por código ---------- */
  if (qs.get("c")) { mostrarConstancia(qs.get("c")); return; }

  async function mostrarConstancia(cod) {
    ver("constancia");
    const box = $("#v-constancia");
    box.innerHTML = `<div class="wrap center"><span class="spin"></span></div>`;
    try {
      await cargarPropios();
      const d = await rpc("eval_constancia", { p_codigo: cod });
      if (!d) { box.innerHTML = `<div class="wrap"><div class="card center"><h3>Constancia no encontrada</h3><p class="muted">Verifica el código: ${esc(cod)}</p></div></div>`; return; }
      d.pets_nombre_res = resolverPets(d.pets_codigo, d.pets_nombre, d.cargo).n;
      box.innerHTML = `<div class="wrap noprint center" style="padding-bottom:0"><span class="tag tag-ok">✔ Constancia válida y registrada</span>
        <div class="row" style="justify-content:center;margin-top:10px"><button class="btn btn-dark" onclick="window.print()">🖨 Imprimir / Guardar PDF</button></div></div>` + htmlConstancia(d);
    } catch (e) { box.innerHTML = `<div class="wrap"><div class="card center">${esc(e.message)}</div></div>`; }
  }

  /* ---------- inicio ---------- */
  $("#chipFecha").textContent = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "2-digit", month: "short", timeZone: "America/Lima" });
  (async function cargarJornadas() {
    const box = $("#jornadaBox");
    try {
      cargarPropios();
      const l = await rpc("eval_jornadas_activas");
      const pedida = qs.get("j");
      let lista = l || [];
      if (pedida) lista = lista.filter(x => x.id === pedida).concat(lista.filter(x => x.id !== pedida));
      if (!lista.length) { box.innerHTML = `<div class="center" style="padding:10px"><div style="font-size:40px">📅</div><h3 style="font-size:22px;margin:6px 0">No hay evaluación abierta hoy</h3><p class="muted small">Consulta con el personal de Seguridad. Las evaluaciones se habilitan el día programado.</p></div>`; return; }
      const pintar = j => { jornada = j; box.innerHTML = `<span class="lbl">Evaluación</span><div class="row" style="margin-bottom:14px"><div class="grow"><b style="font-size:17px">${esc(j.titulo)}</b><div class="muted small">${fFecha(j.fecha)} · ${j.n} inscritos</div></div>${lista.length > 1 ? `<select id="selJ" class="inp" style="width:auto;padding:8px">${lista.map(x => `<option value="${x.id}" ${x.id === j.id ? "selected" : ""}>${fCorta(x.fecha)} · ${esc(x.titulo)}</option>`).join("")}</select>` : ""}</div>`;
        const s = $("#selJ"); if (s) s.onchange = () => pintar(lista.find(x => x.id === s.value));
        $("#buscarBox").classList.remove("hide"); $("#q").value = ""; $("#resultados").innerHTML = ""; };
      pintar(lista[0]);
    } catch (e) { box.innerHTML = `<div class="center"><p>${esc(e.message)}</p><button class="btn btn-gold" onclick="location.reload()">Reintentar</button></div>`; }
  })();

  let tq;
  $("#q").addEventListener("input", e => {
    clearTimeout(tq); const v = e.target.value.trim(); const out = $("#resultados");
    if (v.length < 3) { out.innerHTML = v ? `<div class="muted small">Escribe al menos 3 letras…</div>` : ""; return; }
    out.innerHTML = `<div class="row muted small"><span class="spin"></span> Buscando…</div>`;
    tq = setTimeout(async () => {
      try {
        const l = await rpc("eval_buscar", { p_jornada: jornada.id, p_q: v });
        if (!l.length) { out.innerHTML = `<div class="muted small">No se encontró. Revisa cómo escribiste tu apellido o busca con tu DNI. Si no figuras, avisa al evaluador.</div>`; return; }
        out.innerHTML = l.map(p => `<button class="res" data-id="${p.id}"><span class="av">${esc(p.nombres.split(" ").slice(0, 2).map(w => w[0]).join(""))}</span><span class="grow"><b>${esc(p.nombres)}</b><small>${esc(p.empresa || "")} · ${esc(p.cargo || "")}</small></span>${p.estado === "finalizado" ? `<span class="tag tag-ok">Rendido</span>` : p.estado === "en_curso" ? `<span class="tag tag-mid">En curso</span>` : ""}</button>`).join("");
        $$(".res", out).forEach(b => b.onclick = () => elegir(l.find(x => x.id === b.dataset.id)));
      } catch (er) { out.innerHTML = `<div class="small" style="color:var(--bad)">${esc(er.message)}</div>`; }
    }, 350);
  });

  function elegir(p) {
    part = p; ver("confirmar");
    $("#cNombre").textContent = p.nombres;
    $("#cSub").textContent = (p.empresa || "") + " · " + (p.cargo || "");
    $("#cDatos").innerHTML = `<dt>Empresa</dt><dd>${esc(p.empresa || "—")}</dd><dt>Cargo</dt><dd>${esc(p.cargo || "—")}</dd><dt>Fecha</dt><dd>${fFecha(jornada.fecha)}</dd><dt>DNI</dt><dd class="muted">Confírmalo abajo para ver tus datos completos</dd>`;
    $("#dni").value = ""; $("#dniMsg").textContent = ""; $("#acepto").checked = false; $("#btnIniciar").disabled = true;
    $("#reglasCard").classList.toggle("hide", p.estado === "finalizado");
    if (p.estado === "finalizado") $("#dniMsg").innerHTML = `<span style="color:var(--ink)">Ya rendiste este examen. Escribe tu DNI para ver tu resultado.</span>`;
    setTimeout(() => $("#dni").focus(), 200);
  }
  $("#btnVolver").onclick = () => ver("inicio");

  let td;
  $("#dni").addEventListener("input", e => {
    clearTimeout(td); const v = e.target.value.replace(/\D/g, ""); e.target.value = v;
    $("#btnIniciar").disabled = true;
    if (v.length < 8) { $("#dniMsg").textContent = ""; return; }
    td = setTimeout(async () => {
      try {
        const d = await rpc("eval_iniciar", { p_id: part.id, p_dni: v, p_comenzar: false });
        dni = v; part = d; $("#dniMsg").textContent = "";
        const pets = resolverPets(d.pets_codigo, d.pets_nombre, d.cargo);
        $("#cDatos").innerHTML = `<dt>DNI</dt><dd>${esc(d.dni)} ✔</dd><dt>Empresa</dt><dd>${esc(d.empresa || "—")} <span class="tag tag-n">${esc(d.tipo || "")}</span></dd><dt>Cargo</dt><dd>${esc(d.cargo || "—")}</dd><dt>PETS</dt><dd>${esc(pets.c)}<br><span class="small muted">${esc(pets.n)}</span></dd><dt>Fecha</dt><dd>${fFecha(d.fecha)}</dd>`;
        if (d.estado === "finalizado") return irResultado({ ...d });
        if (d.estado === "en_curso") { $("#btnIniciar").textContent = "▶ Continuar examen"; $("#acepto").checked = true; }
        $("#btnIniciar").disabled = !$("#acepto").checked;
      } catch (er) { $("#dniMsg").textContent = er.message; }
    }, 300);
  });
  $("#acepto").onchange = () => { $("#btnIniciar").disabled = !($("#acepto").checked && dni); };

  $("#btnIniciar").onclick = async () => {
    const b = $("#btnIniciar"); b.disabled = true; b.innerHTML = `<span class="spin"></span>`;
    try { await document.documentElement.requestFullscreen?.({ navigationUI: "hide" }); } catch (e) {}
    try {
      const d = await rpc("eval_iniciar", { p_id: part.id, p_dni: dni, p_comenzar: true });
      part = d; offset = Date.now() - new Date(d.ahora).getTime();
      await cargarPropios();
      EX = armarExamen(d);
      let prev = null; try { prev = JSON.parse(localStorage.getItem(KEY())); } catch (e) {}
      st = prev && prev.r && prev.r.length === EX.preguntas.length ? prev : { r: Array(EX.preguntas.length).fill(null), f: Array(EX.preguntas.length).fill(false), i: 0, salidas: 0, reanudado: 0 };
      if (prev) { st.reanudado = (st.reanudado || 0) + 1; st.salidas++; }
      guardar(); empezar();
      if (prev) alerta("🔄", "Examen reanudado", `Tu tiempo siguió corriendo. Salidas registradas: <b>${st.salidas} de ${CFG.maxSalidas}</b>.`);
    } catch (er) { toast(er.message, "err"); b.disabled = false; b.textContent = "▶ Iniciar examen"; }
  };

  /* ---------- examen ---------- */
  function empezar() {
    ver("examen"); activo = true;
    $("#xNombre").textContent = part.nombres;
    $("#xInfo").textContent = `DNI ${part.dni} · ${EX.pets.c}`;
    $("#wm").innerHTML = Array(40).fill(`${esc(part.nombres)} · ${esc(part.dni)} · ${fCorta(part.fecha)} &nbsp;&nbsp;&nbsp; `.repeat(6)).join("<br>");
    history.pushState({ ex: 1 }, ""); history.pushState({ ex: 1 }, "");
    pintar(); tick = setInterval(reloj, 500); reloj();
  }
  const restante = () => CFG.minutos * 60000 - (Date.now() - offset - new Date(part.inicio).getTime());
  function reloj() {
    const ms = restante(); const t = $("#timer");
    if (ms <= 0) { t.textContent = "00:00"; if (!enviando) enviar("tiempo"); return; }
    const m = Math.floor(ms / 60000), s = Math.floor(ms % 60000 / 1000);
    t.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    t.classList.toggle("low", ms < 5 * 60000);
  }
  const LET = "ABCD";
  function pintar() {
    const i = st.i, p = EX.preguntas[i], sec = CFG.secciones.find(s => s.k === p.s);
    $("#qSec").textContent = sec.n;
    $("#qNum").textContent = `Pregunta ${i + 1} de ${EX.preguntas.length}`;
    $("#qTxt").textContent = p.t;
    $("#qOpts").innerHTML = p.o.map((o, k) => `<button class="opt ${st.r[i] === k ? "sel" : ""}" data-k="${k}"><span class="lt">${LET[k]}</span><span>${esc(o)}</span></button>`).join("");
    $$(".opt").forEach(b => b.onclick = () => { st.r[i] = +b.dataset.k; guardar(); pintar(); });
    const n = st.r.filter(x => x !== null).length;
    $("#qCont").textContent = `${n}/${EX.preguntas.length} respondidas`;
    $("#progBar").style.width = (n * 100 / EX.preguntas.length) + "%";
    $("#bFlag").classList.toggle("on", st.f[i]);
    $("#bPrev").disabled = i === 0;
    const ult = i === EX.preguntas.length - 1;
    $("#bNext").textContent = ult ? "Finalizar ✓" : "Siguiente ›";
    $("#bNext").className = "btn grow " + (ult ? "btn-ok" : "btn-gold");
    const c = $("#qCard"); c.style.animation = "none"; c.offsetHeight; c.style.animation = "";
  }
  const ir = i => { st.i = Math.max(0, Math.min(EX.preguntas.length - 1, i)); guardar(); pintar(); window.scrollTo(0, 0); };
  $("#bPrev").onclick = () => ir(st.i - 1);
  $("#bNext").onclick = () => st.i === EX.preguntas.length - 1 ? panel(true) : ir(st.i + 1);
  $("#bFlag").onclick = () => { st.f[st.i] = !st.f[st.i]; guardar(); pintar(); };
  $("#bGrid").onclick = () => panel(false);

  function panel(fin) {
    const sin = st.r.filter(x => x === null).length, fl = st.f.filter(Boolean).length;
    const d = document.createElement("div"); d.className = "drawer";
    d.innerHTML = `<div class="pan"><div class="row"><h3 class="grow" style="font-size:22px">${fin ? "¿Finalizar el examen?" : "Tus preguntas"}</h3><button class="btn btn-line" data-x>✕</button></div>
      <div class="legend" style="margin-top:8px"><span><i style="background:var(--ink)"></i>Respondida</span><span><i style="background:#fff;border:2px solid var(--line)"></i>Sin responder</span><span><i style="background:var(--warn);border-radius:50%"></i>Para revisar</span></div>
      ${CFG.secciones.map(s => `<div class="small" style="font-weight:700;margin-top:12px;color:var(--gold3)">${esc(s.n)}</div><div class="nums">${EX.preguntas.map((p, k) => p.s !== s.k ? "" : `<button data-k="${k}" class="${st.r[k] !== null ? "ans" : ""} ${st.f[k] ? "fl" : ""} ${k === st.i ? "cur" : ""}">${k + 1}</button>`).join("")}</div>`).join("")}
      <div class="card" style="box-shadow:none;background:${sin ? "#fff2dc" : "var(--ok2)"};margin-top:6px;padding:14px">${sin ? `Te faltan <b>${sin}</b> pregunta(s) por responder.` : "Respondiste todas las preguntas."} ${fl ? `Tienes <b>${fl}</b> marcada(s) para revisar.` : ""}</div>
      <button class="btn btn-ok btn-block" data-fin style="margin-top:12px">✓ Enviar examen y ver mi nota</button></div>`;
    document.body.appendChild(d);
    const cerrar = () => d.remove();
    d.onclick = e => { if (e.target === d) cerrar(); };
    $("[data-x]", d).onclick = cerrar;
    $$("[data-k]", d).forEach(b => b.onclick = () => { cerrar(); ir(+b.dataset.k); });
    $("[data-fin]", d).onclick = () => { cerrar(); confirmar(sin); };
  }
  function confirmar(sin) {
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = `<div class="box"><div class="big">📝</div><h3>¿Enviar el examen?</h3><p class="muted">${sin ? `Aún tienes <b>${sin}</b> sin responder; contarán como incorrectas. ` : ""}Una vez enviado no podrás cambiar tus respuestas.</p><div class="acts"><button class="btn btn-line" data-n>Seguir revisando</button><button class="btn btn-ok" data-s>Sí, enviar</button></div></div>`;
    document.body.appendChild(m);
    $("[data-n]", m).onclick = () => m.remove();
    $("[data-s]", m).onclick = () => { m.remove(); enviar("manual"); };
  }

  async function enviar(motivo) {
    if (enviando) return; enviando = true; activo = false; clearInterval(tick);
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = `<div class="box"><span class="spin" style="width:44px;height:44px;border-width:5px"></span><h3>${motivo === "tiempo" ? "Se acabó el tiempo" : motivo === "salidas" ? "Examen enviado por salidas" : "Enviando examen…"}</h3><p class="muted">Calificando tus respuestas, no cierres la página.</p></div>`;
    document.body.appendChild(m);
    const cal = calificar(EX.preguntas, st.r);
    const resp = EX.preguntas.map((p, k) => ({ s: p.s, t: p.t, o: p.o, c: p.c, r: st.r[k] }));
    for (let intento = 0; intento < 6; intento++) {
      try {
        const r = await rpc("eval_enviar", { p_id: part.id, p_dni: dni, p_resp: { motivo, pets: EX.pets.c, pets_nombre: EX.pets.n, preguntas: resp }, p_correctas: cal.correctas, p_total: cal.total, p_secciones: cal.secciones, p_salidas: st.salidas });
        m.remove(); try { localStorage.removeItem(KEY()); } catch (e) {}
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        return irResultado({ ...part, ...r, secciones: cal.secciones });
      } catch (er) {
        if (er.code === "YA_FINALIZADO") { m.remove(); const d = await rpc("eval_iniciar", { p_id: part.id, p_dni: dni }); return irResultado(d); }
        $("p", m).innerHTML = `Sin conexión. Reintentando… (${intento + 1}/6)<br><small>Tus respuestas están guardadas en este celular.</small>`;
        await new Promise(s => setTimeout(s, 3000));
      }
    }
    $(".box", m).innerHTML = `<div class="big">📶</div><h3>No se pudo enviar</h3><p class="muted">Tus respuestas están guardadas. Busca señal y presiona reintentar.</p><button class="btn btn-gold btn-block" id="reEnv">Reintentar envío</button>`;
    $("#reEnv").onclick = () => { m.remove(); enviando = false; enviar(motivo); };
  }

  /* ---------- antiplagio ---------- */
  let ultSalida = 0;
  function salida(tipo) {
    if (!activo || enviando) return;
    const now = Date.now(); if (now - ultSalida < 2500) return; ultSalida = now;
    st.salidas++; guardar();
    if (st.salidas >= CFG.maxSalidas) { enviar("salidas"); return; }
    alerta("⚠️", "Saliste del examen", `Se registró una salida (<b>${st.salidas} de ${CFG.maxSalidas}</b>). Si llegas a ${CFG.maxSalidas}, tu examen se enviará automáticamente con las respuestas que tengas.`, true);
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) salida("oculto"); });
  window.addEventListener("blur", () => setTimeout(() => { if (!document.hasFocus()) salida("foco"); }, 400));
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && activo) salida("pantalla"); });
  window.addEventListener("popstate", () => { if (activo) { history.pushState({ ex: 1 }, ""); toast("No puedes salir del examen. Usa los botones de abajo.", "err"); } });
  window.addEventListener("beforeunload", e => { if (activo) { e.preventDefault(); e.returnValue = ""; } });
  ["copy", "cut", "paste", "contextmenu", "selectstart", "dragstart"].forEach(ev => document.addEventListener(ev, e => { if (activo) e.preventDefault(); }));
  document.addEventListener("keydown", e => {
    if (!activo) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ["c", "x", "v", "p", "s", "u", "a", "f"].includes(k) || k === "f12" || k === "printscreen") { e.preventDefault(); toast("Acción bloqueada durante el examen", "err"); }
    if (k === "arrowright") ir(st.i + 1); if (k === "arrowleft") ir(st.i - 1);
    if (["1", "2", "3", "4"].includes(k)) { st.r[st.i] = +k - 1; guardar(); pintar(); }
  });
  function alerta(ic, t, msg, pantalla) {
    $$(".modal.alarm").forEach(x => x.remove());
    const m = document.createElement("div"); m.className = "modal alarm";
    m.innerHTML = `<div class="box"><div class="big">${ic}</div><h3>${t}</h3><p class="muted">${msg}</p><button class="btn btn-gold btn-block">Volver al examen</button></div>`;
    document.body.appendChild(m);
    $("button", m).onclick = async () => { m.remove(); if (pantalla && document.documentElement.requestFullscreen && !document.fullscreenElement) { try { await document.documentElement.requestFullscreen(); } catch (e) {} } };
  }

  /* ---------- resultado y firma ---------- */
  function irResultado(d) {
    ver("resultado"); activo = false;
    const pct = d.total ? Math.round(d.correctas * 100 / d.total) : 0;
    $("#rNombre").textContent = d.nombres;
    $("#rSub").textContent = `${d.empresa || ""} · ${d.cargo || ""}`;
    const R = 80, C = 2 * Math.PI * R, col = d.aprobado ? "var(--ok)" : "var(--bad)";
    $("#rRing").innerHTML = `<svg width="190" height="190" viewBox="0 0 190 190"><circle cx="95" cy="95" r="${R}" stroke="#eee6d6" stroke-width="14" fill="none"/><circle id="arc" cx="95" cy="95" r="${R}" stroke="${col}" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.2s ease"/></svg><div class="val"><div><b>${pct}%</b><small>${d.correctas}/${d.total} · Nota ${Number(d.nota).toFixed(1)}</small></div></div>`;
    requestAnimationFrame(() => setTimeout(() => $("#arc").style.strokeDashoffset = C * (1 - pct / 100), 60));
    $("#rVer").className = "verdict " + (d.aprobado ? "ok" : "bad");
    $("#rVer").textContent = d.aprobado ? "¡APROBADO!" : "DESAPROBADO";
    $("#rDet").textContent = d.aprobado ? "Superaste la nota mínima de 75 %. Firma tu constancia." : "No alcanzaste el 75 %. Firma tu constancia y comunícate con el evaluador.";
    const sec = d.secciones || {};
    $("#rBars").innerHTML = CFG.secciones.map(s => { const v = sec[s.k] || [0, s.cant]; return `<div class="bar"><div class="t"><span>${esc(s.n)}</span><span>${v[0]}/${v[1]}</span></div><div class="b"><i style="width:${v[1] ? v[0] * 100 / v[1] : 0}%"></i></div></div>`; }).join("");
    const firmado = !!d.firmado;
    $("#firmaCard").classList.toggle("hide", firmado);
    $("#firmadoCard").classList.toggle("hide", !firmado);
    if (firmado) okFirma(d.codigo); else setTimeout(initFirma, 50);
    part = { ...part, ...d };
  }
  function okFirma(cod) {
    $("#firmaCard").classList.add("hide"); $("#firmadoCard").classList.remove("hide");
    $("#rCod").textContent = cod;
    $("#rVerC").href = "?c=" + encodeURIComponent(cod);
  }
  let trazos = 0, sigX = null;
  function initFirma() {
    const cv = $("#sig"), box = cv.parentElement;
    const medir = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1), w = box.clientWidth, h = box.clientHeight;
      if (!w || !h) return false;
      if (cv.width === Math.round(w * dpr) && sigX) return true;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      sigX = cv.getContext("2d"); sigX.setTransform(dpr, 0, 0, dpr, 0, 0);
      sigX.lineWidth = 2.6; sigX.lineCap = "round"; sigX.lineJoin = "round"; sigX.strokeStyle = "#0b2a6b";
      trazos = 0; $("#sigPh").style.display = ""; return true;
    };
    if (!medir()) { let n = 0; const t = setInterval(() => { if (medir() || ++n > 50) clearInterval(t); }, 150); }
    window.addEventListener("resize", () => { if (!trazos) { sigX = null; medir(); } });
    let dib = false, lp = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.onpointerdown = e => { if (!medir()) return; dib = true; lp = pos(e); try { cv.setPointerCapture(e.pointerId); } catch (er) {} $("#sigPh").style.display = "none"; e.preventDefault(); };
    cv.onpointermove = e => { if (!dib || !sigX) return; const p = pos(e); sigX.beginPath(); sigX.moveTo(...lp); sigX.lineTo(...p); sigX.stroke(); lp = p; trazos++; e.preventDefault(); };
    cv.onpointerup = cv.onpointercancel = cv.onpointerleave = () => dib = false;
    $("#sigClear").onclick = () => { if (sigX) sigX.clearRect(0, 0, cv.width, cv.height); trazos = 0; $("#sigPh").style.display = ""; };
  }
  $("#sigOk").onclick = async () => {
    if (trazos < 15) return toast("Dibuja tu firma en el recuadro", "err");
    if (!$("#sig").width) return toast("Vuelve a dibujar tu firma", "err");
    const cv = $("#sig"), o = document.createElement("canvas"); o.width = 420; o.height = Math.round(420 * cv.height / cv.width);
    const ox = o.getContext("2d"); ox.drawImage(cv, 0, 0, o.width, o.height);
    const b = $("#sigOk"); b.disabled = true; b.innerHTML = `<span class="spin"></span>`;
    try { const r = await rpc("eval_firmar", { p_id: part.id, p_dni: dni, p_firma: o.toDataURL("image/png") }); okFirma(r.codigo); toast("Constancia firmada", "ok"); }
    catch (er) { toast(er.message, "err"); b.disabled = false; b.textContent = "✍ Firmar y generar constancia"; }
  };
})();
