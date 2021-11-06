//#Region public properties

/**
 * Tag Canvas do HTML / context do Canvas
 */
let canvas = document.getElementById("spShip");
let gameCanvas = document.getElementById("game");
let context = canvas.getContext("2d");
let box = 64;


/**
 * Corresponde a staus do game
 */
let running = false

/**
 * Salva o último score para ser apresentado
 */
let finalScore = document.getElementById("finalScore");

let continua = document.getElementById("finalButton")

/**
 * A modal de pontos
 */
let modal = document.getElementById("modal");

/**
 * Score do jogo
 */
let pontos = 0;

/**
 * A nave (player)
 */
let spShip = [];

/**
 * Obstaculo (meteoros)
 */
let obstacle = [];

/**
 * Quantidade de obstaculos na tela simultaneamente
 */
let qtyObstacle = 5;

/**
 * A velocidade dos obstaculos (meteoros)
 */
let obstacleSpeed = 20; //Não utilizar speed menor que 20, risco de bugar a function(updateScore)

/**
 * A margin do player para colisão
 */
const marginX = 2100;

/**
 * A imagem do meteóro
 */
var shipImg = new Image();
shipImg.src = "../../assets/img/rocket-direita.gif";

/**
 * A imagem do player
 */
var meteorImg = new Image();
meteorImg.src = "../../assets/img/meteoro.png";

spShip[0] = {
    x: box,
    y: box
}

/**
 * Direcao do jogo
 */
let direction = "right";

// End Region


//#Region inicializer

window.onload = function () {
    modal.style.transform = 'scale(0)';
}

/**
 * Inicializar primeiros obstaculos
 */
for (let i = 0; i < qtyObstacle; i++) {
    obstacle[i] = {
        x: Math.floor(Math.random() * 15 + 1) * box + marginX * 1.5,
        y: Math.floor(Math.random() * 15 + 1) * box
    }
}

/**
 * Mapeamento das teclas
 */
document.addEventListener('keydown', update);
document.addEventListener('keyup', stop);

/**
 * Funções para iniciar o jogo
 */
let game = setInterval(startGame, 50);
let move1 = setTimeout(setInterval(moveObstacles, 50), 3000);
var score = new scoreCounter(function () { pontos++; document.getElementById("score").innerHTML = `${pontos}`; }, 1000);

//End Region


//#Region Public methods

/**
 * Mostrar modal de pontos
 */
function showModal() {
    modal.style.transition = '0.5s'
    modal.style.transform = 'scale(1)';
    gameCanvas.style.filter = 'blur(1.2px)';
}

/**
 * funciona com um setInterval com função de pausar/resumir
 * @param {*} callback 
 * @param {*} delay intervalo a cada execução
 */
function scoreCounter(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function () {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    var resume = function () {
        start = new Date();
        timerId = window.setTimeout(function () {
            remaining = delay;
            resume();
            callback();
        }, remaining);
    };

    this.resume = resume;

    this.resume();
}

/**
 * Cria o player (nave)
 */
function createspShip() {
    for (i = 0; i < spShip.length; i++) {
        context.fillStyle = "rgba(0,0,0,0)";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(spShip[i].x, spShip[i].y, box, box);
        context.drawImage(shipImg, spShip[i].x, spShip[i].y, box + 30, box);
    }
}

/**
 * Desenha os obstaculos(meteoros)
 */
function drawObstacles() {
    for (let i = 0; i < obstacle.length; i++) {
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(obstacle[i].x, obstacle[i].y, box, box);
        context.drawImage(meteorImg, obstacle[i].x, obstacle[i].y, box + 30, box);
    }
}

/**
 * Move os obstaculos
 */
function moveObstacles() {
    for (let i = 0; i < obstacle.length; i++) {
        if (i % 2 == 0) {
            obstacle[i].x -= obstacleSpeed;
        }
        else {
            obstacle[i].x -= (obstacleSpeed + 3);
        }
        if (obstacle[i].x < box) {
            obstacle[i].x = marginX + Math.random() * 10;
            obstacle[i].y = Math.random() * 15 * box;
        }
    }
}


/**
 * Eventos para mover o player com as teclas
 * @param {*} event: evento do teclado (keycode)
 */
function update(event) {
    if (event.keyCode == 38) direction = "up";
    if (event.keyCode == 40) direction = "down";
}

/**
 * 
 * @param {*} event 
 */
function stop(event) {
    direction = "right";
}

/**
 * Realiza o inicio do jogo
 */
function startGame() {
    running = true;
    if (spShip[0].y == 15 * box) spShip[0].y = 14 * box;
    if (spShip[0].y == 0) spShip[0].y = 1 * box;

    for (i = 1; i < spShip.length; i++) {
        if (spShip[0].x == spShip[i].x && spShip[0].y == spShip[i].y) {
            clearInterval(game);
            alert('Game Over !');
        }
    }
    createspShip();
    drawObstacles();

    //inicializar cobrinha em 0x0
    let spShipX = spShip[0].x;
    let spShipY = spShip[0].y;

    const margin = 40;

    //andar com a cobrinha (box = pixel)
    if (direction == "down") spShipY += 32;
    if (direction == "up") spShipY -= 32;

    if ((spShipX != obstacle[0].x || spShipY != obstacle[0].y)) {
        spShip.pop();
    }
    //collider
    for (i = 0; i < obstacle.length; i++) {
        if ((spShipX >= obstacle[i].x - margin && spShipX <= obstacle[i].x + margin) && (spShipY >= obstacle[i].y - margin && spShipY <= obstacle[i].y + margin)) {
            clearInterval(game);
            score.pause()
            running = false;
            finalScore.innerHTML = `${pontos}`;
            continua.innerHTML = `<p id="scoreVencedor" onclick = "window.location.href = '../third-page/third-page.html?score=${pontos}'">Score Vencedor</p>`
            showModal();
        }
    }

    let newHead = {
        x: spShipX,
        y: spShipY
    }

    spShip.unshift(newHead);
}

/**
 * detectar se jogador saiu da página do jogo no navegador
 */
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "visible" && running) {
        score.resume();
    } else {
        score.pause();
    }
})

//End Region