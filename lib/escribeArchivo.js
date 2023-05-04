const fs = require("fs/promises");

/**
 * @param {import("fs").PathLike | fs.FileHandle} nombre
 * @param {string} contenido
 */

async function escribeArchivo(nombre, contenido) {
 try {
  return fs.writeFile(nombre, contenido, "utf8");
 } catch (err) {
  console.error(err);
 }
}
module.exports = escribeArchivo;
