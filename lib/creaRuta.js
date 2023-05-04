/**
 * @param {string} archivo
 */
function creaRuta(archivo) {
 archivo = archivo.replace(/\\/g, "/")
 const primeraDiagonal = archivo.indexOf("/")
 return (primeraDiagonal >= 0 ? archivo.substring(primeraDiagonal) : "")
}

module.exports = creaRuta