// =============================================
// FUNCIONES DE GENERACIÓN DE COLOR
// =============================================

function generarColorHSL() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 50;
    const l = Math.floor(Math.random() * 25) + 40;
    return { h, s, l };
}

function hslAHex(h, s, l) {
    s = s / 100;
    l = l / 100;
    const a = s * Math.min(l, 1 - l);
    const calcularCanal = function(n) {
        const k = (n + h / 30) % 12;
        const canal = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * canal).toString(16).padStart(2, "0");
    };
    return "#" + calcularCanal(0) + calcularCanal(8) + calcularCanal(4);
}

// =============================================
// TOAST
// =============================================

const toast = document.getElementById("toast");
let temporizadorToast = null;

function mostrarToast() {
    clearTimeout(temporizadorToast);
    toast.classList.add("visible");

    temporizadorToast = setTimeout(function() {
        toast.classList.remove("visible");
    }, 2000);
}

// =============================================
// FUNCIÓN QUE CREA UNA TARJETA DE COLOR
// =============================================

function crearTarjetaColor(colorHSL, indice) {
    const hex = hslAHex(colorHSL.h, colorHSL.s, colorHSL.l);
    const hslTexto = `hsl(${colorHSL.h}, ${colorHSL.s}%, ${colorHSL.l}%)`;

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-color");
    tarjeta.classList.add("tarjeta-animada");
    tarjeta.style.animationDelay = `${indice * 0.07}s`;
    tarjeta.style.backgroundColor = hex;

    tarjeta.innerHTML = `
        <span class="codigo-color codigo-hex">${hex}</span>
        <span class="codigo-color codigo-hsl">${hslTexto}</span>
        <span class="copiar-codigo">Copiar</span>
    `;

    tarjeta.addEventListener("click", function() {
        const formato = document.querySelector('input[name="tipo-codigo"]:checked').value;
        const textoCopiar = formato === "hsl" ? hslTexto : hex;

        navigator.clipboard.writeText(textoCopiar);
        mostrarToast();
    });

    return tarjeta;
}

// =============================================
// LÓGICA PRINCIPAL — EVENTO DEL BOTÓN
// =============================================

const botonGenerar = document.querySelector(".boton-generar");
const contenedorPaletas = document.getElementById("paletas");

botonGenerar.addEventListener("click", function() {
    const cantidadSeleccionada = document.querySelector('input[name="tamano-paleta"]:checked');
    const cantidad = parseInt(cantidadSeleccionada.value);

    contenedorPaletas.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        const colorHSL = generarColorHSL();
        const tarjeta = crearTarjetaColor(colorHSL, i);
        contenedorPaletas.appendChild(tarjeta);
    }
});