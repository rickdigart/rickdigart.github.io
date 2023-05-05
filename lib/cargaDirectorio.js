const fs = require("fs/promises");

/**
 * @param {import("fs").PathLike} nombre
 */
function cargaDirectorio(nombre) {
 return fs.readdir(nombre, { encoding: "utf8", withFileTypes: true });
}

module.exports = cargaDirectorio;
