const { Dirent } = require("fs")
const { join } = require("path")
const { Server } = require("http")
const leeArchivo = require("./leeArchivo")
const leeArchivoJson = require("./leeArchivoJson")
const creaRuta = require("./creaRuta")
const sinExtension = require("./sinExtension")
const creaDirectorio = require("./creaDirectorio")
const cargaDirectorio = require("./cargaDirectorio")
const copiaDirectorio = require("./copiaDirectorio")
const eliminaDirectorio = require("./eliminaDirectorio")
const escribeArchivo = require("./escribeArchivo")
const express = require("express")

/**
 * @typedef {Object} Nodo
 * @property {number} i
 * @property {number} nivel
 * @property {string} origen
 * @property {string} destino
 * @property {string} ruta
 * @property {string} type
 * @property {boolean} esPruebaDeEscritorio
 * @property {string} orden
 * @property {string} h1
 * @property {string} title
 * @property {string} description
 * @property {string} printDescription
 * @property {Dirent} dirent
 * @property {Nodo[]} listado
 */

const JSON_EXT = ".json"
const SW_FILE = "sw.js";
const MACROS_FILE = "macros.json";
const MACRO_DIR = "lib/macro"
const JS_DIR = "lib/js"
const CONT_DIR = "cont";
const DEST_DIR = "docs";
const STATIC_DIR = "static"
const IMG_DIR = "img"
const SRC_DIR = "src"
const JS_DEST_DIR = "js"
const INDEX_JSON_FILE = "index.json";
const INDEX_HTML_FILE = "index.html";
const PRINT_FILE = "print.html";
const INDEX_RAIZ_FILE = "/index.html";
/** @type {Readonly<Set<string>>} */
const SW_OUT = new Set(["sw.js", "404.html", "README.md"])
const PLANTILLA_SW_FILE = "lib/plantilla/sw.js"
const PLANTILLA_INDEX_FILE = "lib/plantilla/index.html";
const PLANTILLA_LAYOUT_FILE = "lib/plantilla/layout.html"
const PLANTILLA_FILE = "lib/plantilla/plantilla.html";
const PLANTILLA_PRINT_FILE = "lib/plantilla/print.html";
const APP_MACRO = "$$app"
const INICIO_TXT = "Inicio"
const NIVEL_LECCION = 2

/** @type {String|null} */
let plantillaIndex = null
/** @type {String|null} */
let plantillaLayout = null
/** @type {String|null} */
let plantillaPlantilla = null
/** @type {String|null} */
let plantillaPrint = null

/** @type {Map<string, string>} */
const macros = new Map();
/** @type {Nodo[]} */
const nav = []

let siguiente = 0

function server() {
 const app = express()
 const server = new Server(app)
 app.use(express.static(DEST_DIR))
 server.listen(3000, () => console.log(`Escuchando puerto 3000.
http://localhost:3000`))
}

async function clean() {
 await eliminaDirectorio(DEST_DIR)
}

async function generaArchivos() {
 try {
  const dirents = await cargaDirectorio(".")
  const dirent = dirents.find(dirent => dirent.name === CONT_DIR)
  if (dirent) {
   leeMacros()
   await eliminaDirectorio(DEST_DIR)
   await creaDirectorio(DEST_DIR)
   await copiaDirectorio(STATIC_DIR, DEST_DIR)
   await copiaDirectorio(JS_DIR, join(DEST_DIR, JS_DEST_DIR))
   await copiaDirectorio(IMG_DIR, join(DEST_DIR, IMG_DIR))
   await copiaDirectorio(SRC_DIR, join(DEST_DIR, SRC_DIR))
   const nodo = await cargaNodo(1, "", dirent, CONT_DIR, DEST_DIR)
   creaNav(nodo.listado)
   await escribeNodos(nodo)
   await generaSw(DEST_DIR)
  }
 } catch (e) {
  console.error(e)
 }
}

/**
 * @param {string} directorio
 */
