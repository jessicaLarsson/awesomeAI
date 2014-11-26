var level = 1;
var maxLevel = 3;
var lives = 3;
var pickedUpPresents = 0;
var points = 0;
var amountOfPresents = 2;



document.getElementById('level-body').innerHTML = '<b>level:</b> ' + level + '';
$('#newLevelModal').modal('show');


//CREATE GAMEBOARD
gameBoard = new gameBoard();
gameBoard.buildBoard();
gameBoard.draw();

//CREATE PLAYER
player = new player();
player.draw();

//CREATE ENEMY
var enemies =[]; 
enemies.push(new enemy("enemyClosestDistance"));
enemies[0].draw();

//CREATE SANTA
santa = new santa();
santa.draw();


//CREATE PRESENTS
var amountOfPresents = (level*2+1);
createPresents(amountOfPresents);

//GAME INFO PANEL TEXT
document.getElementById('level').innerHTML = '<br><b>level:</b> ' + level + '';
document.getElementById('lives').innerHTML = '<br><b>lives:</b> ' + lives + '';


//EVENT HANDLERS
window.addEventListener("keydown", keyDownHandler, true);

//INTERVAL FUNCTIONS
enemyMoveInterval = setInterval(function () {
	moveEnemies();
	checkIfDone();
	checkEnemyCollision();
	}, 400); 


function moveEnemies() {
	for(var i = 0; i < enemies.length; i++){
		enemies[i].move();
	}
}


function createPresents(amountOfPresents) {
	presents = [];
	for(var i = 0; i < amountOfPresents; i++) {
		presents.push(new present());
		presents[i].draw();
	}
}

function setNewLevel() { 
	document.getElementById('level').innerHTML = '<br><b>level:</b> ' + level + '';
    amountOfPresents++;
    createPresents(amountOfPresents);
    if(level == 2){
    	enemies.push(new enemy("enemyRandomMovement"));
		enemies[1].draw();
    }
    if(level == 3){
    	enemies.push(new enemy("enemyPlayerDirection"));
		enemies[2].draw();
    }
}
  
function keyDownHandler(event){
	var key = event.which;
    var next;

	if(key==37 || key==39 || key==38 || key==40){

		switch(key){
	      case 37:  // left key
	          next =  gameBoard.board.grid[player.pos.x-1][player.pos.y];
	          player.direction.x = -1;
	          player.direction.y = 0;
	          break;

	        case 39:  // right key 
	            next = gameBoard.board.grid[player.pos.x+1][player.pos.y];
	            player.direction.x = 1;
	            player.direction.y = 0;
	          break;

	         case 38: //up key
	            next = gameBoard.board.grid[player.pos.x][player.pos.y-1];
	            player.direction.x = 0;
	            player.direction.y = -1;
	          break;

	         case 40: //down key
	            next = gameBoard.board.grid[player.pos.x][player.pos.y+1];
	            player.direction.x = 0;
	            player.direction.y = 1;
	          break;

	        default:
	          break;
	    }
	    executeCommands(next);
	}
}

function executeCommands(next) {
    switch(next.type) {
        case "path":
          player.pos = next;
          player.draw();
          break;
        
        case "wall":
          // stay at the same place
          break;
        
        case "ice":
          player.hasPresent = false;
          player.pos = next;
          player.draw();
          return;
        
        default:
          throw "Unexpected terrain type "+next.type;
    }

	checkEnemyCollision();
	checkPresents();
	checkSantaInteraction();
	//player.draw();
}

function checkIfDone() {
	if(pickedUpPresents == amountOfPresents && !player.hasPresent) {
		level++;
		setNewLevel();
		pickedUpPresents = 0;
	}

	if(level > maxLevel) {
		alert("YOU SAVED CHRISTMAS! - You got " + points + "points in total!");
        clearInterval(enemyMoveInterval);
	}

	if(lives < 1) {
		alert("GAME OVER - Christmas is ruined!!");
        clearInterval(enemyMoveInterval);
	}
}

function checkEnemyCollision(){
	var taken = false;
	for(var i = 0; i < enemies.length; i++){
		if(Math.abs(enemies[i].pos.x-player.pos.x) + Math.abs(enemies[i].pos.y-player.pos.y) == 0){
			enemies[i].pos =  gameBoard.pickRandomPosition();
			taken = true;
		}
	}	

	if(taken){
		if(player.hasPresent) {
		    player.hasPresent = false;
		    document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b>Oh no! You lost the present! Quick get all the others!';	    
	  	}
    	lives = lives-1;
    	document.getElementById('lives').innerHTML = '<br><b>lives:</b> ' + lives + '';	  	
	}
}

function checkPresents(){
	//check if player reached a present
    for(var i=0; i<amountOfPresents; i++) {
        if(player.pos.x == presents[i].x && player.pos.y == presents[i].y && presents[i].pickedUp == false) {
        	presents[i].pickedUpAction();
        	player.draw();
        }
    }
}

function checkSantaInteraction(){
	//check if player wants to interact with santa
	if(player.pos.x == santa.pos.x && player.pos.y == santa.pos.y) {
		if(player.hasPresent) {
			points = points+10;
			document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> Thank you!';
			document.getElementById('points').innerHTML = '<br><b>Points:</b> ' + points;
			player.hasPresent = false;
		} else {
			document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> Hurry up! Save Christmas by collecting all of the presents!';
		}
	}
}

