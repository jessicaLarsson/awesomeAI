var level = 1;
var maxLevel = 3;
var lives = 3;
var pickedUpPresents = 0;
var points = 0;
var amountOfPresents = 2;
var pause = true;


updateInfoPanel();
$('#newGameModal').modal('show');


//CREATE GAMEBOARD
gameBoard = new gameBoard();
gameBoard.buildBoard();
gameBoard.draw();

//CREATE PRESENTS
var amountOfPresents = 3;
createPresents(amountOfPresents);

//CREATE SANTA
santa = new santa();
santa.draw();

//CREATE PLAYER
player = new player();
player.draw();

//CREATE ENEMY
var enemies =[]; 
//enemies.push(new enemy("enemyClosestDistance"));
enemies.push(new enemy("enemyAstar"));
enemies[0].draw();


//INTERVAL FUNCTIONS
enemyMoveInterval = setInterval(function () {
	if(!pause){
		moveEnemies();
		checkIfDone();
		checkEnemyCollision();
	}
}, 400); 


function startGame(){
	pause = false;
	listener = window.addEventListener("keydown", keyDownHandler, true);

}

function pauseGame(){
	pause = true;
	listener = window.addEventListener("keydown", keyDownHandler, false);

}

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
	updateInfoPanel();
    amountOfPresents++;
    createPresents(amountOfPresents);
    pauseGame();
    $('#newLevelModal').modal('show');
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
		    document.getElementById('santasResponse').innerHTML = 'Oh no! You lost the present! Quick get all the others!';	    
	  	}
    	lives = lives-1;
    	document.getElementById('life'+(lives+1)).className += " faded_life"
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
			document.getElementById('santasResponse').innerHTML = 'Thank you!';
			player.hasPresent = false;
		} else {
			document.getElementById('santasResponse').innerHTML = 'Hurry up! Save Christmas by collecting all of the presents!';
		}
		updateInfoPanel();
	}
}

//GAME INFO PANEL TEXT
function updateInfoPanel() {
	document.getElementById('level').innerHTML = '<b>Level:</b> ' + level + '';
	//document.getElementById('lives').innerHTML = '<b>Lives:</b> ' + lives + '';
	document.getElementById('points').innerHTML = '<b>Points:</b> ' + points + '';

}

