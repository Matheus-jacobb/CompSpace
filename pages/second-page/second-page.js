window.onload = function(){
  document.getElementById("score").innerHTML = "2";
}

let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 64;
let snake = [];
snake[0] = {
    x: box,
    y: box
}
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

function createBG() {
    context.fillStyle = ("black");
    context.fillRect(0, 0, 32 * box, 32 * box);
}

function createSnake(){
    for(i=0; i < snake.length; i++){
        context.fillStyle = "purple";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood(){
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

//Mapear as teclas do teclado{
document.addEventListener('keydown', update);

function update (event){
    if(event.keyCode == 38) direction = "up";
    if(event.keyCode == 40) direction = "down";
}
//} Fim mapeamento

function startGame(){
    if(snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 0 && direction == "left") snake[0].x = 16 * box;
    if(snake[0].y > 15 * box && direction == "down") snake[0].y =0;
    if(snake[0].y < 0 && direction == "up") snake[0].y = 16 * box;

    for (i = 1; i < snake.length; i++){
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(game);
            alert('Game Over !');
        }
    }
    createBG();
    createSnake();
    drawFood();

    //inicializar cobrinha em 0x0
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //andar com a cobrinha (box = pixel)
    if(direction == "down") snakeY += box;
    if(direction == "up") snakeY -= box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop();
    }
    else{
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

let game = setInterval(startGame, 50);