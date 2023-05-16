/// <reference lib="webworker" />

/* Espera 11 minutos después de hacer los cambios en tu sitio, para depués
 * actualizar este archivo. */

const CACHE = "cache"

const VERSION = "1.23"

const ARCHIVOS = [
  "/favicon.ico",
   "/img/icono/160x30.png",
   "/img/icono/160x30.webp",
   "/img/icono/80x15.png",
   "/img/icono/icono2048.png",
   "/img/icono/maskable_icon.png",
   "/img/icono/maskable_icon_x128.png",
   "/img/icono/maskable_icon_x192.png",
   "/img/icono/maskable_icon_x384.png",
   "/img/icono/maskable_icon_x48.png",
   "/img/icono/maskable_icon_x512.png",
   "/img/icono/maskable_icon_x72.png",
   "/img/icono/maskable_icon_x96.png",
   "/img/m02elementos/color.gif",
   "/img/m02elementos/continuidad.jpg",
   "/img/m02elementos/contraste.jpg",
   "/img/m02elementos/formas.png",
   "/img/m02elementos/iloveyou.jpg",
   "/img/m02elementos/Imagen.jpg",
   "/img/m02elementos/pexels-erik-mclean-4365459.jpg",
   "/img/m02elementos/pexels-evie-shaffer-2395255.jpg",
   "/img/m02elementos/pexels-valeriia-miller-2530912.jpg",
   "/img/m02elementos/pregnancia.png",
   "/img/m02elementos/proximidad.jpg",
   "/img/m02elementos/psicol.jpg",
   "/img/m02elementos/semejanza.png",
   "/img/m03fases/like.svg",
   "/img/m03fases/presentacion1.svg",
   "/img/m03fases/presentacion2.svg",
   "/img/m03fases/presentacion3.svg",
   "/img/m03fases/produccion.svg",
   "/img/m03fases/producto.svg",
   "/img/m05derechos/creative1.jpg",
   "/img/m05derechos/creative2.jpg",
   "/img/m05derechos/derechos.jpg",
   "/img/m05derechos/indautor.png",
   "/img/m06herramientas/1087px-HuaweiRH2288HV2.jpg",
   "/img/m06herramientas/aplicar1.webp",
   "/img/m06herramientas/aplicar2.webp",
   "/img/m06herramientas/calibracion1.webp",
   "/img/m06herramientas/calibracion10.webp",
   "/img/m06herramientas/calibracion10_5.webp",
   "/img/m06herramientas/calibracion11.webp",
   "/img/m06herramientas/calibracion11_5.webp",
   "/img/m06herramientas/calibracion12.webp",
   "/img/m06herramientas/calibracion2.webp",
   "/img/m06herramientas/calibracion3.webp",
   "/img/m06herramientas/calibracion4.webp",
   "/img/m06herramientas/calibracion5.webp",
   "/img/m06herramientas/calibracion6.webp",
   "/img/m06herramientas/calibracion7.webp",
   "/img/m06herramientas/calibracion8.webp",
   "/img/m06herramientas/calibracion8_5.webp",
   "/img/m06herramientas/calibracion9.webp",
   "/img/m06herramientas/calibracion9_5.webp",
   "/img/m06herramientas/camara.png",
   "/img/m06herramientas/capas.svg",
   "/img/m06herramientas/cleartype1.webp",
   "/img/m06herramientas/cleartype2.webp",
   "/img/m06herramientas/cleartype3.webp",
   "/img/m06herramientas/cleartype3_5.webp",
   "/img/m06herramientas/cleartype4.webp",
   "/img/m06herramientas/Dibujo de Google.png",
   "/img/m06herramientas/Efectos.gif",
   "/img/m06herramientas/ejemplo_svg.svg",
   "/img/m06herramientas/escanners.png",
   "/img/m06herramientas/filtros.gif",
   "/img/m06herramientas/fotos.png",
   "/img/m06herramientas/GIMP_2.10.jpg",
   "/img/m06herramientas/inkscape.png",
   "/img/m06herramientas/macos-1152.webp",
   "/img/m06herramientas/macos-640.webp",
   "/img/m06herramientas/Mascaras.gif",
   "/img/m06herramientas/nvidia rtx 3080.webp",
   "/img/m06herramientas/paint 3D.png",
   "/img/m06herramientas/Paint.png",
   "/img/m06herramientas/perfil0.webp",
   "/img/m06herramientas/perfil1.webp",
   "/img/m06herramientas/perfil2.webp",
   "/img/m06herramientas/perfil3.webp",
   "/img/m06herramientas/perfil4.webp",
   "/img/m06herramientas/perfil5.webp",
   "/img/m06herramientas/perfil6.webp",
   "/img/m06herramientas/pexels-andrea-piacquadio-3831873.jpg",
   "/img/m06herramientas/pexels-karolina-grabowska-4491445.jpg",
   "/img/m06herramientas/pexels-ketut-subiyanto-4474047.jpg",
   "/img/m06herramientas/pexels-luis-quintero-2942361.jpg",
   "/img/m06herramientas/pexels-pok-rie-1432673-1920.webp",
   "/img/m06herramientas/pexels-pok-rie-1432673-640.webp",
   "/img/m06herramientas/pexels-sergei-starostin-6429162.jpg",
   "/img/m06herramientas/pexels-shvets-production-8972802.jpg",
   "/img/m06herramientas/pexels-valentine-tanasovich-2588757-1920.webp",
   "/img/m06herramientas/pexels-valentine-tanasovich-2588757-640.webp",
   "/img/m06herramientas/photopea.png",
   "/img/m06herramientas/photoshop.png",
   "/img/m06herramientas/Portada-illustrator-805x452.jpg",
   "/img/m06herramientas/readoen pro w6800.webp",
   "/img/m06herramientas/recortes.png",
   "/img/m06herramientas/Trazos.gif",
   "/img/m06herramientas/visor 3D.png",
   "/img/m06herramientas/windows10-1920.webp",
   "/img/m06herramientas/windows10-640.webp",
   "/",
   "/index.html",
   "/js/muestra-codigo.js",
   "/m01conceptos/",
   "/m01conceptos/index.html",
   "/m01conceptos/mAintroDisGraf.html",
   "/m01conceptos/mBdisGraf.html",
   "/m01conceptos/mCfunsDisGraf.html",
   "/m01conceptos/mDapsDisGraf.html",
   "/m01conceptos/mEintroCreat.html",
   "/m01conceptos/mFcreat.html",
   "/m01conceptos/mGfunCreat.html",
   "/m01conceptos/mHapsCreat.html",
   "/m01conceptos/print.html",
   "/m02elementos/",
   "/m02elementos/index.html",
   "/m02elementos/mAtexto.html",
   "/m02elementos/mBformas.html",
   "/m02elementos/mCcolor.html",
   "/m02elementos/mDimagen.html",
   "/m02elementos/mEfigura.html",
   "/m02elementos/mFfondo.html",
   "/m02elementos/mGpregnancia.html",
   "/m02elementos/mHsimplicidad.html",
   "/m02elementos/mIproximidad.html",
   "/m02elementos/mJsemejanza.html",
   "/m02elementos/mKcontraste.html",
   "/m02elementos/mLcontinuidad.html",
   "/m02elementos/mMpsiColor.html",
   "/m02elementos/print.html",
   "/m03fases/",
   "/m03fases/index.html",
   "/m03fases/mAfases.html",
   "/m03fases/mBanalitica.html",
   "/m03fases/mCdefinicion.html",
   "/m03fases/mDplan.html",
   "/m03fases/mElistado.html",
   "/m03fases/mFcreativa.html",
   "/m03fases/mGanalisis.html",
   "/m03fases/mHbocetaje.html",
   "/m03fases/mIevolucion.html",
   "/m03fases/mIpreseleccion.html",
   "/m03fases/mJpresentacion.html",
   "/m03fases/mKseleccion.html",
   "/m03fases/mLrefinado.html",
   "/m03fases/mMdesarrollo.html",
   "/m03fases/mNvalidacion.html",
   "/m03fases/mOrefinadoPru.html",
   "/m03fases/mPaprobacion.html",
   "/m03fases/mQadaptacion.html",
   "/m03fases/mRpreparar.html",
   "/m03fases/mSsolucion.html",
   "/m03fases/print.html",
   "/m04composicion.html",
   "/m05derechos/",
   "/m05derechos/index.html",
   "/m05derechos/mAderechos.html",
   "/m05derechos/mBindautor.html",
   "/m05derechos/mCestablecer.html",
   "/m05derechos/mDcreative.html",
   "/m05derechos/mElicenciasC.html",
   "/m05derechos/print.html",
   "/m06herramientas/",
   "/m06herramientas/index.html",
   "/m06herramientas/mAhardware.html",
   "/m06herramientas/mBsoftware.html",
   "/m06herramientas/mCentorno.html",
   "/m06herramientas/mDcalibracion.html",
   "/m06herramientas/mEpaletaC.html",
   "/m06herramientas/mFcapas.html",
   "/m06herramientas/mGformas.html",
   "/m06herramientas/mHtrazos.html",
   "/m06herramientas/mIvectores.html",
   "/m06herramientas/mJfiltros.html",
   "/m06herramientas/mKmascaras.html",
   "/m06herramientas/mLefectos.html",
   "/m06herramientas/mMformatos.html",
   "/m06herramientas/print.html",
   "/print.html",
   "/site.webmanifest" ]

if (self instanceof ServiceWorkerGlobalScope) {
 self.addEventListener("install", installListener)
 self.addEventListener("fetch", fetchListener)
 self.addEventListener("activate", () => console.log("Service Worker activo."))
}

/**
 * @param {ExtendableEvent} evt
 */
function installListener(evt) {
 console.log("Service Worker instalando.")
 evt.waitUntil(cargaCache());
}

/**
 * @param {FetchEvent} evt
 */
function fetchListener(evt) {
 if (evt.request.method === "GET") {
  evt.respondWith(usaCache(evt))
 }
}

async function cargaCache() {
 console.log("Intentando cargar cache:", CACHE)
 const keys = await caches.keys()
 for (const key of keys) {
  await caches.delete(key)
 }
 const cache = await caches.open(CACHE)
 await cache.addAll(ARCHIVOS)
 console.log("Cache cargado:", CACHE)
 console.log("Versión:", VERSION)
}

/**
 * @param {FetchEvent} evt
 */
async function usaCache(evt) {
 const cache = await caches.open(CACHE)
 const response = await cache.match(evt.request, { ignoreSearch: true })
 if (response) {
  return response
 } else {
  return fetch(evt.request)
 }
}
