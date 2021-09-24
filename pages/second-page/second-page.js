window.onload = function(){
  document.getElementById("score").innerHTML = "2";
}

let canvas = document.getElementById("spShip");
let context = canvas.getContext("2d");
let box = 64;
let spShip = [];
spShip[0] = {
    x: box,
    y: box
}
let direction = "right";
let obstacle = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

function createBG() {
    context.fillStyle = ("black");
    context.fillRect(0, 0, 32 * box, 32 * box);
}

function createspShip(){
    for(i=0; i < spShip.length; i++){
        context.fillStyle = "purple";
        context.fillRect(spShip[i].x, spShip[i].y, box, box);
    }
}

function drawobstacle(){
    context.fillStyle = "red";
    context.fillRect(obstacle.x, obstacle.y, box, box);
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
//} Fim mapeamento

function startGame(){
    if(spShip[0].x > 15 * box && direction == "right") spShip[0].x = 0;
    if(spShip[0].x < 0 && direction == "left") spShip[0].x = 16 * box;
    if(spShip[0].y > 15 * box && direction == "down") spShip[0].y =0;
    if(spShip[0].y < 0 && direction == "up") spShip[0].y = 16 * box;

    for (i = 1; i < spShip.length; i++){
        if (spShip[0].x == spShip[i].x && spShip[0].y == spShip[i].y){
            clearInterval(game);
            alert('Game Over !');
        }
    }
    createBG();
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