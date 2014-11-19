function view(){

  function drawCurrentPosition(currentPosition) {
    player    
      .attr("cx", scales.x(currentPosition.x + 0.5))
      .attr("cy", scales.y(currentPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "position");

  }

  function checkEnemyCollision(){
    var enemyRandomDist = Math.abs(enemy1.pos.x-currentPosition.x) + Math.abs(enemy1.pos.y-currentPosition.y);
    
    if(level > 1) {
      var enemyDist = Math.abs(enemy1.pos.x-currentPosition.x) + Math.abs(enemy1.pos.y-currentPosition.y);

    } else {
      var enemyNextDistance = 1;
    }
    if(level > 2) {
      var enemyGoalDist = Math.abs(enemy2.pos.x-currentPosition.x) + Math.abs(enemy2.pos.y-currentPosition.y);
    } else var enemyGoalDist = 1;
    
    if(enemyDist == 0 || enemyRandomDist == 0 || enemyGoalDist == 0){
      if(playerHasPresent) {
        playerHasPresent = false;
        document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b>Oh no! You lost the present! Quick get all the others!';
        
      } else {
        alert("GAME OVER - Christmas is ruined!!");
        clearInterval(enemyMoveInterval);

      }   
    }
  }


  this.keyDownHandler = function(event){
    var key = event.which;
    var next;

    // Let keypress handle displayable characters
      if(key>46){ return; }

        switch(key){
          case 37:  // left key
              next =  board.grid[currentPosition.x-1][currentPosition.y];
              playerDirection.x = -1;
              playerDirection.y = 0;
              break;

            case 39:  // right key 
                next = board.grid[currentPosition.x+1][currentPosition.y];
                playerDirection.x = 1;
                playerDirection.y = 0;
              break;

             case 38: //up key
                next = board.grid[currentPosition.x][currentPosition.y-1];
                playerDirection.x = 0;
                playerDirection.y = -1;
              break;

             case 40: //down key
                next = board.grid[currentPosition.x][currentPosition.y+1];
                playerDirection.x = 0;
                playerDirection.y = 1;
              break;

            default:
              break;
          }
          executeCommands(next);
        }

  function executeCommands(next) {
      switch(next.type) {
        case "path":
          currentPosition = next;
          drawCurrentPosition(currentPosition);
          checkSantaStatus();
          checkEnemyCollision();
          break;
        
        case "wall":
          // stay at the same place
          break;
        
        case "ice":
          //någonting ska väl hända??
          return;
        
        default:
          throw "Unexpected terrain type "+next.type;
      }

      //check if player reached a present
      for(var i=0; i<amountOfPresents; i++) {
          if(currentPosition.x == presents[i].x && currentPosition.y == presents[i].y) presents[i].pickedUpAction();
      }

      //check if player wants to interact with santa
      if(currentPosition.x == santaPosition.x && currentPosition.y == santaPosition.y) {
        if(playerHasPresent) {
          points = points+10;
          document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> Thank you!';
          document.getElementById('points').innerHTML = '<br><b>Points:</b> ' + points;
          playerHasPresent = false;
        } else {
          document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> Hurry up! Save Christmas by collecting all of the presents!';
        }
      }
  }

  function checkSantaStatus(){
    if(true){ //if holding a present
      if(currentPosition.x == santaPosition.x && currentPosition.y == santaPosition.y){
        //give santa present
        console.log("hello santa, here is a present :) ");
      }
    }
  }

  this.createSanta = function(){
    santaPosition = gameBoard.pickRandomPosition();
    santa = svgContainer
          .append("g")
          .append("circle")
          .attr("cx", scales.x(santaPosition.x + 0.5))
          .attr("cy", scales.y(santaPosition.y + 0.5))
          .attr("r", circleRadius)
          .attr("class", "santa");
  }

  this.createPlayer = function(){
    playerHasPresent = false;
  	currentPosition = gameBoard.pickRandomPosition();
    playerDirection = {x:0, y:0}
  	player = svgContainer
  	      .append("g")
  	      .append("circle")
  	      .attr("cx", scales.x(currentPosition.x + 0.5))
  	      .attr("cy", scales.y(currentPosition.y + 0.5))
  	      .attr("r", circleRadius)
  	      .attr("class", "position");
  		  
  	  
  }

}