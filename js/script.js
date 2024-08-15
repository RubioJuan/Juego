    const totalCards = 12;
    let cards = []; //  Una matriz vacía que contendrá las tarjetas del juego.
    let selectedCards = []; // Una matriz vacía que contendrá las tarjetas seleccionadas por el jugador.
    let currentMove = 0; // Un contador que realiza un seguimiento del número de movimientos actuales del jugador.
    let currentAttempts = 0; // Contador de numero total de intentos

    let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';
    /*Una cadena que representa el HTML de una tarjeta, 
    con una parte trasera y una cara. */

    async function randomValue() {
        /*La expresión await provoca que la ejecución de una función async sea pausada hasta que una Promise sea terminada o rechazada, 
        y regresa a la ejecución de la función async después del término. 
        Al regreso de la ejecución, el valor de la expresión await es la regresada por una promesa terminada. */
        try {
            const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=6');
            const data = await response.json();
            const cardImages = data.cards.map(card => card.image);

            // Duplica las imágenes de las cartas para tener 6 cartas iguales
            const duplicatedCardImages = [...cardImages, ...cardImages];

            // Mezcla las imágenes de cartas duplicadas para aleatorizar su orden
            shuffle(duplicatedCardImages);

            // Asigna las imágenes de cartas duplicadas a los elementos de las cartas correspondientes
            cards.forEach((card, index) => {
                card.querySelector('.face').style.backgroundImage = `url('${duplicatedCardImages[index]}')`;
            });
        } catch (error) {
            console.error('Error fetching card images:', error);
        }
    }


    // Función para mezclar una matriz
    function shuffle(array) {
        /* El algoritmo shuffle en JavaScript es una técnica que permite reorganizar los elementos de un array de forma aleatoria. */
        for (let i = array.length - 1; i > 0; i--) {/*La longitud es una propiedad de cadenas, matrices y algunos 
        otros objetos de JavaScript que devuelve la cantidad de caracteres o elementos de ese objeto. */
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    function activate(e) {
        if (currentMove < 2){ // Verifica que el jugador no pueda seleccionar mas de 2 cartas 
            if ((!selectedCards[0] /*Verifica si no hay ninguna carta seleccionada actualmente*/ || selectedCards[0] !== e.target) && !e.target.classList.contains('active')){ // Esto asegura que el jugador no haga clic en una carta que ya está activa.
                e.target.classList.add('active');/* Si todas las condiciones anteriores son verdaderas, esto agrega 
                la clase 'active' a la carta que el jugador acaba de hacer clic. Esto resalta visualmente la carta seleccionada.*/
                selectedCards.push(e.target); // Agrega la carta seleccionada a la matriz 

                if(++currentMove == 2){
                    currentAttempts++;/*Comprueba si el número actual de movimientos es menor que 2. 
                    Esto garantiza que el jugador no pueda seleccionar más de dos cartas a la vez. */
                    document.querySelector('#starts').innerHTML = currentAttempts + ' intentos';
                    updateClass();

                    if (selectedCards[0].querySelectorAll('.face')[0].style.backgroundImage == selectedCards[1].querySelectorAll('.face')[0].style.backgroundImage) {
                        selectedCards = [];/*Verifica si la carta clicada ya está seleccionada (selectedCards[0]) o si no es la misma carta que se seleccionó
                        anteriormente (selectedCards[0] !== e.target).
                        También comprueba si la carta clicada no tiene la clase 'active', lo que significa que aún no ha sido seleccionada. */
                        currentMove = 0;

                    // Dentro de la función activate cuando todas las cartas estén emparejadas
                        if (document.querySelectorAll('.card.active').length === totalCards) {
                            // Ventana modal cuando el usuario gane el juego 
                            const winModal = new bootstrap.Modal(document.getElementById('winModal'));
                            winModal.show();
                        }
                    } else {
                        setTimeout(() =>{
                            selectedCards[0].classList.remove('active');
                            selectedCards[1].classList.remove('active');
                            selectedCards = [];
                            currentMove = 0;
                        }, 600);/*Si las cartas no coinciden, después de un breve retraso (600 milisegundos),
                        las desmarca como seleccionadas y las oculta. */
                    }
                }
            }
        }
    }

for (let i=0; i < totalCards; i++){
    let div = document.createElement('div');
    div.innerHTML = cardTemplate;
    cards.push(div);
    document.querySelector('#game').append(cards[i]);
    cards[i].querySelectorAll('.card')[0].addEventListener('click', activate)
}
/*Este bucle se encarga de crear las cartas en el juego. Para cada carta:

Se crea un nuevo elemento div que contiene el HTML de la plantilla de la tarjeta.
Se agrega este elemento a la matriz cards.
Se agrega la carta al documento.
Se añade un evento de clic a la primera tarjeta de cada par de cartas que activará la función activate.
Luego, se llama a randomValue() para obtener y mostrar las imágenes de las cartas de forma aleatoria. */

randomValue();

// Obtener el elemento por su id
const startsElement = document.getElementById('starts');
function updateClass() {
    const startsElement = document.getElementById('starts');
    const attemptsText = startsElement.innerText;
    const attemptsNumber = parseInt(attemptsText); // Intenta convertir todo el texto a un número entero
    if (!isNaN(attemptsNumber) && attemptsNumber >= 10) {
        startsElement.style.color = 'red'; // Cambia el color del texto a rojo si el número de intentos es mayor o igual a 10
    } else {
        startsElement.style.color = ''; // Restaura el color predeterminado del texto
    }
}
// función para el audio
function playAudio() {
    var audio = document.getElementById("backgroundAudio");
    audio.play();
}
document.getElementById("rulesBtn").addEventListener("click", playAudio);


// Función para reiniciar el juego
function restartGame() {
    // Reiniciar variables
    selectedCards = [];
    currentMove = 0;
    currentAttempts = 0;
    // Reiniciar el contador de intentos en el HTML
    document.querySelector('#starts').innerHTML = currentAttempts + ' intentos';
    // Reiniciar el color del texto
    startsElement.style.color = '';
    // Desactivar todas las cartas
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });
    // Volver a mezclar las cartas y mostrarlas
    randomValue();
}

// Función para cerrar la ventana modal de felicitaciones y reiniciar el juego
function handleCloseModal() {
    // Reiniciar el juego
    restartGame();
    // Ocultar la ventana modal de felicitaciones
    const winModal = new bootstrap.Modal(document.getElementById('winModal'));
    winModal.hide();
}

// Evento para reiniciar el juego cuando se cierre la ventana modal de felicitaciones
document.getElementById('winModal').addEventListener('hidden.bs.modal', handleCloseModal);
