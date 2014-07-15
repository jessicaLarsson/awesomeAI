var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
var playerX = 80;
var playerY = 100;
var playerRadius = 2;

var enemyX = 100;
var enemyY = 140;
var enemyRadius = 4;

window.addEventListener("keydown", keyDownHandler, true);
draw();

//Jessica
//Felicia
function draw(){
	//clear the canvas for the next frame
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	ctx.arc(playerX,playerY,playerRadius,0,2*Math.PI, false); //player
  ctx.arc(enemyX, enemyY, enemyRadius, 0,2*Math.PI, false); //enemy
	ctx.closePath();
	ctx.fill();
}
//Jessica
function keyDownHandler(event){
	var key = event.which;

	// Let keypress handle displayable characters
    if(key>46){ return; }

    switch(key){
        case 37:  // left key
	          if((playerX-2)<= 0) { 
	          	 playerX = 0;
	          } else {
	          	playerX -= 2;	
	          }

              break;

            case 39:  // right key 
              if(playerX >= c.width){
              	playerX = c.width;
              } else {
              	playerX += 2;
              }
              

              break;

             case 38: //up key
             	if(playerY-2 <= 0){
             		playerY = 0;
             	} else {
             		playerY -= 2;
             	}

             	break;

             case 40: //down key
             	if(playerY+2 >= c.height){
             		playerY = c.height;
             	} else {
             		playerY += 2;
             	}
             	break;

            default:
              break;
        }

        // redraw the player in its new position
        draw();
        if(checkGameOver()){
          window.removeEventListener("keydown", keyDownHandler, true);
          alert("Game over!");
        }
}

function checkGameOver(){
  if(Math.abs(enemyX - playerX) < 3 && Math.abs(enemyY - playerY) < 3){
    console.log("GAME OVER");
    return true;
  }else{
    console.log("STILL ALIVE");
    return false;
  }
}