async function instala(directorio) {
 await generaArchivos()
 const dirents = await cargaDirectorio(directorio)
 for (const dirent of dirents) {
  if (!dirent.name.startsWith(".")) {
   await eliminaDirectorio(join(directorio, dirent.name))
  }
 }
 await copiaDirectorio(DEST_DIR, directorio)
}

/**
 * @param {number} nivel
 * @param {string} dirOrden
 * @param {Dirent} direntOrigen
 * @param {string} origen
 * @param {string} destino
 * @returns {Promise<Nodo>}
 */
async function cargaNodo(nivel, dirOrden, direntOrigen, origen, destino) {
 const dirents = await cargaDirectorio(origen)
 /** @type {Map<string|undefined, Dirent>} */
 const map = new Map(dirents.map(d => [d.name, d]))
 /** @type {Nodo[]} */
 const listado = []
 /** @type {{
  *     type?: string,
  *     esPruebaDeEscritorio?: boolean,
  *     h1?: string,
  *     title?: string,
  *     description?: string,
  *     printDescription?: string,
  *     listado?: {
  *      name?: string,
  *      esPruebaDeEscritorio?: boolean,
  *      h1?: string,
  *      title?: string,
  *      description?: string,
  *      printDescription?: string }[]}} */
 const json = await leeArchivoJson(join(origen, INDEX_JSON_FILE))
 const upperType = json.type ? json.type.toUpperCase() : ""
 const index = map.get(INDEX_HTML_FILE)
 if (index) {
  const nuevoOrigen = join(origen, index.name)
  const nuevoDestino = join(destino, index.name)
  listado.push({
   i: -1,
   nivel,
   origen: nuevoOrigen,
   destino: nuevoDestino,
   type: "",
   ruta: creaRuta(nuevoOrigen),
   orden: dirOrden,
   esPruebaDeEscritorio: json.esPruebaDeEscritorio || false,
   h1: json.h1 || json.title || "",
   title: json.title || "",
   description: json.description || "",
   printDescription: json.printDescription || "",
   dirent: index,
   listado: []
  })
 }
 let orden = json.type || ""
 if (json.listado) {
  for (const fileDesc of json.listado) {
   const dirent = map.get(fileDesc.name)
   if (dirent) {
    const nuevoOrigen = join(origen, dirent.name)
    const nuevoDestino = join(destino, dirent.name)
    if (dirent.isDirectory()) {
     const nodo =
      await cargaNodo(nivel + 1, orden, dirent, nuevoOrigen, nuevoDestino)
     listado.push(nodo)
    } else {
     listado.push({
      i: -1,
      nivel,
      origen: nuevoOrigen,
      destino: nuevoDestino,
      type: "",
      ruta: creaRuta(nuevoOrigen),
      orden,
      esPruebaDeEscritorio: fileDesc.esPruebaDeEscritorio || false,
      h1: fileDesc.h1 || fileDesc.title || "",
      title: fileDesc.title || "",
      description: fileDesc.description || "",
      printDescription: fileDesc.printDescription || "",
      dirent,
      listado: []
     })
    }
    orden = upperType ?
     (upperType === "A" ?
      String.fromCharCode(orden.charCodeAt(0) + 1) :
      (parseInt(orden) + 1).toString()) :
     ""
   } else {
    throw new Error(`No se encontró: ${join(origen, fileDesc.name || "")}`)
   }
  }
 }
 return {
  i: -1,
  nivel,
  origen,
  destino,
  ruta: creaRuta(origen),
  type: json.type || "",
  orden: dirOrden,
  esPruebaDeEscritorio: json.esPruebaDeEscritorio || false,
  h1: json.h1 || json.title || "",
  title: json.title || "",
  description: json.description || "",
  printDescription: json.printDescription || "",
  dirent: direntOrigen,
  listado
 }
}

/**
 * @param {Nodo[]} listado
 */
