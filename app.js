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
// FUNCIONES DE BLOQUEO
// =============================================

// Devuelve true si la tarjeta está bloqueada, false si no
function estaBloqueda(tarjeta) {
    return tarjeta.dataset.bloqueado === "true";
}

// Cambia el estado de bloqueo al contrario
function toggleBloqueo(tarjeta) {
    const bloqueadaAhora = estaBloqueda(tarjeta);
    tarjeta.dataset.bloqueado = bloqueadaAhora ? "false" : "true";
    actualizarVisualBloqueo(tarjeta);
}

// Actualiza el icono y la clase CSS del botón candado según el estado
function actualizarVisualBloqueo(tarjeta) {
    const botonCandado = tarjeta.querySelector(".boton-candado");

    if (estaBloqueda(tarjeta)) {
        botonCandado.textContent = "🔒";
        botonCandado.classList.add("candado-activo");
        tarjeta.classList.add("tarjeta-bloqueada");
    } else {
        botonCandado.textContent = "🔓";
        botonCandado.classList.remove("candado-activo");
        tarjeta.classList.remove("tarjeta-bloqueada");
    }
}

// =============================================
// FUNCIÓN QUE CREA UNA TARJETA DE COLOR
// =============================================

function crearTarjetaColor(colorHSL, indice) {
    const hex = hslAHex(colorHSL.h, colorHSL.s, colorHSL.l);
    const hslTexto = `hsl(${colorHSL.h}, ${colorHSL.s}%, ${colorHSL.l}%)`;

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-color", "tarjeta-animada");
    tarjeta.style.animationDelay = `${indice * 0.07}s`;
    tarjeta.style.backgroundColor = hex;

    // Guardo el color y el estado de bloqueo en la tarjeta misma
    tarjeta.dataset.h = colorHSL.h;
    tarjeta.dataset.s = colorHSL.s;
    tarjeta.dataset.l = colorHSL.l;
    tarjeta.dataset.bloqueado = "false";

    tarjeta.innerHTML = `
        <button class="boton-candado" title="Bloquear color">🔓</button>
        <span class="codigo-color codigo-hex">${hex}</span>
        <span class="codigo-color codigo-hsl">${hslTexto}</span>
        <span class="copiar-codigo">Copiar</span>
    `;

    // Click en el candado → togglea el bloqueo sin disparar el copiar
    const botonCandado = tarjeta.querySelector(".boton-candado");
    botonCandado.addEventListener("click", function(evento) {
        evento.stopPropagation(); // evita que el click llegue a la tarjeta
        toggleBloqueo(tarjeta);
    });

    // Click en la tarjeta copiar el código de color
    tarjeta.addEventListener("click", function() {
        const formato = document.querySelector('input[name="tipo-codigo"]:checked').value;
        const textoCopiar = formato === "hsl" ? hslTexto : hex;
        navigator.clipboard.writeText(textoCopiar);
        mostrarToast();
    });

    return tarjeta;
}

// =============================================
// FUNCIÓN QUE ACTUALIZA UNA TARJETA EXISTENTE
// =============================================

function actualizarTarjeta(tarjeta, colorHSL) {
    const hex = hslAHex(colorHSL.h, colorHSL.s, colorHSL.l);
    const hslTexto = `hsl(${colorHSL.h}, ${colorHSL.s}%, ${colorHSL.l}%)`;

    // Actualizamos el fondo y los textos
    tarjeta.style.backgroundColor = hex;
    tarjeta.querySelector(".codigo-hex").textContent = hex;
    tarjeta.querySelector(".codigo-hsl").textContent = hslTexto;

    // Guardamos los nuevos valores en el dataset
    tarjeta.dataset.h = colorHSL.h;
    tarjeta.dataset.s = colorHSL.s;
    tarjeta.dataset.l = colorHSL.l;

    // Reemplazamos la tarjeta por un clon para limpiar los listeners viejos
    const clon = tarjeta.cloneNode(true);
    tarjeta.parentNode.replaceChild(clon, tarjeta);

    // Re-agregamos los listeners al clon limpio
    const botonCandado = clon.querySelector(".boton-candado");
    botonCandado.addEventListener("click", function(evento) {
        evento.stopPropagation();
        toggleBloqueo(clon);
    });

    clon.addEventListener("click", function() {
        const formato = document.querySelector('input[name="tipo-codigo"]:checked').value;
        const textoCopiar = formato === "hsl" ? hslTexto : hex;
        navigator.clipboard.writeText(textoCopiar);
        mostrarToast();
    });
}

// =============================================
// LÓGICA PRINCIPAL — EVENTO DEL BOTÓN
// =============================================

const botonGenerar = document.querySelector(".boton-generar");
const contenedorPaletas = document.getElementById("paletas");

botonGenerar.addEventListener("click", function() {
    const cantidadSeleccionada = document.querySelector('input[name="tamano-paleta"]:checked');
    const cantidad = parseInt(cantidadSeleccionada.value);

    const tarjetasActuales = contenedorPaletas.querySelectorAll(".tarjeta-color");

    // Si no hay tarjetas o cambió la cantidad → crear todo desde cero
    if (tarjetasActuales.length === 0 || tarjetasActuales.length !== cantidad) {
        contenedorPaletas.innerHTML = "";

        for (let i = 0; i < cantidad; i++) {
            const colorHSL = generarColorHSL();
            const tarjeta = crearTarjetaColor(colorHSL, i);
            contenedorPaletas.appendChild(tarjeta);
        }
        return;
    }

    // Si ya hay tarjetas y la cantidad es la misma → recorrer y actualizar solo las desbloqueadas
    tarjetasActuales.forEach(function(tarjeta) {
        if (!estaBloqueda(tarjeta)) {
            const colorHSL = generarColorHSL();
            actualizarTarjeta(tarjeta, colorHSL);
        }
        // Las bloqueadas no se tocan
    });
});