/**
 * @param {string} archivo
 */
function sinExtension(archivo) {
 const index = archivo.lastIndexOf(".")
 return index >= 0 ? archivo.substring(0, index) : archivo
}

module.exports = sinExtension