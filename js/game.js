var game = new view();
game.createBoard();
game.createRandomEnemy();
game.createShortestPathEnemy();
game.createPlayer();

window.addEventListener("keydown", game.keyDownHandler, true);
enemyMoveInterval = setInterval(function () {game.moveEnemies()}, 300); 

