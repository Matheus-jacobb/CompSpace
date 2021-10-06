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
  obstacle[0] = {
      x: Math.floor(Math.random() * 15 + 1) * box,
      y: Math.floor(Math.random() * 15 + 1) * box
  }
  
function updateScore(){
    if(obstacle[0].x < box+20) 
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
  
  function drawobstacle(){
      context.fillStyle = "rgba(0,0,0,0)";
      context.fillRect(obstacle[0].x, obstacle[0].y, box, box);
      context.drawImage(meteorImg, obstacle[0].x, obstacle[0].y, box+30 , box);
  }
  
   function moveObstacle(){
      let  marginX = 2100;
      obstacle[0].x -= 20;
      if(obstacle[0].x < box)
      {
        obstacle[0].x =  marginX;
        obstacle[0].y = Math.random()*15*box;
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
      drawobstacle()
      
      


      //inicializar cobrinha em 0x0
      let spShipX = spShip[0].x;
      let spShipY = spShip[0].y;
  
      const margin = 20;

      //andar com a cobrinha (box = pixel)
      if(direction == "down") spShipY += box;
      if(direction == "up") spShipY -= box;
      

      if(spShipX != obstacle[0].x || spShipY != obstacle[0].y){
          spShip.pop();
      }
      if((spShipX >= obstacle[0].x - margin && spShipX <= obstacle[0].x + margin ) && (spShipY >= obstacle[0].y - margin && spShipY <= obstacle[0].y + margin )){
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
  let move = setTimeout(setInterval(moveObstacle,50),3000);
  