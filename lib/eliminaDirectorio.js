const { rm } = require("fs/promises");

/**
 * @param {import("fs").PathLike} nombre
 */

async function eliminaDirectorio(nombre) {
 try {
  await rm(nombre, { force: true, recursive: true })
 } catch (e) {
  console.error(e)
 }
}

module.exports = eliminaDirectorio;
