var game = new view();
var level = 1;
game.createBoard();
game.createRandomEnemy();
document.getElementById('level').innerHTML = '<br>level: ' + level + '';



game.createPlayer();

window.addEventListener("keydown", game.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {game.moveEnemies()}, 400); 

