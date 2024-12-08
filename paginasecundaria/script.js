let vidaLlama = 100;
let tiempo = 0;
let intervaloEsfera;
let esferaTocada = false;
const imagenes = [
    { src: "imagenes/cocinar.png", vida: 15 },
    { src: "imagenes/ayudar.png", vida: 15 },
    { src: "imagenes/amigos.png", vida: 20 },
    { src: "imagenes/familia.png", vida: 20 }
];

function crearEsfera() {
    const esfera = document.createElement("div");
    esfera.className = "esfera";
    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];
    esfera.innerHTML = `<img src="${imagen.src}" alt="Imagen esfera" style="width: 80px; height: 80px;">`;
    esfera.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
    esfera.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    esfera.style.padding = "10px"; // Agrega un margen de error de 10px alrededor de la esfera
    document.body.appendChild(esfera);

    esfera.addEventListener("click", (event) => {
        const rect = esfera.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            esfera.remove();
            vidaLlama += imagen.vida;
            esferaTocada = true;
            actualizarVidaLlama();
        }
    });
}

function actualizarVidaLlama() {
    vidaLlama -= 5;
    const barraVida = document.querySelector(".progress-bar");
    barraVida.style.width = `${vidaLlama}%`;
    if (vidaLlama <= 0) {
        clearInterval(intervalo);
        document.body.innerHTML = `
            <div style="text-align: center; margin-top: 20%">
                <img src="imagenes/perdiste2.gif" alt="Imagen de perder" style="width: 50%">
                <h1>Perdiste</h1>
                <p>Recargar la página para reiniciar el juego</p>
            </div>
        `;
    }
}

function iniciarJuego() {
    intervalo = setInterval(() => {
        if (tiempo > 60 && vidaLlama > 0) {
            clearInterval(intervalo);
            clearInterval(intervaloEsfera);
            detenerJuego("Ganaste!", "imagenes/ganaste2.gif");
        } else if (vidaLlama <= 0) {
            clearInterval(intervalo);
            clearInterval(intervaloEsfera);
            detenerJuego("Perdiste!", "imagenes/perdiste2.gif");
        } else {
            tiempo++;
            actualizarVidaLlama();
            crearEsfera(); // Llama a la función para crear esferas
        }
    }, 1000);
}

function detenerJuego(mensaje, gif) {
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
    
    document.body.innerHTML = "";
    document.body.appendChild(container);
    
    const botonReiniciar = document.getElementById("reiniciar-juego");
    if (botonReiniciar) {
        botonReiniciar.addEventListener("click", () => {
            location.reload();
        });
    }
}

document.getElementById("iniciar").addEventListener("click", iniciarJuego);

