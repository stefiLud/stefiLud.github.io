let vidaLlama = 100; // Establece la vida inicial de la llama en 100.
let tiempo = 0; // Inicializa el tiempo en 0.
let intervalo; // Variable para almacenar el intervalo de tiempo del juego.
let intervaloEsfera; // Variable para almacenar el intervalo de creación de esferas.
let juegoPausado = false; // Variable que indica si el juego está pausado o no.

// Array de objetos que contienen las imágenes y los valores de vida asociados a cada esfera.
const imagenes = [
    { src: "imagenes/cocinar.png", vida: 10 },
    { src: "imagenes/ayudar.png", vida: 10 },
    { src: "imagenes/amigos.png", vida: 10 },
    { src: "imagenes/familia.png", vida: 10 }
];

// Función que crea una esfera y la agrega a la pantalla.
function crearEsfera() {
    const esfera = document.createElement("div"); // Crea un nuevo div para la esfera.
    esfera.className = "esfera"; // Le asigna la clase 'esfera' al div.
    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)]; // Elige aleatoriamente una imagen de las disponibles.
    esfera.innerHTML = `<img src="${imagen.src}" alt="Imagen esfera" style="width: 80px; height: 80px;">`; // Inserta la imagen en el div.
    esfera.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Posiciona la esfera de manera aleatoria en el eje X.
    document.body.appendChild(esfera); // Añade la esfera al cuerpo del documento.

    let esferaEliminada = false; // Bandera para saber si la esfera ha sido eliminada.
    // Establece un temporizador para eliminar la esfera después de 3 segundos si no ha sido eliminada antes.
    const tiempoEliminacion = setTimeout(() => {
        if (!esferaEliminada && !juegoPausado) {
            esfera.remove(); // Elimina la esfera si no ha sido eliminada antes.
            vidaLlama -= 10; // Resta 10 a la vida de la llama si la esfera no se hace clic.
            actualizarVidaLlama(); // Actualiza la barra de vida.
        }
    }, 3000);

    // Añade un evento que elimina la esfera cuando se hace clic sobre ella.
    esfera.addEventListener("click", () => {
        clearTimeout(tiempoEliminacion); // Cancela el temporizador de eliminación.
        esferaEliminada = true; // Marca la esfera como eliminada.
        esfera.remove(); // Elimina la esfera.
        vidaLlama += imagen.vida; // Aumenta la vida de la llama con el valor asociado a la imagen de la esfera.
        actualizarVidaLlama(); // Actualiza la barra de vida.
    });
}

// Función que actualiza la vida de la llama y la barra de progreso.
function actualizarVidaLlama() {
    vidaLlama -= 3; // Reduce la vida de la llama en 3 cada segundo.
    const barraVida = document.querySelector(".progress-bar"); // Selecciona la barra de vida.
    barraVida.style.width = `${vidaLlama}%`; // Actualiza el ancho de la barra según la vida restante.

    // Si la vida de la llama llega a 0 o menos, el juego termina.
    if (vidaLlama <= 0) {
        clearInterval(intervalo); // Detiene el intervalo del tiempo.
        clearInterval(intervaloEsfera); // Detiene el intervalo de esferas.
        detenerJuego("Perdiste!", "imagenes/perdiste2.gif"); // Llama a la función para detener el juego mostrando el mensaje de pérdida.
    }
}

// Función que inicia el juego.
function iniciarJuego() {
    document.getElementById("iniciar").disabled = true; // Deshabilita el botón de inicio después de hacer clic.
    // Inicia un intervalo para incrementar el tiempo cada segundo.
    intervalo = setInterval(() => {
        if (tiempo > 60 && vidaLlama > 0) {
            clearInterval(intervalo); // Detiene el intervalo de tiempo.
            clearInterval(intervaloEsfera); // Detiene el intervalo de esferas.
            detenerJuego("Ganaste!", "imagenes/ganaste2.gif"); // Llama a la función para detener el juego mostrando el mensaje de victoria.
        } else if (!juegoPausado) {
            tiempo++; // Aumenta el tiempo en 1 cada segundo.
            actualizarVidaLlama(); // Actualiza la vida de la llama.
        }
    }, 1000);

    // Inicia un intervalo para crear esferas cada cierto tiempo aleatorio.
    intervaloEsfera = setInterval(() => {
        if (!juegoPausado) {
            crearEsfera(); // Llama a la función para crear una esfera.
        }
    }, Math.random() * 2000 + 1000); // Establece un intervalo aleatorio entre 1 y 3 segundos para crear una esfera.
}

// Función que detiene el juego, muestra el mensaje y el gif correspondiente.
function detenerJuego(mensaje, gif) {
    clearInterval(intervalo); // Detiene el intervalo de tiempo.
    clearInterval(intervaloEsfera); // Detiene el intervalo de esferas.

    // Crea un contenedor para mostrar el mensaje y el gif.
    const container = document.createElement("div");
    container.className = "container mt-1 mb-2";
    container.style.backgroundImage = "url('imagenes/papel.jpg')"; // Establece el fondo del contenedor.
    container.style.height = "100vh"; // Establece la altura al 100% de la ventana.
    container.style.display = "flex"; // Utiliza flexbox para centrar el contenido.
    container.style.justifyContent = "center"; // Centra el contenido horizontalmente.
    container.style.alignItems = "center"; // Centra el contenido verticalmente.
    container.innerHTML = `
        <div class="row">
            <div class="col-md-12 p-3 mb-8 text-center">
                <img src="${gif}" alt="${mensaje}" style="width: 400px; height: 200px;"> <!-- Muestra el gif del mensaje -->
                <h1>${mensaje}</h1> <!-- Muestra el mensaje -->
                <button id="reiniciar-juego" class="btn btn-primary">Reiniciar el juego</button> <!-- Botón para reiniciar el juego -->
            </div>
        </div>
    `;
    document.body.innerHTML = ""; // Limpia el contenido del body.
    document.body.appendChild(container); // Añade el contenedor con el mensaje y gif al body.

    // Añade un evento para reiniciar el juego cuando se hace clic en el botón.
    document.getElementById("reiniciar-juego").addEventListener("click", () => {
        location.reload(); // Recarga la página para reiniciar el juego.
    });
}

// Función para pausar y reanudar el juego.
function pausarReanudarJuego() {
    juegoPausado = !juegoPausado; // Cambia el estado del juego (pausar o reanudar).
    const textoBoton = juegoPausado ? "Reanudar" : "Pausar"; // Cambia el texto del botón según el estado.
    document.getElementById("pausar").textContent = textoBoton; // Actualiza el texto del botón de pausar/reanudar.

    // Pausa o reanuda las animaciones de las esferas según el estado del juego.
    const esferas = document.querySelectorAll(".esfera");
    esferas.forEach((esfera) => {
        if (juegoPausado) {
            esfera.style.animationPlayState = "paused"; // Pausa la animación de la esfera.
        } else {
            esfera.style.animationPlayState = "running"; // Reanuda la animación de la esfera.
        }
    });
}

// Eventos para iniciar el juego y pausar/reanudar el juego al hacer clic en los botones.
document.getElementById("iniciar").addEventListener("click", iniciarJuego);
document.getElementById("pausar").addEventListener("click", pausarReanudarJuego);
