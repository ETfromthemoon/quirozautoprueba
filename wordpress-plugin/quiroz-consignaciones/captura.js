'use strict';
const tomas = [
  ['Frente, lado del conductor', 'Desde la esquina delantera del conductor, incluye el parachoques y todo el costado.'],
  ['Parte trasera, lado del acompañante', 'Camina en diagonal hasta ver el portalón y el costado del acompañante completos.'],
  ['Frente, lado del acompañante', 'Muestra el frente y el costado del acompañante en una sola foto horizontal.'],
  ['Parte trasera, lado del conductor', 'Desde la esquina trasera del conductor, encuadra el portalón y ambas ruedas de ese lado.'],
  ['Frente completo', 'Párate al centro frente al auto. Deja el mismo espacio a cada lado de los espejos.'],
  ['Parte trasera completa', 'Centra el portalón y deja visibles los dos focos y el parachoques.'],
  ['Puesto del conductor', 'Abre la puerta del conductor. Desde afuera, muestra el asiento, el volante y el tablero.'],
  ['Puerta del conductor', 'Encuadra por dentro la manilla, el apoyabrazos y los botones de los vidrios.'],
  ['Asientos traseros', 'Abre una puerta trasera y muestra la banca completa y el espacio para las piernas.'],
  ['Panel de la puerta trasera', 'Con la puerta abierta, fotografía de frente la manilla y el apoyabrazos interior.'],
  ['Cabina desde atrás', 'Desde el centro de la banca trasera, muestra el tablero entre los dos asientos delanteros.'],
  ['Consola para pasajeros traseros', 'Desde atrás, apunta al espacio entre los asientos delanteros. Incluye las salidas de aire si las tiene.'],
  ['Tablero de instrumentos', 'Con el vehículo estacionado, enciende el tablero. Centra los indicadores y enfoca el kilometraje.'],
  ['Volante', 'Desde el asiento del conductor, incluye el aro completo y sus mandos.'],
  ['Radio o pantalla central', 'Fotografía de frente la pantalla encendida o la radio que trae tu auto.'],
  ['Cámara o asistencia de estacionamiento', 'Con el vehículo detenido, muestra la vista de estacionamiento. Si no tiene cámara, muestra otra función de la radio.'],
  ['Botonera central', 'Acércate a los mandos bajo la radio. Procura que sus símbolos se lean.'],
  ['Palanca y consola central', 'Desde arriba, muestra la palanca de cambios y los controles que la rodean.'],
  ['Tablero y consola en diagonal', 'Desde el lado del conductor, encuadra la pantalla, la palanca y el asiento del acompañante.'],
  ['Mandos junto al volante', 'Acércate al extremo del tablero junto a la puerta del conductor. Incluye los botones o la salida de aire.']
];
const el = id => document.getElementById(id);
const { api, ficha, ref } = el('captura').dataset;
const [vence, firma] = location.hash.slice(1).split('.');
let paso = 1, estado, db, pendiente, ocupado = false, objectUrl;
const clave = api + '/' + ficha;
const texto = msg => { el('estado').textContent = msg; };
const mostrar = (id, visible) => { el(id).hidden = !visible; };
function transaccion(modo, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('borradores', modo);
    const req = fn(tx.objectStore('borradores'));
    tx.oncomplete = () => resolve(req.result);
    tx.onabort = tx.onerror = () => reject(tx.error || Error('No se pudo guardar en este dispositivo.'));
  });
}
async function abrirDB() {
  db = await new Promise((resolve, reject) => {
    const req = indexedDB.open('quiroz-fotos', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('borradores');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(Error('Permite el almacenamiento del navegador y vuelve a intentar.'));
  });
}
async function pedir(operacion, blob) {
  const body = new FormData();
  for (const [k,v] of Object.entries({action:'qz_fotos', operacion, ficha, vence, firma, toma:paso})) body.append(k,v);
  if (blob) body.append('foto',blob,'vehiculo.jpg');
  const resp = await fetch(api,{ method:'POST',body,cache:'no-store' });
  if (operacion === 'ver' && resp.ok && resp.headers.get('content-type') === 'image/jpeg') return resp.blob();
  const json = await resp.json();
  if (!json.success) throw Error(json.data || 'No se pudo conectar.');
  return json.data;
}
async function fotoReducida(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url;
    try { await img.decode(); } catch { throw Error('Este formato no se pudo abrir. Elige una foto JPEG o toma otra.'); }
    const escala = Math.min(1, 1800 / Math.max(img.width,img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1,Math.round(img.width*escala));
    canvas.height = Math.max(1,Math.round(img.height*escala));
    canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    for (const calidad of [.85,.72,.55]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/jpeg',calidad));
      if (blob && blob.size <= 1200000) return blob;
    }
    throw Error('Prueba con una foto de menor resolución.');
  } finally { URL.revokeObjectURL(url); }
}
function vista(blob) {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  mostrar('vista',!!blob);
  if (blob) { objectUrl = URL.createObjectURL(blob); el('preview').src = objectUrl; }
}
async function dibujar() {
  mostrar('paso',!estado.enviadas);
  mostrar('enviar',!estado.enviadas && estado.guardadas.length === 20 && !pendiente);
  mostrar('reintentar',!!pendiente && !estado.enviadas);
  vista(null);
  if (estado.enviadas) { texto('Recibimos tus 20 fotos. Ya puedes cerrar esta página.'); return; }
  const guardada = estado.guardadas.includes(paso);
  el('indice').value = paso;
  for (const op of el('indice').options) op.text = op.value + ' de 20' + (estado.guardadas.includes(Number(op.value)) ? ' · guardada' : '');
  el('titulo').textContent = tomas[paso-1][0];
  el('guia').textContent = tomas[paso-1][1];
  el('ejemplo').src = ref + paso + '.jpg';
  el('ejemplo').alt = 'Ejemplo de ' + tomas[paso-1][0].toLowerCase();
  el('camara').textContent = guardada || pendiente ? 'Volver a tomar' : 'Tomar foto';
  mostrar('siguiente',guardada && paso < 20 && !pendiente);
  texto(pendiente ? 'Foto guardada en este dispositivo. Reintenta la subida para continuar.' :
    estado.guardadas.length + ' de 20 fotos subidas.' + (estado.guardadas.length === 20 ? ' Revisa tus fotos y pulsa Enviar.' : ' Puedes retomar con el mismo enlace.'));
  if (pendiente) vista(pendiente.blob);
  else if (guardada) vista(await pedir('ver'));
}
async function accion(fn) {
  if (ocupado) return;
  ocupado = true;
  document.querySelectorAll('button,select').forEach(b => b.disabled = true);
  try { await fn(); }
  catch (e) {
    texto((e instanceof TypeError ? 'Comprueba tu conexión.' : e.message) + (pendiente ? ' Tu foto sigue guardada en este dispositivo.' : ''));
    mostrar('reintentar',true);
  } finally {
    ocupado = false;
    document.querySelectorAll('button,select').forEach(b => b.disabled = false);
    el('indice').disabled = !!pendiente;
  }
}
async function subir() {
  texto('Subiendo tu foto…');
  estado = await pedir('guardar',pendiente.blob);
  await transaccion('readwrite', s => {
    const req = s.get(clave);
    req.onsuccess = () => { if (req.result?.id === pendiente.id) s.delete(clave); };
    return req;
  });
  pendiente = null;
  paso = tomas.findIndex((_,i) => !estado.guardadas.includes(i+1)) + 1 || paso;
  await dibujar();
}
async function inicio() {
  if (!db) await abrirDB();
  pendiente = await transaccion('readonly',s => s.get(clave));
  estado = await pedir('estado');
  if (estado.enviadas && pendiente) {
    await transaccion('readwrite',s => s.delete(clave));
    pendiente = null;
  }
  paso = pendiente?.paso || tomas.findIndex((_,i) => !estado.guardadas.includes(i+1)) + 1 || 20;
  await dibujar();
}
tomas.forEach((_,i) => el('indice').add(new Option(String(i+1),String(i+1))));
for (const [boton,input] of [['camara','archivoCamara'],['galeria','archivoGaleria']]) {
  el(boton).onclick = () => el(input).click();
  el(input).onchange = () => accion(async () => {
    const file = el(input).files[0]; el(input).value = '';
    if (!file) return;
    const borrador = {id:Date.now() + Math.random(),paso,blob:await fotoReducida(file)};
    await transaccion('readwrite',s => s.put(borrador,clave));
    pendiente = borrador; vista(pendiente.blob); mostrar('siguiente',false); mostrar('enviar',false);
    await subir();
  });
}
el('indice').onchange = () => accion(async () => { paso = Number(el('indice').value); await dibujar(); });
el('siguiente').onclick = () => accion(async () => { paso++; await dibujar(); });
el('reintentar').onclick = () => accion(pendiente && estado ? subir : inicio);
el('enviar').onclick = () => accion(async () => { estado = await pedir('enviar'); await dibujar(); });
accion(inicio);
