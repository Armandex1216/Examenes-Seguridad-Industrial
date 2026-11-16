/* Núcleo compartido: conexión, armado aleatorio del examen y utilidades */
window.CFG = {
  url: "https://sivlsmvdmvrdmldfvqle.supabase.co",
  key: "sb_publishable_PSNPWJlTzF7kDVbE34tnyw_bY059IwG",
  minutos: 50,
  aprobacion: 0.75,
  maxSalidas: 3,
  secciones: [
    { k: "pets",   n: "PETS de su tarea",                    cant: 15 },
    { k: "normas", n: "Normas internas, reglas de oro y tolerancia cero", cant: 10 },
    { k: "emerg",  n: "Emergencias, reporte y documentación", cant: 10 },
    { k: "iperc",  n: "IPERC y derecho a negarse al trabajo inseguro",   cant: 5 }
  ]
};

const MSG = {
  DNI_INCORRECTO: "El DNI no coincide con el registrado. Verifícalo o consulta al evaluador.",
  JORNADA_CERRADA: "Esta evaluación ya fue cerrada por el evaluador.",
  YA_FINALIZADO: "Este examen ya fue enviado.",
  NO_INICIADO: "El examen no fue iniciado correctamente. Vuelve a ingresar.",
  PIN_INCORRECTO: "PIN incorrecto.",
  YA_FIRMADO: "La constancia ya fue firmada."
};

