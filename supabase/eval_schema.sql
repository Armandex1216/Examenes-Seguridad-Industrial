-- Sistema de Evaluación de Ingreso SSOMA · tablas propias con prefijo eval_
-- No toca ninguna tabla diapo_ ni otras existentes.

create table if not exists public.eval_config (k text primary key, v text not null);
create table if not exists public.eval_jornadas (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  titulo text not null default 'Evaluación de ingreso',
  estado text not null default 'abierta' check (estado in ('abierta','cerrada')),
  creado timestamptz not null default now()
);
create table if not exists public.eval_participantes (
  id uuid primary key default gen_random_uuid(),
  jornada_id uuid not null references public.eval_jornadas(id) on delete cascade,
  dni text not null,
  nombres text not null,
  empresa text,
  tipo text,              -- CIA / CONTRATISTA
  cargo text,
  pets_codigo text,
  pets_nombre text,
  area text,
  estado text not null default 'pendiente' check (estado in ('pendiente','en_curso','finalizado')),
  intento int not null default 1,
  inicio timestamptz,
  fin timestamptz,
  correctas int, total int, nota numeric(5,2), aprobado boolean,
  salidas int default 0,
  secciones jsonb,         -- puntaje por sección
  respuestas jsonb,        -- copia íntegra del examen rendido (pregunta, opciones, marcada, correcta)
  firma text,              -- firma manuscrita (PNG comprimido)
  firmado timestamptz,
  codigo text unique,      -- código de verificación de la constancia
  historial jsonb not null default '[]'::jsonb,  -- intentos anteriores si se reinicia
  unique (jornada_id, dni)
);
create index if not exists eval_part_jornada on public.eval_participantes(jornada_id);
create table if not exists public.eval_pets_propios (
  codigo text primary key,
  nombre text not null,
  area text,
  base text,                         -- código del catálogo en que se basa (hereda riesgos)
  familias text[] not null default '{}',
  preguntas jsonb not null default '[]'::jsonb,  -- [[pregunta, correcta, inc1, inc2, inc3], ...]
  actualizado timestamptz not null default now()
);

alter table public.eval_config enable row level security;
alter table public.eval_jornadas enable row level security;
alter table public.eval_participantes enable row level security;
alter table public.eval_pets_propios enable row level security;
-- Sin políticas: el acceso público se hace solo por las funciones de abajo.

insert into public.eval_config(k,v) values ('pin', encode(extensions.digest('463549','sha256'),'hex'))
on conflict (k) do nothing;

create or replace function public.eval_hoy() returns date language sql stable as
$$ select (now() at time zone 'America/Lima')::date $$;

create or replace function public.eval_norm(t text) returns text language sql immutable as
$$ select translate(lower(coalesce(t,'')),'áéíóúüñàèìòù','aeiouunaeiou') $$;

create or replace function public.eval_pin_ok(p_pin text) returns boolean
language plpgsql security definer set search_path = public as $$
declare ok boolean;
begin
  select v = encode(extensions.digest(coalesce(p_pin,''),'sha256'),'hex') into ok from eval_config where k='pin';
  if not coalesce(ok,false) then perform pg_sleep(1); end if;
  return coalesce(ok,false);
end $$;

-- ================= PÚBLICO (trabajador) =================
create or replace function public.eval_jornadas_activas()
returns table(id uuid, fecha date, titulo text, n int)
language sql security definer set search_path = public as $$
  select j.id, j.fecha, j.titulo, (select count(*)::int from eval_participantes p where p.jornada_id=j.id)
  from eval_jornadas j
  where j.estado='abierta' and j.fecha between eval_hoy()-1 and eval_hoy()+1
  order by j.fecha desc, j.creado desc
$$;

create or replace function public.eval_buscar(p_jornada uuid, p_q text)
returns table(id uuid, nombres text, empresa text, cargo text, estado text)
language sql security definer set search_path = public as $$
  select p.id, p.nombres, p.empresa, p.cargo, p.estado
  from eval_participantes p join eval_jornadas j on j.id=p.jornada_id
  where p.jornada_id=p_jornada and j.estado='abierta' and length(trim(p_q))>=3
    and (eval_norm(p.nombres) like '%'||eval_norm(trim(p_q))||'%' or p.dni = trim(p_q))
  order by p.nombres limit 12
$$;

create or replace function public.eval_iniciar(p_id uuid, p_dni text, p_comenzar boolean default false)
returns json language plpgsql security definer set search_path = public as $$
declare r eval_participantes; j eval_jornadas;
begin
  select * into r from eval_participantes where id=p_id;
  if r.id is null or r.dni <> trim(p_dni) then raise exception 'DNI_INCORRECTO'; end if;
  select * into j from eval_jornadas where id=r.jornada_id;
  if j.estado <> 'abierta' and r.estado <> 'finalizado' then raise exception 'JORNADA_CERRADA'; end if;
  if p_comenzar and r.estado='pendiente' then
    update eval_participantes set estado='en_curso', inicio=now() where id=p_id returning * into r;
  end if;
  return json_build_object('id',r.id,'dni',r.dni,'nombres',r.nombres,'empresa',r.empresa,'tipo',r.tipo,
    'cargo',r.cargo,'pets_codigo',r.pets_codigo,'pets_nombre',r.pets_nombre,'area',r.area,'estado',r.estado,
    'intento',r.intento,'inicio',r.inicio,'fin',r.fin,'ahora',now(),'fecha',j.fecha,'jornada',j.titulo,
    'correctas',r.correctas,'total',r.total,'nota',r.nota,'aprobado',r.aprobado,'secciones',r.secciones,
    'codigo',r.codigo,'firmado',r.firmado);