function creaNav(listado) {
 for (const nodo of listado) {
  if (nodo.dirent.isDirectory()) {
   creaNav(nodo.listado)
  } else {
   nodo.i = siguiente++
   nav.push(nodo)
  }
 }
}

async function leeMacros() {
 const archivos = await cargaDirectorio(MACRO_DIR)
 for (const archivo of archivos) {
  const nombre = archivo.name;
  const nom = sinExtension(nombre)
  const contenido = await leeArchivo(join(MACRO_DIR, nombre))
  macros.set("$$" + nom, contenido)
 }
 const config = await leeArchivoJson(MACROS_FILE)
 for (const i in config) {
  macros.set("$$" + i, config[i])
 }
}

/**
 * @param {Nodo} nodo
 */
async function escribeNodos(nodo) {
 let print = ""
 let listado = nodo.listado
 let len = listado.length
 if (len > 0) {
  let primerNodo = listado[0]
  if (primerNodo.dirent.isDirectory()) {
   if (primerNodo.listado.length > 0) {
    primerNodo = primerNodo.listado[0]
   }
  }
  let ultimoNodo = listado[listado.length - 1]
  if (ultimoNodo.dirent.isDirectory()) {
   if (ultimoNodo.listado.length > 0) {
    ultimoNodo = ultimoNodo.listado[ultimoNodo.listado.length - 1]
   }
  }
  const paginaAnterior = primerNodo.i > 0 ? nav[primerNodo.i - 1] : null
  let paginaSiguiente =
   ultimoNodo.i < nav.length - 1 ? nav[ultimoNodo.i + 1] : null
  const navHtml = creaNavHtml(nodo, paginaAnterior, paginaSiguiente)
  // console.log(subDestino)
  if (primerNodo.dirent.isDirectory()) {
   await creaDirectorio(primerNodo.destino);
   print += await escribeNodos(primerNodo)
  } else {
   print += await escribeNodo(navHtml, primerNodo)
  }
  for (let i = 1; i < len; i++) {
   const n = listado[i]
   // console.log(subDestino)
   if (n.dirent.isDirectory()) {
    await creaDirectorio(n.destino)
    print += /* html */
     `
     <section>
       ${await escribeNodos(n)}
      </section>`
   } else {
    const classList = n.esPruebaDeEscritorio ?
     `class="pruebaDeEscritorio"` : ""
    print += /* html */
     `
     <section ${classList}>
       ${await escribeNodo(navHtml, n)}
      </section>`
   }
  }
  await escribePrint(print, nodo)
 }
 return print;
}

/**
 * @param {string} print
 * @param {Nodo} nodo
 */
async function escribePrint(print, nodo) {
 let plantilla = await getPlantillaPrint()
 plantilla = plantilla.replace(/\$\$\w+/g, reemplazaMacro)
 plantilla = plantilla.replace(/%%\w+/g, txt => {
  switch (txt) {
   case "%%title": return nodo.title || ""
   case "%%description": return nodo.printDescription || ""
   case "%%contenido": return print
   default: return ""
  }
 })
 await escribeArchivo(join(nodo.destino, PRINT_FILE), plantilla)

}
/**
 * @param {string} destino
 */
async function generaSw(destino) {
 const swListado = await generaSwListado(destino)
 const listado = `[
  ${swListado.substring(0, swListado.lastIndexOf(","))} ]`
 let plantilla = await leeArchivo(PLANTILLA_SW_FILE)
 plantilla = plantilla.replace(/(\[\])|(\$\$\w+)/g, txt => {
  switch (txt) {
   case "[]": return listado
   default: return reemplazaMacro(txt)
  }
 })
 await escribeArchivo(join(DEST_DIR, SW_FILE), plantilla)
}

/**
 * @param {string} destino
 */
