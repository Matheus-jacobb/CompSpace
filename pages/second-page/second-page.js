window.onload = function(){
  document.getElementById("score").innerHTML = "2";
}

let canvas = document.getElementById("spShip");
let context = canvas.getContext("2d");
let box = 64;
let spShip = [];

var shipImg = new Image();
shipImg.src = "../../assets/img/rocket-direita.gif";

var meteorImg = new Image();
meteorImg.src = "../../assets/img/meteoro.png";

spShip[0] = {
    x: box,
    y: box
}
let direction = "right";
let obstacle = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

function createspShip(){
    for(i=0; i < spShip.length; i++){
        context.fillStyle = "rgba(0,0,0,0)";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(spShip[i].x, spShip[i].y, box, box);
        context.drawImage(shipImg, spShip[i].x, spShip[i].y, box+30 , box);
    }
}

function drawobstacle(){
    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(obstacle.x, obstacle.y, box, box);
    context.drawImage(meteorImg, obstacle.x, obstacle.y, box+30 , box);
}

//Mapear as teclas do teclado{
document.addEventListener('keydown', update);
document.addEventListener('keyup', stop);

function stop (event){
    direction = "right";
}

function update (event){
    if(event.keyCode == 38) direction = "up";
    if(event.keyCode == 40) direction = "down";
}
// Fim mapeamento

function startGame(){
    // if(spShip[0].x > 15 * box && direction == "right") spShip[0].x = 0;
    // if(spShip[0].x < 0 && direction == "left") spShip[0].x = 16 * box;
    if(spShip[0].y == 15 * box) spShip[0].y = 14 * box;
    if(spShip[0].y == 0) spShip[0].y = 1 * box;

    for (i = 1; i < spShip.length; i++){
        if (spShip[0].x == spShip[i].x && spShip[0].y == spShip[i].y){
            clearInterval(game);
            alert('Game Over !');
        }
    }
    createspShip();
    drawobstacle();

    //inicializar cobrinha em 0x0
    let spShipX = spShip[0].x;
    let spShipY = spShip[0].y;

    //andar com a cobrinha (box = pixel)
    if(direction == "down") spShipY += box;
    if(direction == "up") spShipY -= box;

    if(spShipX != obstacle.x || spShipY != obstacle.y){
        spShip.pop();
    }
    else{
        obstacle.x = Math.floor(Math.random() * 15 + 1) * box;
        obstacle.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: spShipX,
        y: spShipY
    }

    spShip.unshift(newHead);
}

let game = setInterval(startGame, 50);