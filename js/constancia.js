/* Constancia de evaluación (vista imprimible) */
function htmlConstancia(d) {
  const pct = d.total ? Math.round(d.correctas * 100 / d.total) : 0;
  const dur = d.inicio && d.fin ? Math.round((new Date(d.fin) - new Date(d.inicio)) / 60000) : null;
  const url = baseURL() + "?c=" + encodeURIComponent(d.codigo);
  const sec = d.secciones || {};
  const filas = CFG.secciones.map(s => { const v = sec[s.k] || [0, 0]; return `<tr><td>${esc(s.n)}</td><td style="text-align:center">${v[0]} / ${v[1]}</td></tr>`; }).join("");
  return `<div class="doc">
  <div class="hd"><img src="assets/img/logo-hochschild.png" alt="Hochschild Mining">
    <div class="cod">CONSTANCIA N.°<br><b>${esc(d.codigo)}</b><br>Intento ${d.intento || 1}</div></div>
  <h2>Constancia de evaluación de ingreso</h2>
  <div class="sub">Seguridad y Salud Ocupacional · U.M. Pallancata – Selene</div>
  <table>
    <tr><th>Apellidos y nombres</th><td><b>${esc(d.nombres)}</b></td></tr>
    <tr><th>DNI / CE</th><td>${esc(d.dni)}</td></tr>
    <tr><th>Empresa</th><td>${esc(d.empresa || "—")} ${d.tipo ? `<span class="small">(${esc(d.tipo)})</span>` : ""}</td></tr>
    <tr><th>Cargo</th><td>${esc(d.cargo || "—")}</td></tr>
    <tr><th>PETS evaluado</th><td>${esc(d.pets_codigo || "—")} · ${esc(d.pets_nombre_res || d.pets_nombre || "")}</td></tr>
    <tr><th>Fecha de evaluación</th><td>${fFecha(d.fecha)}</td></tr>
    <tr><th>Hora de inicio / fin</th><td>${fHora(d.inicio)} – ${fHora(d.fin)} ${dur != null ? `(${dur} min)` : ""}</td></tr>
  </table>
  <div class="resbox">
    <div class="${d.aprobado ? "ok" : "bad"}"><small>RESULTADO</small><b>${d.aprobado ? "APROBADO" : "DESAPROBADO"}</b></div>
    <div><small>RESPUESTAS CORRECTAS</small><b>${d.correctas} / ${d.total}</b></div>
    <div><small>PORCENTAJE</small><b>${pct} %</b></div>
    <div><small>NOTA (0 – 20)</small><b>${Number(d.nota).toFixed(1)}</b></div>
  </div>
  <table><tr><th style="width:auto">Sección evaluada</th><th style="width:120px;text-align:center">Correctas</th></tr>${filas}</table>
  <div class="small">Nota mínima aprobatoria: 75 % (30 de 40). Salidas de la página registradas durante el examen: <b>${d.salidas || 0}</b>.</div>
  <div class="decl">El evaluado declara haber rendido personalmente esta evaluación de ingreso, que reemplaza a la entrevista de ingreso, en un tiempo máximo de 50 minutos, sin ayuda de terceros ni material de consulta; que los datos consignados son correctos y que se encuentra conforme con el resultado. La evaluación fue registrada electrónicamente con fecha y hora del servidor, validación del DNI y firma manuscrita digital del evaluado.</div>
  <div class="firmas">
    <div class="firma">${d.firma ? `<img src="${d.firma}" alt="firma">` : `<div style="height:70px"></div>`}<div class="ln">Firma del evaluado<br><b>${esc(d.nombres)}</b><br>${d.firmado ? "Firmado: " + fCorta(d.firmado) + " " + fHora(d.firmado) : "Pendiente de firma"}</div></div>
    <div class="firma"><div style="height:70px"></div><div class="ln">Firma y sello del evaluador<br>Seguridad Industrial / SSOMA</div></div>
    <div class="qr">${qrSVG(url, 120)}<br>Verificar constancia</div>
  </div>
  <div class="pie">Documento generado por el Sistema de Evaluación de Ingreso SSOMA. Verificación en línea: ${esc(url)}</div>
</div>`;
}
