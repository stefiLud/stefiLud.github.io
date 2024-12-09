let vidaLlama = 100; // Vida inicial de la llama.
let tiempo = 0; // Contador de tiempo transcurrido en el juego.
let intervalo; // Intervalo para actualizar el tiempo.
let intervaloEsfera; // Intervalo para crear nuevas esferas.
let juegoPausado = false; // Indica si el juego está pausado.

const imagenes = [ // Arreglo con las esferas y sus valores de vida.
    { src: "imagenes/cocinar.png", vida: 15 },
    { src: "imagenes/ayudar.png", vida: 15 },
    { src: "imagenes/amigos.png", vida: 20 },
    { src: "imagenes/familia.png", vida: 20 }
];

// Crea una esfera con una imagen aleatoria y la agrega al contenedor.
function crearEsfera() {
    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)]; // Elige una imagen aleatoria de la lista.
    const maxLeft = contenedorLlama.offsetWidth - 60; // Calcula el rango de posición horizontal.
    esfera.style.left = `${Math.random() * maxLeft}px`; // Posiciona la esfera aleatoriamente.

    // Si no se hace clic en la esfera, se elimina después de 3 segundos y se resta vida.
    let esferaEliminada = false;
    const tiempoEliminacion = setTimeout(() => {
        if (!esferaEliminada && !juegoPausado) {
            esfera.remove(); // Elimina la esfera.
            vidaLlama -= 10; // Resta vida si no se hace clic.
            actualizarVidaLlama(); // Actualiza la barra de vida.
        }
    }, 3000);

    // Evento de clic en la esfera que elimina la esfera y suma vida.
    esfera.addEventListener("click", () => {
        clearTimeout(tiempoEliminacion); // Cancela la eliminación si se hace clic.
        esferaEliminada = true;
        esfera.remove();
        vidaLlama += imagen.vida; // Suma vida según la esfera.
        actualizarVidaLlama(); // Actualiza la barra de vida.
    });
}

// Actualiza la barra de vida y verifica si el jugador ha perdido.
function actualizarVidaLlama() {
    vidaLlama -= 5; // Resta 5 puntos de vida cada segundo.
    const barraVida = document.querySelector(".progress-bar"); // Selecciona la barra de vida.
    barraVida.style.width = `${vidaLlama}%`; // Actualiza el ancho de la barra.

    // Si la vida llega a 0, termina el juego con mensaje de derrota.
    if (vidaLlama <= 0) {
        clearInterval(intervalo);
        clearInterval(intervaloEsfera);
        detenerJuego("Perdiste!", "imagenes/perdiste2.gif");
    }
}

// Inicia el juego y los intervalos de tiempo y esferas.
function iniciarJuego() {
    document.getElementById("iniciar").disabled = true; // Desactiva el botón de iniciar.

    intervalo = setInterval(() => {
        if (tiempo > 60 && vidaLlama > 0) {
            clearInterval(intervalo);
            clearInterval(intervaloEsfera);
            detenerJuego("Ganaste!", "imagenes/ganaste2.gif");
        } else if (!juegoPausado) {
            tiempo++; // Aumenta el tiempo.
            actualizarVidaLlama(); // Actualiza la vida del jugador.
        }
    }, 1000);

    // Crea esferas aleatoriamente con un intervalo.
    intervaloEsfera = setInterval(() => {
        if (!juegoPausado) {
            crearEsfera(); // Crea una nueva esfera.
        }
    }, Math.random() * 2000 + 1000); // Intervalo aleatorio entre 1 y 3 segundos.
}

// Detiene el juego y muestra un mensaje de victoria o derrota.
function detenerJuego(mensaje, gif) {
    clearInterval(intervalo);
    clearInterval(intervaloEsfera);

    const container = document.createElement("div");
    container.className = "container mt-1 mb-2";
    container.style.backgroundImage = "url('imagenes/papel.jpg')";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.innerHTML = `
        <div class="row">
            <div class="col-md-12 p-3 mb-8 text-center">
                <img src="${gif}" alt="${mensaje}" style="width: 400px; height: 200px;">
                <h1>${mensaje}</h1>
                <button id="reiniciar-juego" class="btn btn-primary">Reiniciar el juego</button>
            </div>
        </div>
    `;
    document.body.innerHTML = ""; // Limpia el cuerpo de la página.
    document.body.appendChild(container); // Muestra el contenedor con el mensaje.

    document.getElementById("reiniciar-juego").addEventListener("click", () => {
        location.reload(); // Recarga la página para reiniciar el juego.
    });
}

// Pausa o reanuda el juego al hacer clic en el botón de pausa.
function pausarReanudarJuego() {
    juegoPausado = !juegoPausado; // Cambia el estado de pausa.
    const textoBoton = juegoPausado ? "Reanudar" : "Pausar"; // Cambia el texto del botón.
    document.getElementById("pausar").textContent = textoBoton;

    const esferas = document.querySelectorAll(".esfera");
    esferas.forEach((esfera) => {
        if (juegoPausado) {
            esfera.style.animationPlayState = "paused"; // Pausa la animación de las esferas.
        } else {
            esfera.style.animationPlayState = "running"; // Reanuda la animación.
        }
    });
}

// Asocia las funciones a los botones correspondientes.
document.getElementById("iniciar").addEventListener("click", iniciarJuego); 
document.getElementById("pausar").addEventListener("click", pausarReanudarJuego);
