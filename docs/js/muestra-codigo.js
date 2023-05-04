const MUESTRA_CODIGO_SHADOW_HTML = /* html */
 `<style>
   :host {
    display: block;
    font-family: var(--fontMono);
   }
   table {
    margin-left: auto;
    margin-right: auto;
   }
   #nums {
    text-align: right;
    padding: 0 0 0 0;
    vertical-align: top;
    font-family: var(--fontMono);
    white-space: pre;
    font-size: 1rem;
    line-height:1.2rem;
   }
   #cod {
    padding: 0 0 0 0.25rem;
    vertical-align: top;
    font-family: var(--fontMono);
    font-size: 1rem;
    line-height:1.2rem;
   }
   @media print {
    button {
     display:none;
    }
   }
 </style>
 <table>
  <tr>
   <td colspan=2>
    <button type=button title="Copiar al portapapeles">📋</button>
   </td>
  </tr>
  <tr>
   <td id=nums></td>
   <td id=cod><slot></slot></td>
  </tr>
 </table>`
class MuestraCodigo extends HTMLElement {
 constructor() {
  super();
  this.copia = this.copia.bind(this)
 }
 connectedCallback() {
  const shadowRoot = this.attachShadow({ mode: "open" })
  shadowRoot.innerHTML = MUESTRA_CODIGO_SHADOW_HTML
  this.cod = shadowRoot.querySelector("#cod")
  /** @type {HTMLSlotElement | null} */
  const mislot = shadowRoot.querySelector("slot")
  if (mislot) {
   mislot.addEventListener("slotchange", () => {
    const assignedElements = mislot.assignedElements();
    for (const assignedElement of assignedElements) {
     const arr = Array.from(assignedElement.children)
     switch (arr.length) {
      case 0:
       /** @type {Element[]} */
       this.líneas = []
       break
      case 1:
       this.líneas = Array.from(arr[0].querySelectorAll("div>div"))
       break
      default:
       this.líneas = arr
       break
     }
     /**@type {HTMLElement | null} */
     const nums = shadowRoot.querySelector("#nums")
     const total = this.líneas.length
     let inner = ""
     for (let i = 1; i <= total; i++) {
      inner += /* html */ `<div>${i}</div>`
     }
     if (nums) {
      nums.innerHTML = inner
     }
    }
   })
  }
  const button = shadowRoot.querySelector("button")
  if (button) {
   button.addEventListener("click", this.copia)
  }
 }
 async copia() {
  try {
   const código = this.líneas ?
    this.líneas.
     map(ch => ch.textContent ? ch.textContent.replace(/\u00a0/g, ' ') : "").
     map(s => s ? s.replace(/\s+$/g, '') : "").
     join("\n")
    : ""
   if (código) {
    await navigator.clipboard.writeText(código)
    alert("Texto copiado al portapapeles.")
   }
  } catch (e) {
   alert(e.message)
  }
 }
}
customElements.define("muestra-codigo", MuestraCodigo)