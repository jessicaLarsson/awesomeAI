game = new view();
var level = 1;
var pickedUpPresents = 0;
var points = 0;
var amountOfPresents = 2;

game.createBoard();

//CREATE ENEMY
game.createRandomEnemy();
document.getElementById('level').innerHTML = '<br>level: ' + level + '';


game.createSanta();
game.createPlayer();
createPresents(amountOfPresents);



//CREATE PRESENTS
var amountOfPresents = (level*2+1);
var presents = [];


for(var i = 0; i < amountOfPresents; i++) {
	presents.push(new present());
	presents[i].drawPresent();
function createPresents(amountOfPresents) {
	presents = [];

	for(var i = 0; i < amountOfPresents; i++) {
		presents.push(new present());
		presents[i].drawPresent();
	}

}

}
function checkIfDone() {
	if(pickedUpPresents == amountOfPresents && !playerHasPresent) {
		level++;
		setNewLevel();
		pickedUpPresents = 0;

	}
}

function setNewLevel() {
	document.getElementById('level').innerHTML = '<br>level: ' + level + '';
    amountOfPresents++;
    createPresents(amountOfPresents);
    if(level == 2) game.createShortestPathEnemy();   
    if(level == 3) game.createGoalEnemy();
}

//EVENT HANDLERS
window.addEventListener("keydown", game.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {
	game.moveEnemies();
	checkIfDone();
	}, 400); 

