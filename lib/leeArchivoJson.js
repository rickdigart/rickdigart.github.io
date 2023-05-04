const fs = require("fs/promises")
const leeArchivo = require("./leeArchivo")

/**
 * @param {import("fs").PathLike | fs.FileHandle} nombre
 */
async function leeArchivoJson(nombre) {
 try {
  return JSON.parse(await leeArchivo(nombre))
 } catch (e) {
  console.error(e)
  return {}
 }
}

module.exports = leeArchivoJson