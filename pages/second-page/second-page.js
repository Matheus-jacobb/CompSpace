let pontos = 0;
let canvas = document.getElementById("spShip");
let context = canvas.getContext("2d");
let finalScore = document.getElementById("finalScore");
let modal = document.getElementById("modal");
let gameCanvas = document.getElementById("game");
let box = 64;
let spShip = [];
let obstacle = [];
let qtyObstacle = 5;
let obstacleSpeed = 20; //Não utilizar speed menor que 20, risco de bugar a function(updateScore)
const marginX = 2100;

var shipImg = new Image();
shipImg.src = "../../assets/img/rocket-direita.gif";

var meteorImg = new Image();
meteorImg.src = "../../assets/img/meteoro.png";

spShip[0] = {
    x: box,
    y: box
}

let direction = "right";

//Inicializer firsts obstacles
for (let i = 0; i < qtyObstacle; i++) {
    obstacle[i] = {
        x: Math.floor(Math.random() * 15 + 1) * box + marginX * 1.5,
        y: Math.floor(Math.random() * 15 + 1) * box
    }
}

window.onload = function () {
    modal.style.transform = 'scale(0)';
}

function showModal() {
    modal.style.transition = '0.5s'
    modal.style.transform = 'scale(1)';
    gameCanvas.style.filter = 'blur(1.2px)';

}

function updateScore() {
    for (i = 0; i < obstacle.length; i++) {
        if (obstacle[i].x < box + 20){
            pontos++;
            console.log(pontos);
            document.getElementById("score").innerHTML = `${pontos}`;
        }
    }
}

function createspShip() {
    for (i = 0; i < spShip.length; i++) {
        context.fillStyle = "rgba(0,0,0,0)";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(spShip[i].x, spShip[i].y, box, box);
        context.drawImage(shipImg, spShip[i].x, spShip[i].y, box + 30, box);
    }
}

function drawObstacles() {
    for (let i = 0; i < obstacle.length; i++) {
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(obstacle[i].x, obstacle[i].y, box, box);
        context.drawImage(meteorImg, obstacle[i].x, obstacle[i].y, box + 30, box);
    }
}

function moveObstacles() {
    for (let i = 0; i < obstacle.length; i++)
    {
        if(i % 2 ==0)
        {
            obstacle[i].x -= obstacleSpeed;
        }
        else
        {
            obstacle[i].x -= (obstacleSpeed +3);
        }
        if (obstacle[i].x < box) {
            obstacle[i].x = marginX + Math.random() * 10;
            obstacle[i].y = Math.random() * 15 * box;
        }
    }
}

//Mapear as teclas do teclado{
document.addEventListener('keydown', update);
document.addEventListener('keyup', stop);

function stop(event) {
    direction = "right";
}

function update(event) {
    if (event.keyCode == 38) direction = "up";
    if (event.keyCode == 40) direction = "down";
}
// Fim mapeamento

function startGame() {
    if (spShip[0].y == 15 * box) spShip[0].y = 14 * box;
    if (spShip[0].y == 0) spShip[0].y = 1 * box;

    for (i = 1; i < spShip.length; i++) {
        if (spShip[0].x == spShip[i].x && spShip[0].y == spShip[i].y) {
            clearInterval(game);
            alert('Game Over !');
        }
    }
    createspShip();
    updateScore();

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

let game = setInterval(startGame, 50);
let move1 = setTimeout(setInterval(moveObstacles, 50), 3000);


