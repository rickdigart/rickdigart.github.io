const fs = require("fs/promises")

/**
 * @param {import("fs").PathLike | fs.FileHandle} nombre
 */
async function leeArchivo(nombre) {
 return (await fs.readFile(nombre)).toString()
}

module.exports = leeArchivo