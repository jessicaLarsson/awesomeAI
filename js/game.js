game = new view();
var level = 1;

game.createBoard();

//CREATE ENEMY
game.createRandomEnemy();
document.getElementById('level').innerHTML = '<br>level: ' + level + '';



game.createPlayer();

//CREATE PRESENTS
var amountOfPresents = 5;
var presents = [];

for(var i = 0; i < amountOfPresents; i++) {
	presents.push(new present());
	presents[i].drawPresent();
}

function checkPresentCollision() {
	//console.log("i checkPresentCollision, currentPosition = " + currentPosition.x);
	for(var i=0; i<amountOfPresents; i++) {
		if(currentPosition.x == presents[i].x && currentPosition.y == presents[i].y) presents[i].pickedUpAction();
	}
}



//EVENT HANDLERS
window.addEventListener("keydown", game.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {
	game.moveEnemies();
	checkPresentCollision();

	}, 400); 