end $$;

create or replace function public.eval_enviar(p_id uuid, p_dni text, p_resp jsonb, p_correctas int, p_total int,
  p_secciones jsonb, p_salidas int)
returns json language plpgsql security definer set search_path = public as $$
declare r eval_participantes; v_cod text; v_nota numeric;
begin
  select * into r from eval_participantes where id=p_id for update;
  if r.id is null or r.dni <> trim(p_dni) then raise exception 'DNI_INCORRECTO'; end if;
  if r.estado='finalizado' then raise exception 'YA_FINALIZADO'; end if;
  if r.estado<>'en_curso' then raise exception 'NO_INICIADO'; end if;
  if p_total<=0 or p_correctas<0 or p_correctas>p_total then raise exception 'DATOS_INVALIDOS'; end if;
  v_cod := upper(substr(encode(extensions.gen_random_bytes(6),'hex'),1,4)||'-'||substr(encode(extensions.gen_random_bytes(6),'hex'),1,4));
  v_nota := round(p_correctas::numeric*20/p_total,2);
  update eval_participantes set estado='finalizado', fin=now(), correctas=p_correctas, total=p_total,
    nota=v_nota, aprobado=(p_correctas::numeric/p_total)>=0.75, secciones=p_secciones,
    respuestas=p_resp, salidas=coalesce(p_salidas,0), codigo=v_cod
  where id=p_id returning * into r;
  return json_build_object('codigo',r.codigo,'nota',r.nota,'aprobado',r.aprobado,'correctas',r.correctas,
    'total',r.total,'inicio',r.inicio,'fin',r.fin,
    'fuera_de_tiempo', extract(epoch from (r.fin-r.inicio)) > 53*60);
end $$;

create or replace function public.eval_firmar(p_id uuid, p_dni text, p_firma text)
returns json language plpgsql security definer set search_path = public as $$
declare r eval_participantes;
begin
  select * into r from eval_participantes where id=p_id;
  if r.id is null or r.dni <> trim(p_dni) then raise exception 'DNI_INCORRECTO'; end if;
  if r.estado<>'finalizado' then raise exception 'NO_FINALIZADO'; end if;
  if r.firmado is not null then raise exception 'YA_FIRMADO'; end if;
  if length(p_firma) > 120000 or p_firma not like 'data:image/%' then raise exception 'FIRMA_INVALIDA'; end if;
  update eval_participantes set firma=p_firma, firmado=now() where id=p_id;
  return json_build_object('ok',true,'codigo',r.codigo);
end $$;

-- Constancia pública por código (verificación)
create or replace function public.eval_constancia(p_codigo text)
returns json language sql security definer set search_path = public as $$
  select json_build_object('nombres',p.nombres,'dni','****'||right(p.dni,4),'empresa',p.empresa,'tipo',p.tipo,
    'cargo',p.cargo,'pets_codigo',p.pets_codigo,'pets_nombre',p.pets_nombre,'area',p.area,'fecha',j.fecha,
    'jornada',j.titulo,'inicio',p.inicio,'fin',p.fin,'correctas',p.correctas,'total',p.total,'nota',p.nota,
    'aprobado',p.aprobado,'secciones',p.secciones,'salidas',p.salidas,'firma',p.firma,'firmado',p.firmado,
    'codigo',p.codigo,'intento',p.intento)
  from eval_participantes p join eval_jornadas j on j.id=p.jornada_id
  where p.codigo = upper(trim(p_codigo))
$$;

create or replace function public.eval_pets_lista()
returns setof eval_pets_propios language sql security definer set search_path = public as $$
  select * from eval_pets_propios order by codigo
$$;

-- ================= ADMIN (con PIN) =================
create or replace function public.eval_admin_login(p_pin text) returns boolean
language sql security definer set search_path = public as $$ select eval_pin_ok(p_pin) $$;