async function generaSwListado(destino) {
 let sw = ""
 const dirents = await cargaDirectorio(destino)
 for (const dirent of dirents) {
  const name = join(destino, dirent.name);
  if (dirent.isDirectory()) {
   sw += await generaSwListado(name)
  } else if (!SW_OUT.has(dirent.name)) {
   if (dirent.name.endsWith("index.html")) {
    const rutaDestino = creaRuta(destino)
    sw += `"${rutaDestino}/",
   `
    sw += `"${creaRuta(name)}",
   `
   } else {
    sw += `"${creaRuta(name)}",
   `
   }
  }
 }
 return sw
}

/**
 * @param {Nodo} nodo
 * @param {Nodo | null} paginaAnterior
 * @param {Nodo | null} paginaSiguiente
 */
function creaNavHtml(nodo, paginaAnterior, paginaSiguiente) {
 const listado = nodo.listado
 const type = nodo.type
 const len = listado.length
 let encabezado = /* html */
  `<p>
    <a href="${INDEX_RAIZ_FILE}"
      data-logo="true">${reemplazaMacro(APP_MACRO) || INICIO_TXT}</a>
   </p>`
 if (paginaAnterior && paginaAnterior.ruta !== INDEX_RAIZ_FILE) {
  const ruta = ajustaRuta(paginaAnterior)
  if (paginaAnterior.orden) {
   encabezado += /* html */
    `<p>
    <a class="paginaAnterior" href="${ruta}"
      title="${paginaAnterior.orden}. ${paginaAnterior.title}">▲</a>
   </p>`
  } else {
   encabezado += /* html */
    `<p>
    <a class="paginaAnterior" href="${ruta}"
      title="${paginaAnterior.title}">▲</a>
   </p>`
  }
 }
 if (len > 0) {
  if (listado[0].ruta === INDEX_RAIZ_FILE) {
   encabezado += /* html */
    `
     <h1>Lecciones</h1>`
  } else {
   const p = listado[0]
   const ruta = ajustaRuta(p)
   if (p.orden) {
    encabezado += /* html */
     `
     <h1><a href="${ruta}">${p.orden}. ${p.h1}</a></h1>`
   } else {
    encabezado += /* html */
     `
     <h1><a href="${ruta}">${p.h1}</a></h1>`
   }
  }
 }
 let simple = type ? /* html */
  `
   <ol type="${type}">` :
  /* html */
  `
   <ul>`

 for (let i = 1; i < listado.length; i++) {
  const p = listado[i];
  const ruta = ajustaRuta(p)
  simple += /* html */
   `
    <li>
     <p>
      <a href="${ruta}">${p.h1}</a>
     </p>
    </li>`
 }
 simple += type ? /* html */
  `
   </ol>`:
  /* html */
  `
   </ul>`
 let extendida = encabezado + simple
 if (paginaSiguiente) {
  const ruta = ajustaRuta(paginaSiguiente)
  extendida += /* html */
   `<p>
    <a class="paginaSiguiente" href="${ruta}"
      title="${paginaSiguiente.orden}. ${paginaSiguiente.title}">▼</a>
   </p>`
 }
 return { simple, extendida }
}

/**
 * @param {Nodo} p
 */
function ajustaRuta(p) {
 return p.dirent.isDirectory() ? p.ruta + "/" : p.ruta
}

/**
 * @param {{simple: string, extendida: string}} navHtml
 * @param {Nodo} nodo
 */
