const { mkdir } = require("fs/promises");

/**
 * @param {import("fs").PathLike} nombre
 */

async function creaDirectorio(nombre) {
 try {
  await mkdir(nombre)
 } catch (e) {
  console.error(e)
 }
}

module.exports = creaDirectorio;