async function rpc(fn, args = {}) {
  let r;
  try {
    r = await fetch(`${CFG.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: CFG.key, "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
  } catch (e) { throw new Error("Sin conexión a internet. Revisa tu señal y vuelve a intentar."); }
  const txt = await r.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!r.ok) {
    const m = (data && (data.message || data.hint)) || "Error " + r.status;
    const code = Object.keys(MSG).find(k => m.includes(k));
    const err = new Error(code ? MSG[code] : m); err.code = code; throw err;
  }
  return data;
}

/* ---------- aleatoriedad reproducible por trabajador ---------- */
function hashStr(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return (h ^= h >>> 16) >>> 0; }; }
function rng(seed) { let a = hashStr(seed)(); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const norm = s => (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ---------- PETS: catálogo + propios + palabras clave ---------- */
let PROPIOS = {};
async function cargarPropios() {
  try { const l = await rpc("eval_pets_lista"); PROPIOS = Object.fromEntries((l || []).map(p => [p.codigo, p])); } catch (e) { PROPIOS = {}; }
  return PROPIOS;
}
function familiasPorTexto(t) {
  const s = norm(t); const out = [];
  CLAVES.forEach(([re, f]) => { if (new RegExp(re).test(s) && !out.includes(f)) out.push(f); });
  return out;
}
function resolverPets(codigo, nombre, cargo) {
  const c = (codigo || "").toUpperCase().trim();
  const pr = PROPIOS[c];
  if (pr) {
    const base = pr.base && PETS_MAP[pr.base];
    let f = [...new Set([...(pr.familias || []), ...(base ? base.f : [])])];
    if (!f.length) f = familiasPorTexto(pr.nombre + " " + (cargo || ""));
    return { c, n: pr.nombre, a: pr.area || (base && AREAS_PETS[base.a]) || "PETS propio", f, propias: pr.preguntas || [], origen: "propio" };
  }
  const cat = PETS_MAP[c];
  if (cat) return { c, n: cat.n, a: AREAS_PETS[cat.a], f: cat.f, propias: [], origen: "catalogo" };
  const f = familiasPorTexto((nombre || "") + " " + (cargo || ""));
  return { c: c || "—", n: nombre || "Tarea según cargo: " + (cargo || "—"), a: "No catalogado", f, propias: [], origen: f.length ? "palabras" : "general" };
}

/* ---------- armado del examen ---------- */
function armarExamen(part) {
  const r = rng(part.id + "|" + part.intento);
  const pets = resolverPets(part.pets_codigo, part.pets_nombre, part.cargo);
  const usados = new Set();
  const tomar = (pool, n) => { const out = []; for (const q of shuffle(pool, r)) { if (out.length >= n) break; if (usados.has(q[0])) continue; usados.add(q[0]); out.push(q); } return out; };

  // 1) PETS (15): preguntas propias del PETS + familias de riesgo + generales del PETS
  const nP = CFG.secciones[0].cant;
  let sel = tomar(pets.propias.filter(q => Array.isArray(q) && q.length >= 3), Math.min(10, pets.propias.length));
  const fams = (pets.f.length ? pets.f : ["gen", "ord", "her", "man"]).filter(f => BANCO.fam[f]);
  const colas = fams.map(f => shuffle(BANCO.fam[f].q, r));
  const tn = pets.n.length > 70 ? pets.n.slice(0, 68) + "…" : pets.n;
  const plantillas = [
    [`Antes de iniciar la tarea «${tn}», el trabajador debe:`, "Leer el PETS, llenar el IPERC continuo y verificar los controles en campo", "Iniciar de inmediato para cumplir la producción", "Esperar que el supervisor haga todo", "Solo firmar la asistencia"],
    [`Si durante la tarea «${tn}» las condiciones cambian y el PETS ya no se puede cumplir:`, "Se detiene la tarea, se comunica al supervisor y se reevalúan los riesgos", "Se continúa como se pueda", "Se omite el paso", "Se termina rápido"],
    [`Para la tarea «${tn}», el EPP a usar se define:`, "Según lo indicado en el PETS y en el IPERC de la tarea", "Según lo que tenga a la mano", "Según el gusto del trabajador", "No se necesita EPP"]
  ];
  let i = 0, vueltas = 0;
  const cupoGen = 3;
  while (sel.length < nP - cupoGen && vueltas < 400) {
    const cola = colas[i % colas.length]; const q = cola && cola.shift();
    if (q && !usados.has(q[0])) { usados.add(q[0]); sel.push(q); }
    i++; vueltas++;
  }
  sel = sel.concat(tomar(shuffle(plantillas, r).slice(0, 1).concat(BANCO.fam.gen.q), nP - sel.length));
  if (sel.length < nP) sel = sel.concat(tomar([].concat(...Object.values(BANCO.fam).map(x => x.q)), nP - sel.length));

  const bloques = [
    ["pets", shuffle(sel, r)],
    ["normas", tomar(BANCO.normas, CFG.secciones[1].cant)],
    ["emerg", tomar(BANCO.emerg, CFG.secciones[2].cant)],
    ["iperc", tomar(BANCO.iperc, CFG.secciones[3].cant)]
  ];
  const preguntas = [];
  bloques.forEach(([s, qs]) => qs.forEach(q => {
    const ops = shuffle(q.slice(1, 5).map((t, k) => ({ t, ok: k === 0 })), r);
    preguntas.push({ s, t: q[0], o: ops.map(x => x.t), c: ops.findIndex(x => x.ok) });
  }));
  return { pets, preguntas };
}

function calificar(preguntas, resp) {
  const sec = {}; let ok = 0;
  CFG.secciones.forEach(s => sec[s.k] = [0, 0]);
  preguntas.forEach((p, i) => { sec[p.s][1]++; if (resp[i] === p.c) { sec[p.s][0]++; ok++; } });
  return { correctas: ok, total: preguntas.length, secciones: sec };
}

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => (s ?? "").toString().replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fFecha = d => d ? cap(new Date((d.length === 10 ? d + "T12:00:00" : d)).toLocaleDateString("es-PE", { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" })) : "—";
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fHora = d => d ? new Date(d).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Lima" }) : "—";
const fCorta = d => d ? new Date((d.length === 10 ? d + "T12:00:00" : d)).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Lima" }) : "—";
function hoyLima() { return new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" }); }
function lunesProximo() { const d = new Date(hoyLima() + "T12:00:00"); const k = (8 - d.getDay()) % 7; d.setDate(d.getDate() + k); return d.toISOString().slice(0, 10); }
function baseURL() { return location.origin + location.pathname.replace(/[^/]*$/, ""); }
function qrSVG(texto, px = 240) {
  const q = qrcode(0, "M"); q.addData(texto); q.make();
  const n = q.getModuleCount(), m = 2, s = n + m * 2; let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + m},${y + m}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${px}" height="${px}" shape-rendering="crispEdges"><rect width="${s}" height="${s}" fill="#fff"/><path d="${d}" fill="#1a1917"/></svg>`;
}
function toast(msg, tipo = "") {
  let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.className = "show " + tipo; t.textContent = msg; clearTimeout(t._h); t._h = setTimeout(() => t.className = "", 3800);
}