async function escribeNodo(navHtml, nodo) {
 const actual = nodo.ruta
 const anterior = nodo.i > 0 ? nav[nodo.i - 1] : null
 const siguiente = nodo.i < nav.length - 1 ? nav[nodo.i + 1] : null
 const navSimple = navHtml.simple
 const navExtendida = navHtml.
  extendida.replace(`"${actual}"`, `"${actual}" class="actual"`)
 let h1Class = nodo.ruta === INDEX_RAIZ_FILE ? `class="sitio"` :
  (nodo.nivel === NIVEL_LECCION && nodo.ruta.endsWith(INDEX_RAIZ_FILE) ?
   `class="leccion"` : "")
 let contenido = nodo.orden ? /* html */
  `  <h1 ${h1Class}>${nodo.orden}. ${nodo.h1}</h1>` :
  /* html */
  `  <h1 ${h1Class}>${nodo.h1}</h1>`
 if (nodo.dirent.name === INDEX_HTML_FILE) {
  contenido += /* html */
   `
   <div class="lectura"> 
    <p class="noPrint">
     <a href="print.html" target="_blank" rel="noopener">Versión para
      imprimir.</a>
    </p>
   </div>
`
 }
 contenido += await leeArchivo(nodo.origen)
 contenido = contenido.replace(/\$\$\w+/g, reemplazaMacro)
 let layout = await getPlantillaLayout()
 layout = layout.replace(/\$\$\w+/g, reemplazaMacro)
 const aAnterior = anterior ?
  (anterior.orden ?  /* html */
   `<a class="anterior" href="${anterior.ruta}" title="${anterior.orden}. ${anterior.title}">◀</a>` :
   /* html */
   `<a class="anterior" href="${anterior.ruta}" title="${anterior.title}">◀</a>`)
  : ""
 const aSiguiente = siguiente ?
  (siguiente.orden ? /* html */
   `<a class="siguiente" href="${siguiente.ruta}" title="${siguiente.orden}. ${siguiente.title}">▶</a>` :
   /* html */
   `<a class="siguiente" href="${siguiente.ruta}" title="${siguiente.title}">▶</a>`)
  : ""
 const title = nodo.orden ?
  `${nodo.orden}. ${nodo.title}` :
  nodo.title
 const classList = nodo.esPruebaDeEscritorio ? ` class="xmenu sinTransicion pruebaDeEscritorio"` : ` class="xmenu"`
 const reemplazaPropiedad = (/** @type {string} */ propiedad) => {
  switch (propiedad) {
   case "%%anterior": return aAnterior
   case "%%siguiente": return aSiguiente
   case "%%contenido": return contenido
   case "%%navExtendida": return navExtendida
   case "%%navSimple": return navSimple
   case "%%urlAnterior": return anterior ? anterior.ruta : ""
   case "%%urlSiguiente": return siguiente ? siguiente.ruta : ""
   case "%%layout": return layout
   case "%%title": return title
   case "%%class": return classList
   case "%%pres":
    return nodo.esPruebaDeEscritorio ? reemplazaMacro("$$pres") : ""
   case "%%description": return nodo.description
   default: return ""
  }
 }
 contenido = contenido.replace(/%%\w+/g, reemplazaPropiedad)
 layout = layout.replace(/%%\w+/g, reemplazaPropiedad)
 let plantilla = nodo.ruta === INDEX_RAIZ_FILE ?
  await getPlantillaIndex() :
  await getPlantillaPlantilla()
 plantilla = plantilla.replace(/\$\$\w+/g, reemplazaMacro)
 plantilla = plantilla.replace(/%%\w+/g, reemplazaPropiedad)
 await escribeArchivo(nodo.destino, plantilla)
 return contenido
}

/**
 * @param {string} texto
 */
function reemplazaMacro(texto) {
 return macros.get(texto) || ""
}

async function getPlantillaIndex() {
 if (!plantillaIndex) {
  plantillaIndex = await leeArchivo(PLANTILLA_INDEX_FILE)
 }
 return plantillaIndex
}

async function getPlantillaPlantilla() {
 if (!plantillaPlantilla) {
  plantillaPlantilla = await leeArchivo(PLANTILLA_FILE)
 }
 return plantillaPlantilla
}

async function getPlantillaLayout() {
 if (!plantillaLayout) {
  plantillaLayout = await leeArchivo(PLANTILLA_LAYOUT_FILE)
 }
 return plantillaLayout
}

async function getPlantillaPrint() {
 if (!plantillaPrint) {
  plantillaPrint = await leeArchivo(PLANTILLA_PRINT_FILE)
 }
 return plantillaPrint
}

module.exports = { generaArchivos, clean, server, instala }