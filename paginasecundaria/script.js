// Inicialización de variables principales
let vidaLlama = 100; // Vida inicial de la llama
let tiempo = 0; // Contador de tiempo en segundos
let intervalo; // Intervalo para controlar el tiempo del juego
let intervaloEsfera; // Intervalo para la aparición de las esferas
let juegoPausado = false; // Estado del juego (pausado o no)

// Lista de imágenes con sus valores de vida asociados
const imagenes = [
    { src: "imagenes/cocinar.png", vida: 10 }, // Imagen asociada a +10 de vida
    { src: "imagenes/ayudar.png", vida: 10 }, // Imagen asociada a +10 de vida
    { src: "imagenes/amigos.png", vida: 10 }, // Imagen asociada a +10 de vida
    { src: "imagenes/familia.png", vida: 10 } // Imagen asociada a +10 de vida
];

// Función para crear una nueva esfera en la pantalla
function crearEsfera() {
    // Crear un nuevo elemento div para la esfera
    const esfera = document.createElement("div");
    esfera.className = "esfera"; // Clase para el estilo CSS

    // Seleccionar una imagen aleatoria de la lista
    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];
    esfera.innerHTML = `<img src="${imagen.src}" alt="Imagen esfera" style="width: 80px; height: 80px;">`;

    // Posicionar la esfera aleatoriamente en el ancho de la pantalla
    esfera.style.left = `${Math.random() * (window.innerWidth - 50)}px`;

    // Agregar la esfera al cuerpo del documento
    document.body.appendChild(esfera);

    // Variable para rastrear si la esfera ha sido eliminada
    let esferaEliminada = false;

    // Temporizador para eliminar la esfera después de 3 segundos si no se hace clic en ella
    const tiempoEliminacion = setTimeout(() => {
        if (!esferaEliminada && !juegoPausado) {
            esfera.remove(); // Eliminar la esfera del DOM
            vidaLlama -= 10; // Reducir la vida de la llama
            actualizarVidaLlama(); // Actualizar la barra y el tamaño del fuego
        }
    }, 3000);

    // Evento de clic en la esfera
    esfera.addEventListener("click", () => {
        clearTimeout(tiempoEliminacion); // Cancelar el temporizador de eliminación
        esferaEliminada = true; // Marcar la esfera como eliminada
        esfera.remove(); // Eliminar la esfera del DOM
        vidaLlama += imagen.vida; // Aumentar la vida de la llama según la imagen seleccionada
        actualizarVidaLlama(); // Actualizar la barra y el tamaño del fuego
    });
}

// Función para actualizar la barra de vida y el tamaño del fuego
function actualizarVidaLlama() {
    // Reducir la vida de la llama progresivamente
    vidaLlama -= 3;

    // Actualizar el ancho de la barra de vida en función del porcentaje actual de vida
    const barraVida = document.querySelector(".progress-bar");
    barraVida.style.width = `${vidaLlama}%`;

    // Actualizar el tamaño del fuego en función de la vida restante
    const fuego = document.querySelector(".fuego");
    if (fuego) {
        fuego.style.transform = `scale(${Math.max(vidaLlama / 100, 0.1)})`; // Escalar proporcionalmente
    }

    // Verificar si la vida ha llegado a 0
    if (vidaLlama <= 0) {
        clearInterval(intervalo); // Detener el intervalo de tiempo
        clearInterval(intervaloEsfera); // Detener la creación de esferas
        detenerJuego("Perdiste!", "imagenes/perdiste2.gif"); // Mostrar mensaje de derrota
    }
}

// Función para iniciar el juego
function iniciarJuego() {
    document.getElementById("iniciar").disabled = true; // Desactivar el botón de inicio

    // Intervalo para actualizar el tiempo y la vida cada segundo
    intervalo = setInterval(() => {
        if (tiempo > 60 && vidaLlama > 0) {
            // Si pasa más de 60 segundos y hay vida, se gana el juego
            clearInterval(intervalo);
            clearInterval(intervaloEsfera);
            detenerJuego("Ganaste!", "imagenes/ganaste2.gif"); // Mostrar mensaje de victoria
        } else if (!juegoPausado) {
            tiempo++; // Incrementar el tiempo
            actualizarVidaLlama(); // Actualizar la vida y el fuego
        }
    }, 1000);

    // Intervalo para crear esferas en intervalos aleatorios
    intervaloEsfera = setInterval(() => {
        if (!juegoPausado) {
            crearEsfera(); // Crear una nueva esfera
        }
    }, Math.random() * 2000 + 1000);
}

// Función para detener el juego y mostrar el mensaje final
function detenerJuego(mensaje, gif) {
    clearInterval(intervalo); // Detener el intervalo de tiempo
    clearInterval(intervaloEsfera); // Detener la creación de esferas

    // Crear un contenedor para mostrar el mensaje final
    const container = document.createElement("div");
    container.className = "container mt-1 mb-2";
    container.style.backgroundImage = "url('imagenes/papel.jpg')";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";

    // Contenido del mensaje final
    container.innerHTML = `
        <div class="row">
            <div class="col-md-12 p-3 mb-8 text-center">
                <img src="${gif}" alt="${mensaje}" style="width: 400px; height: 200px;">
                <h1>${mensaje}</h1>
                <button id="reiniciar-juego" class="btn btn-primary">Reiniciar el juego</button>
            </div>
        </div>
    `;
    document.body.innerHTML = ""; // Limpiar el contenido del cuerpo
    document.body.appendChild(container); // Agregar el contenedor final

    // Evento para reiniciar el juego
    document.getElementById("reiniciar-juego").addEventListener("click", () => {
        location.reload(); // Recargar la página
    });
}

// Función para pausar o reanudar el juego
function pausarReanudarJuego() {
    juegoPausado = !juegoPausado; // Cambiar el estado de pausa
    const textoBoton = juegoPausado ? "Reanudar" : "Pausar"; // Actualizar el texto del botón
    document.getElementById("pausar").textContent = textoBoton;

    // Pausar o reanudar las animaciones de las esferas
    const esferas = document.querySelectorAll(".esfera");
    esferas.forEach((esfera) => {
        esfera.style.animationPlayState = juegoPausado ? "paused" : "running";
    });
}

// Asignar eventos a los botones
document.getElementById("iniciar").addEventListener("click", iniciarJuego); // Botón de inicio
document.getElementById("pausar").addEventListener("click", pausarReanudarJuego); // Botón de pausar/reanudar
