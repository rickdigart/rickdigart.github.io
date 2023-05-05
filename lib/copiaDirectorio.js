const {cp} = require("fs/promises")

/**
 * @param {string} origen
 * @param {string} destino
 */
async function copiaDirectorio(origen, destino) {
 return cp(origen, destino, { recursive: true })
}

module.exports = copiaDirectorio