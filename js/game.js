game = new view();
var level = 1;

game.createBoard();

//CREATE ENEMY
game.createRandomEnemy();
document.getElementById('level').innerHTML = '<br>level: ' + level + '';


game.createSanta();
game.createPlayer();

//CREATE PRESENTS
var amountOfPresents = 5;
var presents = [];

for(var i = 0; i < amountOfPresents; i++) {
	presents.push(new present());
	presents[i].drawPresent();
}

function checkPosition() {
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

// d3.xml("images/present_red.svg", function(xml) {
// 	document.body.appendChild(xml.documentElement);

// });


//EVENT HANDLERS
window.addEventListener("keydown", game.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {
	game.moveEnemies();
	checkPosition();

	}, 400); 

