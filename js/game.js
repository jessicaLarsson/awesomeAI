gameBoard = new gameBoard();

view = new view();

var level = 1;
var maxLevel = 3;
var pickedUpPresents = 0;
var points = 0;
var amountOfPresents = 2;


//CREATE ENEMY
enemy1 = new enemy("enemyNextDistance");
enemy1.draw();


document.getElementById('level').innerHTML = '<br>level: ' + level + '';

view.createSanta();
view.createPlayer();


//CREATE PRESENTS
var amountOfPresents = (level*2+1);
createPresents(amountOfPresents);

function createPresents(amountOfPresents) {
	presents = [];
	for(var i = 0; i < amountOfPresents; i++) {
		presents.push(new present());
		presents[i].draw();
	}
}

function checkIfDone() {
	if(pickedUpPresents == amountOfPresents && !playerHasPresent) {
		level++;
		setNewLevel();
		pickedUpPresents = 0;
	}

	if(level > maxLevel) {
		alert("YOU SAVED CHRISTMAS! - You got " + points + "points in total!");
        clearInterval(enemyMoveInterval);
	}
}

function setNewLevel() {
	document.getElementById('level').innerHTML = '<br>level: ' + level + '';
    amountOfPresents++;
    createPresents(amountOfPresents);
    if(level == 2){
    	enemy2 = new enemy("enemyRandomNext");
    	enemy2.draw();
    }
    if(level == 3){
    	enemy3 = new enemy("enemyNextGoal");
    	enemy3.draw();
    }
}


function moveEnemies() {
	enemy1.move();
	if(level > 1){
    	enemy2.move();
    }
    if(level > 2){
    	enemy3.move();
    }
}

//EVENT HANDLERS
window.addEventListener("keydown", view.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {
	moveEnemies();
	checkIfDone();
	}, 400); 

