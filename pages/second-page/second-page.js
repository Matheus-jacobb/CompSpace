window.onload = function(){
  }

  let pontos = 0;
  let canvas = document.getElementById("spShip");
  let context = canvas.getContext("2d");
  let box = 64;
  let spShip = [];
  let obstacle = [];

  var shipImg = new Image();
  shipImg.src = "../../assets/img/rocket-direita.gif";
  
  var meteorImg = new Image();
  meteorImg.src = "../../assets/img/meteoro.png";
  
  spShip[0] = {
      x: box,
      y: box
  }

  let direction = "right";

  for(let i = 0; i < 5; i++){
    obstacle[i] = {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box
    }
}
  
function updateScore(){
    if(obstacle[0].x < box+20 || obstacle[1].x < box+20 || obstacle[2].x < box+20 || obstacle[3].x < box+20 || obstacle[4].x < box+20) 
    {
        pontos++;
        console.log(pontos);
        document.getElementById("score").innerHTML = `${pontos}`;
    }
}

  function createspShip(){
      for(i=0; i < spShip.length; i++){
          context.fillStyle = "rgba(0,0,0,0)";
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillRect(spShip[i].x, spShip[i].y, box, box);
          context.drawImage(shipImg, spShip[i].x, spShip[i].y, box+30 , box);
      }
  }
  
  function drawObstacles(){
      for(let i = 0; i < obstacle.length; i++){
            context.fillStyle = "rgba(0,0,0,0)";
            context.fillRect(obstacle[i].x, obstacle[i].y, box, box);
            context.drawImage(meteorImg, obstacle[i].x, obstacle[i].y, box+30 , box);
      }
  }
  
   function moveObstacles(){
      let  marginX = 2100;
      for(let i = 0; i < obstacle.length; i++){
        obstacle[i].x -= 20;
        if(obstacle[i].x < box)
        {
            obstacle[i].x =  marginX + Math.random()*10;
            obstacle[i].y = Math.random()*15*box;
        }
      }  
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
      if(spShip[0].y == 15 * box) spShip[0].y = 14 * box;
      if(spShip[0].y == 0) spShip[0].y = 1 * box;
  
      for (i = 1; i < spShip.length; i++){
          if (spShip[0].x == spShip[i].x && spShip[0].y == spShip[i].y){
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
      if(direction == "down") spShipY += 32;
      if(direction == "up") spShipY -= 32;
      

      if((spShipX != obstacle[0].x || spShipY != obstacle[0].y)){
          spShip.pop();
      }
      
    if((spShipX >= obstacle[0].x - margin && spShipX <= obstacle[0].x + margin) && (spShipY >= obstacle[0].y - margin && spShipY <= obstacle[0].y + margin) ||
       (spShipX >= obstacle[1].x - margin && spShipX <= obstacle[1].x + margin) && (spShipY >= obstacle[1].y - margin && spShipY <= obstacle[1].y + margin) ||
       (spShipX >= obstacle[2].x - margin && spShipX <= obstacle[2].x + margin) && (spShipY >= obstacle[2].y - margin && spShipY <= obstacle[2].y + margin) ||
       (spShipX >= obstacle[3].x - margin && spShipX <= obstacle[3].x + margin) && (spShipY >= obstacle[3].y - margin && spShipY <= obstacle[3].y + margin) ||
       (spShipX >= obstacle[4].x - margin && spShipX <= obstacle[4].x + margin) && (spShipY >= obstacle[4].y - margin && spShipY <= obstacle[4].y + margin )){
        //spShip.pop();
        alert('game over');
    }

  
      let newHead = {
          x: spShipX,
          y: spShipY
      }
  
      spShip.unshift(newHead);
  }
  
  let game = setInterval(startGame, 50);
  //let meteoro = setTimeout(,1000);
  let move1 = setTimeout(setInterval(moveObstacles,50),3000);
  
  
  