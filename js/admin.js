/* Panel de administración */
(function () {
  let PIN = "", CORREO = "";
  try { const g = JSON.parse(localStorage.getItem("evses") || "null"); if (g && new Date(g.expira) > new Date()) { PIN = g.token; CORREO = g.email; } } catch (e) {}
  let JORNADAS = [], JACT = null, PARTS = [], refT = null;
  const FAMS = Object.entries(BANCO.fam).map(([k, v]) => [k, v.n]);
  const famN = k => (BANCO.fam[k] || {}).n || k;
  const A = async (fn, args = {}) => { try { return await rpc(fn, { p_pin: PIN, ...args }); } catch (e) { if (e.code === "PIN_INCORRECTO") { cerrarSesion(); throw new Error("Tu sesión expiró. Vuelve a ingresar."); } throw e; } };
  function cerrarSesion() { try { localStorage.removeItem("evses"); } catch (e) {} PIN = ""; $("#app").classList.add("hide"); $("#login").classList.remove("hide"); }

  /* ---------- sesión: cuenta de Seguridad Industrial ---------- */
  async function login() {
    const b = $("#bLogin"); b.disabled = true; b.innerHTML = `<span class="spin"></span>`;
    try {
      const r = await rpc("eval_admin_login", { p_email: $("#mail").value.trim(), p_password: $("#pin").value });
      PIN = r.token; CORREO = r.email; try { localStorage.setItem("evses", JSON.stringify(r)); } catch (e) {}
      $("#pin").value = ""; entrar();
    } catch (e) { toast(/CREDENCIALES/.test(e.message) ? "Correo o contraseña incorrectos" : e.message, "err"); }
    b.disabled = false; b.textContent = "Ingresar";
  }
  $("#bLogin").onclick = login;
  $("#pin").onkeydown = e => { if (e.key === "Enter") login(); };
  $("#bSalir").onclick = async () => { try { await rpc("eval_admin_salir", { p_pin: PIN }); } catch (e) {} cerrarSesion(); };
  if (PIN) entrar(); else $("#login").classList.remove("hide");

  async function entrar() {
    $("#login").classList.add("hide"); $("#app").classList.remove("hide"); $("#miCorreo").textContent = CORREO;
    await cargarPropios();
    const nq = Object.values(BANCO.fam).reduce((a, f) => a + f.q.length, 0);
    $("#bancoInfo").textContent = `${PETS.length} PETS en catálogo, ${Object.keys(PROPIOS).length} PETS propios, ${nq + BANCO.normas.length + BANCO.emerg.length + BANCO.iperc.length + Object.values(BANCO_UNIDAD).reduce((x, l) => x + l.length, 0)} preguntas base (${FAMS.length} familias de riesgo).`;
    $("#nFecha").value = new Date(hoyLima() + "T12:00:00").getDay() === 1 ? hoyLima() : lunesProximo();
    tab("jornadas");
  }

  /* ---------- navegación ---------- */
  function tab(t) {
    $$(".tab").forEach(x => x.classList.toggle("hide", x.id !== "t-" + t));
    $$(".side nav button").forEach(b => b.classList.toggle("on", b.dataset.t === t || (t === "detalle" && b.dataset.t === "jornadas")));
    clearInterval(refT);
    if (t === "jornadas") cargarJornadas();
    if (t === "pets") pintarCatalogo();
    if (t === "propios") pintarPropios();
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-t],[data-go]"); if (b && !b.closest(".tbl")) tab(b.dataset.t || b.dataset.go); });

  /* ---------- jornadas ---------- */
  async function cargarJornadas() {
    $("#listaJ").innerHTML = `<span class="spin"></span>`;
    try { JORNADAS = await A("eval_admin_jornadas"); } catch (e) { return toast(e.message, "err"); }
    const tot = JORNADAS.reduce((a, j) => (a.n += j.n, a.f += j.fin, a.a += j.aprob, a), { n: 0, f: 0, a: 0 });
    $("#kpis").innerHTML = `<div class="kpi"><small>Evaluaciones</small><b>${JORNADAS.length}</b></div><div class="kpi"><small>Inscritos</small><b>${tot.n}</b></div><div class="kpi y"><small>Evaluados</small><b>${tot.f}</b></div><div class="kpi g"><small>Aprobados</small><b>${tot.a}</b></div><div class="kpi r"><small>Desaprobados</small><b>${tot.f - tot.a}</b></div><div class="kpi"><small>% aprobación</small><b>${tot.f ? Math.round(tot.a * 100 / tot.f) : 0}%</b></div>`;
    if (!JORNADAS.length) { $("#listaJ").innerHTML = `<div class="card center" style="grid-column:1/-1"><div style="font-size:40px">📋</div><h3>Aún no hay evaluaciones</h3><p class="muted">Programa la primera con el Excel de Gestión Humana.</p><button class="btn btn-gold" data-go="nueva">📅 Programar evaluación</button></div>`; return; }
    $("#listaJ").innerHTML = JORNADAS.map(j => {
      const pa = j.n ? j.aprob * 100 / j.n : 0, pd = j.n ? (j.fin - j.aprob) * 100 / j.n : 0;
      return `<button class="jc" data-j="${j.id}"><div class="row"><span class="d grow">${fFecha(j.fecha).replace(/ de \d{4}$/, "")}</span>${etiqueta(j)}</div>
        <div class="muted small">${esc(j.titulo)}</div>
        <div class="meter"><i style="width:${pa}%;background:var(--ok)"></i><i style="width:${pd}%;background:var(--bad)"></i></div>
        <div class="row small"><span class="grow"><b>${j.fin}</b>/${j.n} evaluados · <b style="color:var(--ok)">${j.aprob}</b> aprob.</span><span>Prom. <b>${j.prom ?? "—"}</b></span></div></button>`;
    }).join("");
    $$(".jc").forEach(b => b.onclick = () => abrirJ(b.dataset.j));
  }

  function etiqueta(j) {
    const h = hoyLima();
    if (j.estado !== "abierta") return `<span class="tag tag-n">Cerrada</span>`;
    if (j.fecha === h) return `<span class="tag tag-ok">● Hoy · activa</span>`;
    if (j.fecha > h) return `<span class="tag tag-mid">Programada</span>`;
    return `<span class="tag tag-n">Pasada</span>`;
  }
  async function abrirJ(id) {
    JACT = JORNADAS.find(j => j.id === id) || JACT; if (!JACT) return tab("jornadas"); tab("detalle");
    $("#dTit").textContent = fFecha(JACT.fecha); $("#dSub").innerHTML = esc(JACT.titulo) + " · " + etiqueta(JACT) + (JACT.fecha > hoyLima() ? " <span class='small muted'>Se activará automáticamente ese día.</span>" : "");
    $("#bEstado").textContent = JACT.estado === "abierta" ? "🔒 Cerrar" : "🔓 Reabrir";
    await cargarDetalle();
    refT = setInterval(() => { if ($("#autoRef").checked && !document.hidden) cargarDetalle(true); }, 20000);
  }
  async function cargarDetalle(silencio) {
    if (!silencio) $("#tblP").innerHTML = `<tr><td><span class="spin"></span></td></tr>`;
    try { PARTS = await A("eval_admin_detalle", { p_jornada: JACT.id }); } catch (e) { return toast(e.message, "err"); }
    const f = PARTS.filter(p => p.estado === "finalizado"), ap = f.filter(p => p.aprobado), cur = PARTS.filter(p => p.estado === "en_curso");
    const prom = f.length ? (f.reduce((a, p) => a + Number(p.nota), 0) / f.length).toFixed(2) : "—";
    $("#dKpis").innerHTML = `<div class="kpi"><small>Inscritos</small><b>${PARTS.length}</b></div><div class="kpi y"><small>En curso</small><b>${cur.length}</b></div><div class="kpi"><small>Finalizados</small><b>${f.length}</b></div><div class="kpi g"><small>Aprobados</small><b>${ap.length}</b></div><div class="kpi r"><small>Desaprobados</small><b>${f.length - ap.length}</b></div><div class="kpi"><small>Nota promedio</small><b>${prom}</b></div>`;
    $("#tblP").innerHTML = `<tr><th>#</th><th>Trabajador</th><th>DNI</th><th>Empresa</th><th>Cargo</th><th>PETS</th><th>Estado</th><th>Nota</th><th>%</th><th>Resultado</th><th>Salidas</th><th>Firma</th><th></th></tr>` +
      PARTS.map((p, i) => {
        const pets = resolverPets(p.pets_codigo, p.pets_nombre, p.cargo);
        const est = p.estado === "finalizado" ? `<span class="tag tag-n">Finalizado</span>` : p.estado === "en_curso" ? `<span class="tag tag-mid">En curso · ${fHora(p.inicio).slice(0, 5)}</span>` : `<span class="tag tag-n" style="opacity:.6">Pendiente</span>`;
        const res = p.estado !== "finalizado" ? "" : p.aprobado ? `<span class="tag tag-ok">Aprobado</span>` : `<span class="tag tag-bad">Desaprobado</span>`;
        return `<tr><td>${i + 1}</td><td><b>${esc(p.nombres)}</b>${p.intento > 1 ? ` <span class="tag tag-mid">Intento ${p.intento}</span>` : ""}</td><td>${esc(p.dni)}</td><td>${esc(p.empresa || "")}<br><span class="small muted">${esc(p.tipo || "")}</span></td><td>${esc(p.cargo || "")}</td>
          <td title="${esc(pets.n)}">${esc(p.pets_codigo || "—")}${pets.origen === "catalogo" || pets.origen === "propio" ? "" : pets.origen === "similar" ? ` <span class="tag tag-ok" title="Se parece a ${esc(pets.similar.c)} · ${esc(pets.similar.n)}">≈${Math.round(pets.similar.score * 100)}%</span>` : ` <span class="tag tag-mid" title="Sin parecido claro: se usaron palabras clave">⚠</span>`}</td>
          <td>${est}</td><td><b>${p.nota != null ? Number(p.nota).toFixed(1) : ""}</b></td><td>${p.total ? Math.round(p.correctas * 100 / p.total) + "%" : ""}</td><td>${res}</td><td>${p.estado === "pendiente" ? "" : (p.salidas || 0)}</td><td>${p.tiene_firma ? "✔" : p.estado === "finalizado" ? "<span class='muted'>pend.</span>" : ""}</td>
          <td class="acts">${p.estado === "finalizado" ? `<button data-a="ver" data-id="${p.id}">Examen</button><button data-a="const" data-id="${p.id}">Constancia</button>` : ""}<button data-a="reini" data-id="${p.id}" title="Habilitar un nuevo intento">↺</button><button data-a="del" data-id="${p.id}" title="Eliminar">🗑</button></td></tr>`;
      }).join("");
    $$("#tblP [data-a]").forEach(b => b.onclick = () => accionP(b.dataset.a, b.dataset.id));
  }
  async function accionP(a, id) {
    const p = PARTS.find(x => x.id === id);
    if (a === "ver") return verExamen(id);
    if (a === "const") return imprimir([id]);
    if (a === "reini" && await pregunta("Habilitar nuevo intento", `${p.nombres} podrá rendir el examen de nuevo (con preguntas distintas). El intento anterior queda guardado en el historial.`)) { await A("eval_admin_accion", { p_accion: "reiniciar", p_id: id }); toast("Nuevo intento habilitado", "ok"); cargarDetalle(); }
    if (a === "del" && await pregunta("Eliminar trabajador", `Se eliminará a ${p.nombres} de esta jornada, con su examen y firma. No se puede deshacer.`, true)) { await A("eval_admin_accion", { p_accion: "borrar_participante", p_id: id }); cargarDetalle(); }
  }
  $("#bEstado").onclick = async () => { const nv = JACT.estado === "abierta" ? "cerrar" : "abrir"; await A("eval_admin_accion", { p_accion: nv, p_id: JACT.id }); JACT.estado = nv === "cerrar" ? "cerrada" : "abierta"; $("#bEstado").textContent = JACT.estado === "abierta" ? "🔒 Cerrar" : "🔓 Reabrir"; toast("Evaluación " + JACT.estado, "ok"); };
  $("#bBorrarJ").onclick = async () => { if (await pregunta("Eliminar evaluación", `Se eliminará la evaluación del ${fCorta(JACT.fecha)} con todos sus exámenes y constancias. No se puede deshacer.`, true)) { await A("eval_admin_accion", { p_accion: "borrar_jornada", p_id: JACT.id }); tab("jornadas"); } };
  $("#bQR").onclick = () => mostrarQR(baseURL(), fFecha(JACT.fecha));
  $("#bQRGen").onclick = () => mostrarQR(baseURL(), "Evaluación del día");
  $("#bAgregar").onclick = () => formAgregar();

  function mostrarQR(url, sub) {
    const d = document.createElement("div"); d.className = "qrfull";
    d.innerHTML = `<img src="assets/img/logo-hochschild-blanco.png" style="height:60px"><h1>Evaluación de <span>ingreso</span> SSOMA</h1><div style="color:#d8d2c4">${esc(sub)}</div>
      <div class="qbox">${qrSVG(url, Math.min(420, innerHeight - 300))}</div><div style="font-size:18px">Escanea con la cámara de tu celular</div><div class="small" style="color:#8d8a83;margin-top:6px">${esc(url)}</div>
      <div class="row noprint" style="margin-top:18px"><button class="btn btn-gold" data-p>🖨 Imprimir</button><button class="btn btn-line" data-c>Copiar enlace</button><button class="btn btn-line" data-x>Cerrar</button></div>`;
    document.body.appendChild(d);
    $("[data-x]", d).onclick = () => d.remove();
    $("[data-c]", d).onclick = () => navigator.clipboard.writeText(url).then(() => toast("Enlace copiado", "ok"));
    $("[data-p]", d).onclick = () => { document.body.classList.add("qrp"); window.print(); setTimeout(() => document.body.classList.remove("qrp"), 500); };
  }

  async function verExamen(id) {
    const p = await A("eval_admin_participante", { p_id: id });
    const r = p.respuestas || {}, qs = r.preguntas || [];
    const s = sheet(`<div class="row"><div class="grow"><h2 style="font-size:24px">${esc(p.nombres)}</h2><div class="muted small">${esc(p.dni)} · ${esc(p.cargo || "")} · ${esc(r.pets || p.pets_codigo || "")} ${esc(r.pets_nombre || "")}</div></div><button class="btn btn-line" data-x>✕</button></div>
      <div class="kpis" style="margin-top:12px"><div class="kpi ${p.aprobado ? "g" : "r"}"><small>Resultado</small><b>${p.aprobado ? "APROBADO" : "DESAPROB."}</b></div><div class="kpi"><small>Correctas</small><b>${p.correctas}/${p.total}</b></div><div class="kpi"><small>Nota</small><b>${Number(p.nota).toFixed(1)}</b></div><div class="kpi"><small>Duración</small><b>${Math.round((new Date(p.fin) - new Date(p.inicio)) / 60000)} min</b></div><div class="kpi"><small>Salidas</small><b>${p.salidas}</b></div><div class="kpi"><small>Envío</small><b style="font-size:18px">${({ manual: "Manual", tiempo: "Por tiempo", salidas: "Por salidas" })[r.motivo] || "—"}</b></div></div>
      ${(p.historial || []).length ? `<div class="card small"><b>Intentos anteriores:</b> ${p.historial.map(h => `Intento ${h.intento}: ${h.correctas ?? "-"}/${h.total ?? "-"} (${h.aprobado ? "aprobado" : "desaprobado"}) ${fCorta(h.fin)}`).join(" · ")}</div>` : ""}
      ${qs.map((q, i) => `<div class="qprev"><b>${i + 1}. ${esc(q.t)}</b> <span class="tag ${q.r === q.c ? "tag-ok" : "tag-bad"}">${q.r === q.c ? "Correcta" : q.r == null ? "Sin responder" : "Incorrecta"}</span><ol type="A">${q.o.map((o, k) => `<li class="${k === q.c ? "c" : k === q.r ? "x" : ""}">${esc(o)}${k === q.r ? " ← marcó" : ""}</li>`).join("")}</ol></div>`).join("")}`);
  }

  async function imprimir(ids) {
    toast("Preparando constancias…");
    const docs = [];
    for (const id of ids) {
      const p = await A("eval_admin_participante", { p_id: id });
      docs.push(htmlConstancia({ ...p, fecha: JACT.fecha, pets_nombre_res: (p.respuestas && p.respuestas.pets_nombre) || resolverPets(p.pets_codigo, p.pets_nombre, p.cargo).n }));
    }
    let pa = $("#printArea"); if (!pa) { pa = document.createElement("div"); pa.id = "printArea"; document.body.appendChild(pa); }
    pa.innerHTML = docs.join(`<div style="page-break-after:always"></div>`);
    document.body.classList.add("printing");
    setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove("printing"), 500); }, 300);
  }
  const stP = document.createElement("style"); stP.textContent = `#printArea{display:none}@media print{body.printing>*:not(#printArea){display:none!important}body.printing #printArea{display:block}body.qrp>*:not(.qrfull){display:none!important}body.qrp .qrfull{position:static;background:#fff;color:#111;height:100vh}}`; document.head.appendChild(stP);
  $("#bPrintAll").onclick = () => { const ids = PARTS.filter(p => p.estado === "finalizado").map(p => p.id); if (!ids.length) return toast("Aún no hay exámenes finalizados", "err"); imprimir(ids); };

  $("#bExport").onclick = async () => {
    await libXLSX();
    const rows = PARTS.map((p, i) => ({ "N°": i + 1, "DNI": p.dni, "APELLIDOS Y NOMBRES": p.nombres, "EMPRESA": p.empresa, "TIPO": p.tipo, "CARGO": p.cargo, "CÓDIGO PETS": p.pets_codigo, "PETS": resolverPets(p.pets_codigo, p.pets_nombre, p.cargo).n, "ESTADO": p.estado, "INTENTO": p.intento, "INICIO": p.inicio ? fHora(p.inicio) : "", "FIN": p.fin ? fHora(p.fin) : "", "CORRECTAS": p.correctas, "TOTAL": p.total, "%": p.total ? Math.round(p.correctas * 100 / p.total) : "", "NOTA (0-20)": p.nota != null ? Number(p.nota) : "", "RESULTADO": p.estado === "finalizado" ? (p.aprobado ? "APROBADO" : "DESAPROBADO") : "", "PETS (15)": p.secciones ? p.secciones.pets.join("/") : "", "NORMAS (10)": p.secciones ? p.secciones.normas.join("/") : "", "EMERGENCIAS (10)": p.secciones ? p.secciones.emerg.join("/") : "", "IPERC (5)": p.secciones ? p.secciones.iperc.join("/") : "", "SALIDAS": p.salidas, "FIRMADO": p.tiene_firma ? "SÍ" : "NO", "CÓDIGO CONSTANCIA": p.codigo || "" }));
    const ws = XLSX.utils.json_to_sheet(rows); ws["!cols"] = Object.keys(rows[0] || { a: 1 }).map(k => ({ wch: Math.max(8, k.length + 2) })); ws["!cols"][2] = { wch: 36 }; ws["!cols"][7] = { wch: 40 };
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "RESULTADOS");
    XLSX.writeFile(wb, `Resultados_Evaluacion_${JACT.fecha}.xlsx`);
  };

  function formAgregar() {
    const s = sheet(`<div class="row"><h2 class="grow" style="font-size:24px">Agregar trabajadores</h2><button class="btn btn-line" data-x>✕</button></div>
      <p class="muted small">Agrega a alguien que faltó en la plantilla, o sube otra plantilla para añadir varios a esta jornada.</p>
      <div class="card"><div class="g3"><div><label class="lbl">DNI</label><input class="inp" id="aDni"></div><div class="span2"><label class="lbl">Apellidos y nombres</label><input class="inp" id="aNom"></div>
      <div><label class="lbl">Empresa</label><input class="inp" id="aEmp"></div><div><label class="lbl">Tipo</label><select class="inp" id="aTipo"><option>CONTRATISTA</option><option>CIA</option></select></div><div><label class="lbl">Cargo</label><input class="inp" id="aCar"></div>
      <div><label class="lbl">Código PETS</label><input class="inp" id="aPets" list="dlPets" placeholder="PETS-MSU-001"></div><div class="span2"><label class="lbl">Nombre del PETS / tarea (opcional)</label><input class="inp" id="aPetsN"></div></div>
      <button class="btn btn-gold" id="aOk" style="margin-top:12px">Agregar</button></div>
      <div class="card"><label class="lbl">O subir otra plantilla a esta jornada</label><input type="file" id="aFx" accept=".xlsx,.xls,.csv"></div>${datalistPets()}`);
    $("#aOk", s).onclick = async () => {
      const f = { dni: $("#aDni", s).value, nombres: $("#aNom", s).value, empresa: $("#aEmp", s).value, tipo: $("#aTipo", s).value, cargo: $("#aCar", s).value, pets_codigo: $("#aPets", s).value, pets_nombre: $("#aPetsN", s).value };
      if (!f.dni || !f.nombres) return toast("DNI y nombres son obligatorios", "err");
      await A("eval_admin_crear", { p_fecha: JACT.fecha, p_titulo: JACT.titulo, p_filas: [f], p_jornada: JACT.id }); toast("Agregado", "ok"); s.remove(); cargarDetalle();
    };
    $("#aFx", s).onchange = async e => { const filas = await leerPlantilla(e.target.files[0]); if (!filas.length) return; const r = await A("eval_admin_crear", { p_fecha: JACT.fecha, p_titulo: JACT.titulo, p_filas: filas, p_jornada: JACT.id }); toast(`${r.n} registros agregados/actualizados`, "ok"); s.remove(); cargarDetalle(); };
  }
  const datalistPets = () => `<datalist id="dlPets">${PETS.map(p => `<option value="${p.c}">${esc(p.n)}</option>`).join("")}${Object.values(PROPIOS).map(p => `<option value="${p.codigo}">${esc(p.nombre)}</option>`).join("")}</datalist>`;

  /* ---------- nueva jornada desde Excel ---------- */
  let FILAS = [];
  const drop = $("#drop");
  ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("over")));
  $("#fx").onchange = async e => { FILAS = await leerPlantilla(e.target.files[0]); if (!FILAS.length) toast("La plantilla no tiene trabajadores (la fila EJEMPLO se ignora)", "err"); previa(); e.target.value = ""; };

  async function libXLSX() { if (window.XLSX) return; await new Promise((ok, no) => { const s = document.createElement("script"); s.src = "lib/xlsx.full.min.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  async function leerPlantilla(file) {
    if (!file) return [];
    await libXLSX();
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sh = wb.Sheets[wb.SheetNames.find(n => /particip/i.test(n)) || wb.SheetNames[0]];
    const M = XLSX.utils.sheet_to_json(sh, { header: 1, defval: "", raw: false });
    const hi = M.findIndex(r => r.some(c => /^dni/i.test(norm(c).trim())));
    if (hi < 0) { toast("No se encontró la columna DNI en la plantilla", "err"); return []; }
    const H = M[hi].map(c => norm(c).trim());
    const col = (...re) => H.findIndex(h => re.some(r => r.test(h)));
    const c = { dni: col(/^dni/), nombres: col(/apellidos|nombres/), empresa: col(/^empresa|razon/), tipo: col(/^tipo|cia|contratista/), cargo: col(/^cargo|puesto|ocupacion/), pets_codigo: col(/codigo.*pets|^pets$|^cod/), pets_nombre: col(/nombre.*pets|tarea|procedimiento/), area: col(/^area/) };
    return M.slice(hi + 1).filter(r => !r.some(x => /^ejemplo$/i.test(String(x).trim()))).map(r => {
      const o = {}; for (const k in c) o[k] = c[k] >= 0 ? String(r[c[k]] ?? "").trim() : "";
      o.dni = o.dni.replace(/\D/g, ""); o.tipo = /cia|compa/i.test(o.tipo) ? "CIA" : o.tipo ? "CONTRATISTA" : "";
      return o;
    }).filter(o => o.dni && o.nombres);
  }
  function previa() {
    if (!FILAS.length) return $("#prev").classList.add("hide");
    $("#prev").classList.remove("hide");
    let nc = 0, np = 0, ns = 0, nk = 0, ng = 0;
    const dup = new Set(), vistos = new Set();
    FILAS.forEach(f => { if (vistos.has(f.dni)) dup.add(f.dni); vistos.add(f.dni); });
    $("#tblPrev").innerHTML = `<tr><th>#</th><th>DNI</th><th>Apellidos y nombres</th><th>Empresa</th><th>Cargo</th><th>PETS que envió la empresa</th><th>Relación con el catálogo del sistema</th><th>Riesgos para sus 15 preguntas</th></tr>` + FILAS.map((f, i) => {
      const p = f.eleccion ? resolverPets(f.eleccion) : resolverPets(f.pets_codigo, f.pets_nombre, f.cargo);
      const org = f.eleccion ? "elegido" : p.origen;
      ({ catalogo: () => nc++, propio: () => np++, elegido: () => np++, similar: () => ns++, palabras: () => nk++, general: () => ng++ })[org]();
      let rel;
      if (org === "catalogo") rel = `<span class="tag tag-ok">Código del catálogo</span><br><span class="small">${esc(p.n)}</span>`;
      else if (org === "propio") rel = `<span class="tag tag-ok">${p.aprendido ? "Aprendido" : "PETS propio"}</span><br><span class="small">${esc(p.n)}${p.aprendido ? " → " + esc(p.aprendido) : ""}</span>`;
      else {
        const ops = parecidos(f.pets_nombre, f.cargo, 3), sel = f.eleccion || (p.similar ? p.similar.c : "");
        const pct = x => Math.round(x * 100) + " %";
        rel = `${org === "elegido" ? `<span class="tag tag-ok">Elegido por ti · se recordará</span>` : org === "similar" ? `<span class="tag tag-ok">Se parece ${pct(p.similar.score)}</span>` : `<span class="tag tag-${org === "general" ? "bad" : "mid"}">Sin parecido claro</span>`}
          <select class="inp rel" data-i="${i}" style="padding:6px;font-size:12.5px;margin-top:4px;min-width:260px">
            <option value="">${ops.length ? "— elegir otra tarea —" : "— buscar tarea —"}</option>
            ${ops.map(o => `<option value="${o.p.c}" ${o.p.c === sel ? "selected" : ""}>${pct(o.score)} · ${esc(o.p.n)} (${o.p.c})</option>`).join("")}
            ${sel && !ops.some(o => o.p.c === sel) ? `<option value="${sel}" selected>${esc((PETS_MAP[sel] || {}).n || sel)} (${sel})</option>` : ""}
            <option value="__buscar">🔎 Buscar en el catálogo…</option></select>`;
      }
      return `<tr${dup.has(f.dni) ? ` style="background:#fbe9e7"` : ""}><td>${i + 1}</td><td>${esc(f.dni)}</td><td><b>${esc(f.nombres)}</b></td><td>${esc(f.empresa)}<br><span class="small muted">${esc(f.tipo)}</span></td><td>${esc(f.cargo)}</td><td><b>${esc(f.pets_codigo || "—")}</b><br><span class="small">${esc(f.pets_nombre || "")}</span></td><td>${rel}</td><td class="small">${p.f.map(famN).join(", ") || "Generales del PETS"}</td></tr>`;
    }).join("");
    $$("#tblPrev select.rel").forEach(el => el.onchange = () => {
      const i = +el.dataset.i;
      if (el.value === "__buscar") return buscarTarea(FILAS[i], c => { FILAS[i].eleccion = c; previa(); }, () => previa());
      FILAS[i].eleccion = el.value || null; previa();
    });
    $("#prevTit").textContent = `${FILAS.length} trabajadores`;
    $("#prevRes").innerHTML = `<span class="tag tag-ok">${nc} código del catálogo</span> <span class="tag tag-ok">${np} propios / aprendidos / elegidos</span> <span class="tag tag-ok">${ns} reconocidos por parecido</span> <span class="tag tag-mid">${nk + ng} sin parecido claro (revisar)</span>${dup.size ? ` <span class="tag tag-bad">${dup.size} DNI repetidos (se registra una vez)</span>` : ""}<br><span class="muted">El sistema compara el <b>nombre del PETS</b> de la empresa con las ${PETS.length} tareas del catálogo y te propone las 3 más parecidas. Si cambias la relación, <b>el sistema la recuerda</b> para ese código y ese nombre en las próximas evaluaciones.</span>`;
  }
  function buscarTarea(f, ok, cancel) {
    const s = sheet(`<div class="row"><h2 class="grow" style="font-size:22px">Relacionar PETS</h2><button class="btn btn-line" data-x>✕</button></div>
      <div class="card small"><b>${esc(f.pets_codigo || "—")}</b> · ${esc(f.pets_nombre || "")} <span class="muted">(${esc(f.cargo || "")})</span></div>
      <input class="inp" id="bt" placeholder="Escribe palabras de la tarea: soldadura, scoop, residuos, amoladora…"><div id="btr" style="margin-top:10px;max-height:60vh;overflow:auto"></div>`);
    const pint = () => { const q = $("#bt", s).value; const l = q.trim().length > 1 ? parecidos(q, "", 25) : parecidos(f.pets_nombre, f.cargo, 25);
      $("#btr", s).innerHTML = l.map(o => `<button class="res" data-c="${o.p.c}" style="margin-bottom:6px"><span class="grow"><b>${esc(o.p.n)}</b><small>${o.p.c} · ${esc(AREAS_PETS[o.p.a])} · ${o.p.f.map(famN).join(", ")}</small></span><span class="tag tag-n">${Math.round(o.score * 100)} %</span></button>`).join("") || `<div class="muted small">Sin resultados.</div>`;
      $$("[data-c]", s).forEach(b => b.onclick = () => { s.remove(); ok(b.dataset.c); }); };
    $("#bt", s).oninput = pint; pint(); $$("[data-x]", s).forEach(b => b.onclick = () => { s.remove(); cancel(); });
  }
  $("#bCrear").onclick = async () => {
    const fecha = $("#nFecha").value; if (!fecha) return toast("Elige la fecha", "err");
    const b = $("#bCrear"); b.disabled = true;
    try {
      // Aprendizaje: guarda las relaciones elegidas (código y nombre de la empresa → tarea del catálogo)
      const vistos = new Set();
      for (const f of FILAS.filter(x => x.eleccion)) {
        const cod = (f.pets_codigo || "").toUpperCase().trim() || ("NOM-" + normNombre(f.pets_nombre).slice(0, 40).replace(/ /g, "-").toUpperCase());
        if (vistos.has(cod)) continue; vistos.add(cod);
        const base = PETS_MAP[f.eleccion];
        await A("eval_admin_pets_guardar", { p_codigo: cod, p_nombre: f.pets_nombre || base.n, p_area: AREAS_PETS[base.a], p_base: base.c, p_familias: base.f, p_preguntas: (PROPIOS[cod] || {}).preguntas || [] });
        if (!f.pets_codigo) f.pets_codigo = cod;
      }
      if (vistos.size) await cargarPropios();
      const filas = FILAS.map(({ eleccion, ...x }) => x);
      const r = await A("eval_admin_crear", { p_fecha: fecha, p_titulo: $("#nTit").value, p_filas: filas });
      toast(`Evaluación programada para el ${fCorta(fecha)} con ${r.n} trabajadores${vistos.size ? ` · ${vistos.size} relación(es) aprendida(s)` : ""}`, "ok");
      FILAS = []; $("#prev").classList.add("hide"); await cargarJornadas(); abrirJ(r.id);
    } catch (e) { toast(e.message, "err"); } b.disabled = false;
  };

  /* ---------- catálogo ---------- */
  $("#pa").innerHTML += Object.entries(AREAS_PETS).map(([k, v]) => `<option value="${k}">${v} (${PETS.filter(p => p.a === k).length})</option>`).join("");
  $("#pq").oninput = $("#pa").onchange = () => pintarCatalogo();
  function pintarCatalogo() {
    $("#petsCount").textContent = `${PETS.length} PETS de catálogo en ${Object.keys(AREAS_PETS).length} áreas + ${Object.keys(PROPIOS).length} propios. Gestión Humana usa estos códigos en la plantilla.`;
    const q = norm($("#pq").value), a = $("#pa").value;
    const l = PETS.filter(p => (!a || p.a === a) && (!q || norm(p.c + " " + p.n).includes(q)));
    $("#tblPets").innerHTML = `<tr><th>Código</th><th>Tarea / PETS</th><th>Área</th><th>Riesgos evaluados</th><th></th></tr>` + l.slice(0, 300).map(p => `<tr><td><b>${p.c}</b></td><td>${esc(p.n)}</td><td class="small">${AREAS_PETS[p.a]}</td><td class="small">${p.f.map(famN).join(" · ")}</td><td class="acts"><button data-ficha="${p.c}">Ficha PETS</button><button data-prev="${p.c}">Ver examen</button></td></tr>`).join("") + (l.length > 300 ? `<tr><td colspan="5" class="muted">… ${l.length - 300} más. Afina la búsqueda.</td></tr>` : "");
    $$("[data-prev]").forEach(b => b.onclick = () => previewExamen(b.dataset.prev));
    $$("[data-ficha]").forEach(b => b.onclick = () => verFicha(resolverPets(b.dataset.ficha)));
  }
  function verFicha(pets) {
    const s = sheet(`<div class="row noprint"><h2 class="grow" style="font-size:22px">Ficha PETS · formato Anexo 10 D.S. 024-2016-EM</h2><button class="btn btn-dark" data-pr>🖨 Imprimir / PDF</button><button class="btn btn-line" data-x>✕</button></div>${htmlFicha(pets)}`);
    $("[data-pr]", s).onclick = () => { let pa = $("#printArea"); if (!pa) { pa = document.createElement("div"); pa.id = "printArea"; document.body.appendChild(pa); } pa.innerHTML = htmlFicha(pets); document.body.classList.add("printing"); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove("printing"), 500); }, 200); };
  }
  function previewExamen(cod, nombre) {
    const ex = armarExamen({ id: "prev-" + Math.random(), intento: 1, pets_codigo: cod, pets_nombre: nombre || "", cargo: "" });
    sheet(`<div class="row"><div class="grow"><h2 style="font-size:22px">Vista previa de examen</h2><div class="muted small">${esc(ex.pets.c)} · ${esc(ex.pets.n)} — cada trabajador recibe una combinación distinta</div></div><button class="btn btn-line" data-x>✕</button></div><div class="card small">El examen evalúa lo que establece la <b>ficha PETS (formato Anexo 10)</b> de esta tarea: sus EPP, controles y restricciones según los riesgos <b>${esc(ex.pets.f.map(famN).join(", ") || "generales")}</b>.</div>
      ${CFG.secciones.map(s => `<h3 style="margin:16px 0 8px;font-size:18px;color:var(--gold3)">${esc(s.n)} (${s.cant})</h3>` + ex.preguntas.map((q, i) => q.s !== s.k ? "" : `<div class="qprev"><b>${i + 1}. ${esc(q.t)}</b><ol type="A">${q.o.map((o, k) => `<li class="${k === q.c ? "c" : ""}">${esc(o)}</li>`).join("")}</ol></div>`).join("")).join("")}`);
  }

  /* ---------- PETS propios ---------- */
  function pintarPropios() {
    const l = Object.values(PROPIOS);
    $("#listaP").innerHTML = !l.length ? `<div class="card center" style="grid-column:1/-1"><div style="font-size:40px">⬆</div><h3>Sin PETS propios todavía</h3><p class="muted">Sube el PETS (PDF, Word o texto) con el código que usa la unidad. El sistema detecta sus riesgos y puedes añadir preguntas propias.</p></div>` :
      l.map(p => `<button class="jc" data-c="${esc(p.codigo)}"><div class="row"><b class="grow">${esc(p.codigo)}</b><span class="tag tag-ok">${(p.preguntas || []).length} preg. propias</span></div><div style="margin:6px 0">${esc(p.nombre)}</div><div class="small muted">${(p.familias || []).map(famN).join(" · ") || "—"}${p.base ? " · basado en " + esc(p.base) : ""}</div></button>`).join("");
    $$("#listaP .jc").forEach(b => b.onclick = () => editorPets(PROPIOS[b.dataset.c]));
  }
  $("#bNuevoP").onclick = () => editorPets(null);

  async function textoDoc(file) {
    const n = file.name.toLowerCase();
    if (n.endsWith(".txt")) return await file.text();
    if (n.endsWith(".docx")) { await cargarJS("lib/mammoth.browser.min.js"); return (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value; }
    if (n.endsWith(".pdf")) {
      await cargarJS("lib/pdf.min.js"); pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; let t = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 40); i++) { const c = await (await pdf.getPage(i)).getTextContent(); t += c.items.map(x => x.str).join(" ") + "\n"; }
      return t;
    }
    throw new Error("Formato no soportado: usa PDF, DOCX o TXT");
  }
  const cargarJS = src => new Promise((ok, no) => { if ($(`script[src="${src}"]`)) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });

  function editorPets(p) {
    const P = p ? JSON.parse(JSON.stringify(p)) : { codigo: "", nombre: "", area: "", base: "", familias: [], preguntas: [] };
    const s = sheet(`<div class="row"><h2 class="grow" style="font-size:24px">${p ? "Editar" : "Subir / crear"} PETS propio</h2><button class="btn btn-line" data-x>✕</button></div>
      <div class="card"><label class="lbl">1 · Documento del PETS (opcional)</label><input type="file" id="eDoc" accept=".pdf,.docx,.txt"><div id="eDocR" class="small muted" style="margin-top:6px">Al subir el PETS se leen su código, título y riesgos para marcar las familias automáticamente. El archivo no se guarda en la nube (ahorra espacio).</div></div>
      <div class="card"><label class="lbl">2 · Datos</label><div class="g3"><div><label class="small">Código del PETS (el de la unidad)</label><input class="inp" id="eCod" value="${esc(P.codigo)}" ${p ? "readonly" : ""} placeholder="PETS-PAL-MIN-014"></div>
        <div class="span2"><label class="small">Nombre de la tarea</label><input class="inp" id="eNom" value="${esc(P.nombre)}"></div>
        <div><label class="small">Área</label><input class="inp" id="eArea" value="${esc(P.area || "")}" placeholder="Mina, Planta, Mantenimiento…"></div>
        <div class="span2"><label class="small">Basado en PETS del catálogo (hereda sus riesgos, opcional)</label><input class="inp" id="eBase" list="dlPets" value="${esc(P.base || "")}"></div></div></div>
      <div class="card"><label class="lbl">3 · Riesgos de la tarea (de aquí salen sus preguntas)</label><div class="fams" id="eFams">${FAMS.map(([k, n]) => `<span class="fam ${P.familias.includes(k) ? "on" : ""}" data-f="${k}">${n}</span>`).join("")}</div></div>
      <div class="card"><div class="row"><label class="lbl grow">4 · Preguntas propias del PETS (opcional, hasta 10 entran a cada examen)</label><button class="btn btn-line small" id="eAddQ">➕ Pregunta</button><label class="btn btn-line small" style="position:relative">⬆ Desde Excel<input type="file" id="eQx" accept=".xlsx,.csv" style="position:absolute;inset:0;opacity:0"></label></div>
        <div class="small muted" style="margin-bottom:8px">Columnas: Pregunta · Respuesta correcta (verde) · 3 incorrectas. Todo de marcar, nivel medio, enfocado en seguridad.</div><div class="qed" id="eQs"></div></div>
      <div class="row"><button class="btn btn-gold" id="eSave">✓ Guardar PETS</button><button class="btn btn-line" id="eFicha">Ficha Anexo 10</button><button class="btn btn-line" id="ePrev">Ver examen de ejemplo</button>${p ? `<button class="btn btn-red" id="eDel">Eliminar</button>` : ""}</div>${datalistPets()}`);
    const pintarQs = () => { $("#eQs", s).innerHTML = P.preguntas.map((q, i) => `<div class="qrow" data-i="${i}">${[0, 1, 2, 3, 4].map(k => `<input data-k="${k}" class="${k === 1 ? "ok" : ""}" value="${esc(q[k] || "")}" placeholder="${["Pregunta", "Correcta", "Incorrecta 1", "Incorrecta 2", "Incorrecta 3"][k]}">`).join("")}<button class="btn btn-line small" data-rm>✕</button></div>`).join("") || `<div class="muted small">Sin preguntas propias: se usarán las del banco según los riesgos marcados.</div>`;
      $$(".qrow", s).forEach(r => { const i = +r.dataset.i; $$("input", r).forEach(inp => inp.oninput = () => P.preguntas[i][+inp.dataset.k] = inp.value); $("[data-rm]", r).onclick = () => { P.preguntas.splice(i, 1); pintarQs(); }; }); };
    pintarQs();
    $$(".fam", s).forEach(f => f.onclick = () => { f.classList.toggle("on"); });
    const marcar = fs => $$(".fam", s).forEach(f => { if (fs.includes(f.dataset.f)) f.classList.add("on"); });
    $("#eNom", s).onchange = () => marcar(familiasPorTexto($("#eNom", s).value));
    $("#eBase", s).onchange = () => { const b = PETS_MAP[$("#eBase", s).value.toUpperCase()]; if (b) { marcar(b.f); if (!$("#eNom", s).value) $("#eNom", s).value = b.n; } };
    $("#eAddQ", s).onclick = () => { P.preguntas.push(["", "", "", "", ""]); pintarQs(); };
    $("#eDoc", s).onchange = async e => {
      const f = e.target.files[0]; if (!f) return; $("#eDocR", s).innerHTML = `<span class="spin"></span> Leyendo documento…`;
      try {
        const t = await textoDoc(f); const fs = familiasPorTexto(t); marcar(fs);
        const cod = (t.match(/\b(PETS?[-\s_]?[A-Z0-9]{1,6}(?:[-_][A-Z0-9]{1,6}){1,4})\b/i) || [])[1];
        if (cod && !$("#eCod", s).value) $("#eCod", s).value = cod.toUpperCase().replace(/\s/g, "-");
        if (!$("#eNom", s).value) { const lin = t.split(/\n/).map(x => x.trim()).find(x => x.length > 12 && x.length < 120 && !/procedimiento escrito|versi[oó]n|p[aá]gina|c[oó]digo/i.test(x)); if (lin) $("#eNom", s).value = lin; }
        $("#eDocR", s).innerHTML = `✔ Documento leído (${t.length.toLocaleString()} caracteres). Riesgos detectados: <b>${fs.map(famN).join(", ") || "ninguno, márcalos manualmente"}</b>. Revisa y ajusta abajo.`;
      } catch (er) { $("#eDocR", s).textContent = er.message; }
    };
    $("#eQx", s).onchange = async e => {
      await libXLSX(); const wb = XLSX.read(await e.target.files[0].arrayBuffer(), { type: "array" });
      const M = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "" });
      const qs = M.filter(r => r[0] && r[1] && r[2] && !/^pregunta$/i.test(String(r[0]).trim())).map(r => [0, 1, 2, 3, 4].map(k => String(r[k] || "").trim()));
      P.preguntas.push(...qs); pintarQs(); toast(`${qs.length} preguntas importadas`, "ok");
    };
    const leer = () => ({ codigo: $("#eCod", s).value.trim().toUpperCase(), nombre: $("#eNom", s).value.trim(), area: $("#eArea", s).value.trim(), base: $("#eBase", s).value.trim().toUpperCase(), familias: $$(".fam.on", s).map(f => f.dataset.f), preguntas: P.preguntas.filter(q => q[0] && q[1] && q[2]) });
    $("#eSave", s).onclick = async () => {
      const d = leer(); if (!d.codigo || !d.nombre) return toast("Código y nombre son obligatorios", "err");
      if (!d.familias.length && !d.base && !d.preguntas.length) return toast("Marca al menos un riesgo o agrega preguntas", "err");
      await A("eval_admin_pets_guardar", { p_codigo: d.codigo, p_nombre: d.nombre, p_area: d.area, p_base: d.base, p_familias: d.familias, p_preguntas: d.preguntas });
      await cargarPropios(); toast("PETS guardado", "ok"); s.remove(); pintarPropios();
    };
    $("#eFicha", s).onclick = () => { const d = leer(); verFicha({ c: d.codigo || "—", n: d.nombre || "—", a: d.area, f: [...new Set([...d.familias, ...((PETS_MAP[d.base] || {}).f || [])])] }); };
    $("#ePrev", s).onclick = () => { const d = leer(); PROPIOS["__PREV"] = { ...d, codigo: "__PREV" }; previewExamen("__PREV"); delete PROPIOS["__PREV"]; };
    if (p) $("#eDel", s).onclick = async () => { if (await pregunta("Eliminar PETS", `Se eliminará ${p.codigo} y sus preguntas propias.`, true)) { await A("eval_admin_pets_borrar", { p_codigo: p.codigo }); await cargarPropios(); s.remove(); pintarPropios(); } };
  }

  /* ---------- ajustes ---------- */
  $("#bCuenta").onclick = async () => {
    const m = $("#cuNuevoMail").value.trim(), n = $("#cuNueva").value, a = $("#cuActual").value;
    if (!a) return toast("Escribe tu contraseña actual", "err");
    if (!m && !n) return toast("No hay cambios", "err");
    try { await A("eval_admin_cuenta", { p_actual: a, p_email: m, p_password: n }); if (m) CORREO = m.toLowerCase(); $("#miCorreo").textContent = CORREO; ["#cuNuevoMail", "#cuNueva", "#cuActual"].forEach(x => $(x).value = ""); toast("Cuenta actualizada", "ok"); }
    catch (e) { toast(/ACTUAL/.test(e.message) ? "La contraseña actual no es correcta" : /CORTA/.test(e.message) ? "La nueva contraseña debe tener al menos 8 caracteres" : e.message, "err"); }
  };

  /* ---------- utilidades de interfaz ---------- */
  function sheet(html) { const d = document.createElement("div"); d.className = "sheet"; d.innerHTML = `<div class="pan">${html}</div>`; document.body.appendChild(d); d.onclick = e => { if (e.target === d) d.remove(); }; $$("[data-x]", d).forEach(b => b.onclick = () => d.remove()); return d; }
  function pregunta(t, msg, peligro) { return new Promise(ok => { const m = document.createElement("div"); m.className = "modal"; m.innerHTML = `<div class="box"><h3>${esc(t)}</h3><p class="muted">${esc(msg)}</p><div class="acts"><button class="btn btn-line" data-n>Cancelar</button><button class="btn ${peligro ? "btn-red" : "btn-gold"}" data-s>Confirmar</button></div></div>`; document.body.appendChild(m); $("[data-n]", m).onclick = () => { m.remove(); ok(false); }; $("[data-s]", m).onclick = () => { m.remove(); ok(true); }; }); }
  window.addEventListener("unhandledrejection", e => toast(e.reason && e.reason.message || "Error", "err"));
})();