create or replace function public.eval_admin_jornadas(p_pin text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  return coalesce((select json_agg(x order by x.fecha desc, x.creado desc) from (
    select j.*, count(p.id)::int n, count(p.id) filter (where p.estado='finalizado')::int fin,
      count(p.id) filter (where p.aprobado)::int aprob, round(avg(p.nota),2) prom
    from eval_jornadas j left join eval_participantes p on p.jornada_id=j.id group by j.id) x),'[]'::json);
end $$;

create or replace function public.eval_admin_crear(p_pin text, p_fecha date, p_titulo text, p_filas jsonb, p_jornada uuid default null)
returns json language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_n int;
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  if p_jornada is null then
    insert into eval_jornadas(fecha,titulo) values (p_fecha, coalesce(nullif(trim(p_titulo),''),'Evaluación de ingreso')) returning id into v_id;
  else v_id := p_jornada; end if;
  insert into eval_participantes(jornada_id,dni,nombres,empresa,tipo,cargo,pets_codigo,pets_nombre,area)
  select v_id, trim(f->>'dni'), upper(trim(f->>'nombres')), upper(trim(f->>'empresa')), upper(trim(f->>'tipo')),
         upper(trim(f->>'cargo')), upper(trim(f->>'pets_codigo')), trim(f->>'pets_nombre'), upper(trim(f->>'area'))
  from jsonb_array_elements(p_filas) f
  where coalesce(trim(f->>'dni'),'')<>'' and coalesce(trim(f->>'nombres'),'')<>''
  on conflict (jornada_id,dni) do update set nombres=excluded.nombres, empresa=excluded.empresa, tipo=excluded.tipo,
    cargo=excluded.cargo, pets_codigo=excluded.pets_codigo, pets_nombre=excluded.pets_nombre, area=excluded.area
    where eval_participantes.estado='pendiente';
  get diagnostics v_n = row_count;
  return json_build_object('id',v_id,'n',v_n);
end $$;

create or replace function public.eval_admin_detalle(p_pin text, p_jornada uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  return coalesce((select json_agg(x order by x.nombres) from (
    select id,dni,nombres,empresa,tipo,cargo,pets_codigo,pets_nombre,area,estado,intento,inicio,fin,correctas,total,
      nota,aprobado,salidas,secciones,codigo,firmado, (firma is not null) tiene_firma
    from eval_participantes where jornada_id=p_jornada) x),'[]'::json);
end $$;

create or replace function public.eval_admin_participante(p_pin text, p_id uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  return (select row_to_json(p) from eval_participantes p where id=p_id);
end $$;

create or replace function public.eval_admin_accion(p_pin text, p_accion text, p_id uuid, p_valor text default null)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  if p_accion='cerrar' then update eval_jornadas set estado='cerrada' where id=p_id;
  elsif p_accion='abrir' then update eval_jornadas set estado='abierta' where id=p_id;
  elsif p_accion='renombrar' then update eval_jornadas set titulo=p_valor where id=p_id;
  elsif p_accion='fecha' then update eval_jornadas set fecha=p_valor::date where id=p_id;
  elsif p_accion='borrar_jornada' then delete from eval_jornadas where id=p_id;
  elsif p_accion='borrar_participante' then delete from eval_participantes where id=p_id;
  elsif p_accion='reiniciar' then
    update eval_participantes set
      historial = historial || case when estado='pendiente' then '[]'::jsonb else jsonb_build_array(jsonb_build_object(
        'intento',intento,'inicio',inicio,'fin',fin,'correctas',correctas,'total',total,'nota',nota,
        'aprobado',aprobado,'salidas',salidas,'codigo',codigo,'firmado',firmado,'reiniciado',now())) end,
      intento = intento + case when estado='pendiente' then 0 else 1 end,
      estado='pendiente', inicio=null, fin=null, correctas=null, total=null, nota=null, aprobado=null,
      salidas=0, secciones=null, respuestas=null, firma=null, firmado=null, codigo=null
    where id=p_id;
  elsif p_accion='pin' then
    if length(coalesce(p_valor,''))<4 then raise exception 'PIN_CORTO'; end if;
    update eval_config set v=encode(extensions.digest(p_valor,'sha256'),'hex') where k='pin';
  else raise exception 'ACCION_DESCONOCIDA'; end if;
  return json_build_object('ok',true);
end $$;

create or replace function public.eval_admin_pets_guardar(p_pin text, p_codigo text, p_nombre text, p_area text,
  p_base text, p_familias text[], p_preguntas jsonb)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  insert into eval_pets_propios(codigo,nombre,area,base,familias,preguntas,actualizado)
  values (upper(trim(p_codigo)), trim(p_nombre), p_area, nullif(upper(trim(p_base)),''), coalesce(p_familias,'{}'), coalesce(p_preguntas,'[]'), now())
  on conflict (codigo) do update set nombre=excluded.nombre, area=excluded.area, base=excluded.base,
    familias=excluded.familias, preguntas=excluded.preguntas, actualizado=now();
  return json_build_object('ok',true);
end $$;

create or replace function public.eval_admin_pets_borrar(p_pin text, p_codigo text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not eval_pin_ok(p_pin) then raise exception 'PIN_INCORRECTO'; end if;
  delete from eval_pets_propios where codigo=p_codigo;
  return json_build_object('ok',true);
end $$;

-- Solo las funciones públicas quedan expuestas al rol anon; las internas no.
revoke all on function public.eval_pin_ok(text) from public, anon, authenticated;
revoke all on table public.eval_config, public.eval_jornadas, public.eval_participantes, public.eval_pets_propios from anon, authenticated;

alter function public.eval_hoy() set search_path = public;
alter function public.eval_norm(text) set search_path = public;
