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
var isGameRunning = false;

/**
 * Salva o último score para ser apresentado
 */
let finalScore = document.getElementById("finalScore");

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

/**
 * Jogadores derrotados
 */
let defeatedPlayers = [];

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

// desenvolver lógica de inicio de jogo
var game, move, score
function DefinitiveStartGame() {
    if (!isGameRunning) {
        socket.emit('start game button', room);
        isGameRunning = true;
        document.getElementById('modal--lobby').style.transform = 'scale(0)';
        game = setInterval(startGame, 50);
        move = setInterval(moveObstacles, 50);
        score = setInterval(() => { pontos++; document.getElementById("score").innerHTML = `${pontos}`; }, 1000);
    }
}


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
    // isGameRunning = true;
    if (spShip[0].y == 15 * box) spShip[0].y = 14 * box;
    if (spShip[0].y == 0) spShip[0].y = 1 * box;

    createspShip();
    drawObstacles();

    //inicializar nave em 0x0
    let spShipX = spShip[0].x;
    let spShipY = spShip[0].y;

    const margin = 40;

    //andar com a nave (box = pixel)
    if (direction == "down") spShipY += 32;
    if (direction == "up") spShipY -= 32;

    if ((spShipX != obstacle[0].x || spShipY != obstacle[0].y)) {
        spShip.pop();
    }
    //collider
    for (i = 0; i < obstacle.length; i++) {
        if ((spShipX >= obstacle[i].x - margin && spShipX <= obstacle[i].x + margin) && (spShipY >= obstacle[i].y - margin && spShipY <= obstacle[i].y + margin)) {
            clearInterval(game);
            clearInterval(score);
            clearInterval(move);
            isGameRunning = false;
            socket.emit('player died', { id: socket.id, score: pontos, room: room });
            // score.pause()
            finalScore.innerHTML = `${pontos}`;
            showModal();
        }
    }

    let newHead = {
        x: spShipX,
        y: spShipY
    }

    spShip.unshift(newHead);
}

//#region socket.io

var socket = io();

console.log(socket);

var btnPlayGame = document.getElementById('btn--startgame');
var room = window.location.href.split('/')[4];

document.getElementById('room-id').innerHTML = room;

socket.on('ready', function () {
    socket.emit('join', room)
    socket.emit('players connected', room);
    socket.on('players count', (playersCount) => {
        for (let i = 2; i <= playersCount; i++) {
            document.getElementById(`rocket--player${i}`).style.filter = "contrast(1)";
        }
    })
});

socket.on('start game', () => {
    btnPlayGame.click();
});

socket.on('joystick move client', (data) => {
    direction = data;
})

socket.on('new player', (playersCount) => {
    if (playersCount >= 2) {
        document.getElementById('btn--startgame').disabled = false;
    }
    document.getElementById(`rocket--player${playersCount}`).style.filter = "contrast(1)";
});

socket.on('dead players', (client) => {
    defeatedPlayers.push(client);
})

socket.on('player disconnect', (playersCount) => {
    for (let i = 2; i <= playersCount; i++) {
        document.getElementById(`rocket--player${i}`).style.filter = "contrast(0)";
    }
});

var btnController = document.getElementById('btn-joystick');
btnController.onclick = function () {
    socket.emit('open controller');
    socket.on('redirect', function (destination) {
        window.open(
            destination,
            '_blank'
        );
    });
}

let listPlayers = document.getElementById('listPlayers');

for (var i = 0; i < 4; i++) {
    let items = document.createElement('li');
    items.appendChild(document.createTextNode(`${i + 1}. Jogador ${i}`));
    listPlayers.append(items);
};

//#endregion