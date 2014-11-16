function view(){

	function getSvgSize(gridSize, squareLength) {
    var width = gridSize.x * squareLength;
    var height = gridSize.y * squareLength;
    return { width:width, height:height };
  }

  function isBorder(x, y, gridSize) {
    return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
  }

  function buildboard(gridSize, ratios) {
    var board = { grid:[], path:[], wall:[], ice:[] };
    for (x = 0; x < gridSize.x; x++) {
        board.grid[x] = [];
        for (y = 0; y < gridSize.y; y++) {
            var type = "path";
            if(isBorder(x, y, gridSize)) {
              type = "wall";
            } else {
              if(Math.random() < ratios.wall) {
                type = "wall";
              }
              if(Math.random() < ratios.ice) {
                type = "ice";
              }
            }
            var cell = { x:x, y:y , type:type };
            board.grid[x][y] = cell;
            board[type].push(cell);
        }
    }
    return board;
  }

  function getScale(gridSize, svgSize) {
    var xScale = d3.scale.linear().domain([0,gridSize.x]).range([0,svgSize.width]);
    var yScale = d3.scale.linear().domain([0,gridSize.y]).range([0,svgSize.height]);
    return { x:xScale, y:yScale };
  }

  function drawCells(svgContainer, scales, data, cssClass) {
    var gridGroup = svgContainer.append("g");
    var cells = gridGroup.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");
    var cellAttributes = cells
             .attr("x", function (d) { return scales.x(d.x); })
             .attr("y", function (d) { return scales.y(d.y); })
             .attr("width", function (d) { return squareLength; })
             .attr("height", function (d) { return squareLength; })
             .attr("class", cssClass);

  }

  function drawWall(svgContainer, scales, data, cssClass){
    var gridGroup = svgContainer.append("g");

    var cells = gridGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle");
    var cellAttributes = cells
    
             .attr("cx", function (d) { return scales.x(d.x+0.5); })
             .attr("cy", function (d) { return scales.y(d.y+0.5); })
             .attr("r", circleRadius)
             
             .attr("class", cssClass);
  }

  function drawCurrentPosition(currentPosition) {
    player    
      .attr("cx", scales.x(currentPosition.x + 0.5))
      .attr("cy", scales.y(currentPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "position");

  }
  
  function drawEnemyDirection (enemyPosition){
	enemy.remove();
  enemy = svgContainer
    .append("g")
    .append("circle")
	  .attr("cx", scales.x(enemyPosition.x + 0.5))
    .attr("cy", scales.y(enemyPosition.y + 0.5))
    .attr("r", circleRadius)
    .attr("class", "enemy");
  }

  function drawEnemyGoalDirection (blubb){
    enemyGoal.remove();
    enemyGoal = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(blubb.x + 0.5))
      .attr("cy", scales.y(blubb.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemyGoal");
  }
   
  function drawEnemyRandomDirection (blubb){
    enemyRandom.remove();
    enemyRandom = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(blubb.x + 0.5))
      .attr("cy", scales.y(blubb.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemyRandom");
  }

  function enemyNextDistance(){
		//dist = Math.sqrt(Math.pow((enemyPosition.x-currentPosition.x),2) + Math.pow((enemyPosition.y - currentPosition.y),2)); 
		var distX = (enemyPosition.x-currentPosition.x);
		var distY = (enemyPosition.y-currentPosition.y);
		var enemyNext;

    //console.log("DistX: " + Math.abs(distX) + ", DistY: " + Math.abs(distY));
		
			if(Math.abs(distX) > Math.abs(distY)){		
        var direction = distX/Math.abs(distX);	
				enemyNext = board.grid[enemyPosition.x-direction][enemyPosition.y];
			}
			else{
        var direction = distY/Math.abs(distY); 
				enemyNext = board.grid[enemyPosition.x][enemyPosition.y-direction];	
			}
		
		switch(enemyNext.type) {
      case "path":
      case "ice":
        enemyPosition = enemyNext;
        drawEnemyDirection(enemyPosition);
        break;
      
      case "wall":
        //enemyNext = board.grid[enemyPosition.x-1][enemyPosition.y+1]; // DO something different
        enemyPosition = enemyNext;
        drawEnemyDirection(enemyNext);
		    break;

		}
   // checkGameOver();
  }

  function enemyRandomNext(){
    //console.log("enemyRandom = " + enemyRandom);
    //console.log(enemyRandomPosition.x + ", " + enemyRandomPosition.y);
    if(enemyRandomPosition.x == enemyRandomDirection.x && enemyRandomPosition.y == enemyRandomDirection.y) {
        enemyRandomDirection = pickRandomPosition(board);
        
    }
    var distX = (enemyRandomPosition.x-enemyRandomDirection.x);
    var distY = (enemyRandomPosition.y-enemyRandomDirection.y);
    var enemyNext;

      if(Math.abs(distX) > Math.abs(distY)){    
        var direction = distX/Math.abs(distX);  
        enemyNext = board.grid[enemyRandomPosition.x-direction][enemyRandomPosition.y];
      }
      else{
        var direction = distY/Math.abs(distY); 
        enemyNext = board.grid[enemyRandomPosition.x][enemyRandomPosition.y-direction]; 
      }
    
    switch(enemyNext.type) {
      case "path":
      case "ice":
        enemyRandomPosition = enemyNext;
        drawEnemyRandomDirection(enemyRandomPosition);
        break;
      
      case "wall":
        enemyRandomDirection = pickRandomPosition(board);
        drawEnemyRandomDirection(enemyRandomPosition);
        break;

    }

    //console.log(enemyRandomPosition);
    //checkGameOver();
  }

  function enemyNextGoal(){
    var distX = (enemyGoalPosition.x-(currentPosition.x + playerDirection.x*10));
    var distY = (enemyGoalPosition.y-(currentPosition.y + playerDirection.y*10));
    if(distX && distY < 10){
      distX = (enemyGoalPosition.x-currentPosition.x);
      distY = (enemyGoalPosition.y-currentPosition.y);
    }

    var enemyGoalNext;

    
      if(Math.abs(distX) > Math.abs(distY)){    
        var direction = distX/Math.abs(distX);  
        enemyGoalNext = board.grid[enemyGoalPosition.x-direction][enemyGoalPosition.y];
      }
      else{
        var direction = distY/Math.abs(distY); 
        enemyGoalNext = board.grid[enemyGoalPosition.x][enemyGoalPosition.y-direction]; 
      }
    
    switch(enemyGoalNext.type) {
      case "path":
      case "ice":
        enemyGoalPosition = enemyGoalNext;
        drawEnemyGoalDirection(enemyGoalPosition);
        break;
      
      case "wall":
        enemyGoalPosition = enemyGoalNext;
        drawEnemyGoalDirection(enemyGoalNext);
        break;

    }
  }

  this.moveEnemies = function() {
    
    enemyRandomNext();

    if(level > 1) {
      enemyNextDistance();
    }
    if(level > 2) {
      enemyNextGoal();
    }
    
    checkGameOver();
    
  }
   
  function inGoal (){
    var goalDist = Math.abs(goalPosition.x-currentPosition.x) + Math.abs(goalPosition.y-currentPosition.y);
    if (goalDist == 0){
        points = points+100;
        document.getElementById('points').innerHTML = '<br>Points: ' + points + '';
		
		//New goal
		goal.remove();
    goal = pickRandomPosition(board);
    goalPosition = goal;

    goal = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(goal.x + 0.5))
      .attr("cy", scales.y(goal.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "goal");


      level++;
      setLevel(level);
    }
  }

  function setLevel(level) {
    if(level == 2) {
      document.getElementById('level').innerHTML = '<br>level: ' + level + '';
      game.createShortestPathEnemy();
    }
    if(level == 3) {
      document.getElementById('level').innerHTML = '<br>level: ' + level + '';
      game.createGoalEnemy();
    }
  }

  function checkGameOver(){

    var enemyRandomDist = Math.abs(enemyRandomPosition.x-currentPosition.x) + Math.abs(enemyRandomPosition.y-currentPosition.y);
    
    if(level > 1) {
      var enemyDist = Math.abs(enemyPosition.x-currentPosition.x) + Math.abs(enemyPosition.y-currentPosition.y);

    } else {
      var enemyNextDistance = 1;
    }
    if(level > 2) {
      var enemyGoalDist = Math.abs(enemyGoalPosition.x-currentPosition.x) + Math.abs(enemyGoalPosition.y-currentPosition.y);
    } else var enemyGoalDist = 1;
    
    

    // if(document.getElementById('randomCheckBox').checked == true) {
    //    enemyRandomDist = Math.abs(enemyRandomPosition.x-currentPosition.x) + Math.abs(enemyRandomPosition.y-currentPosition.y);
    // } else {
    //   enemyRandomDist = 1; //make the distance !=0
    // }
    //console.log("enemyRandomDist = " + enemyRandomDist);

     //console.log("currentPosition.x = " + currentPosition.x);
     //console.log(currentPosition.x);
    if(enemyDist == 0 || enemyRandomDist == 0 || enemyGoalDist == 0){
      clearInterval(enemyMoveInterval);
      alert("GAME OVER - Christmas is ruined!!");
    }
  }

  function pickRandomPosition(board) {
    var path = board.path;
    var i = Math.ceil(Math.random() * path.length);
    return path[i];
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
		      inGoal();

        }

  function executeCommands(next) {
      switch(next.type) {
        case "path":
          currentPosition = next;
          drawCurrentPosition(currentPosition);
          checkSantaStatus();
          checkGameOver();
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
  }

  function checkSantaStatus(){
    if(true){ //if holding a present
      if(currentPosition.x == santaPosition.x && currentPosition.y == santaPosition.y){
        //give santa present
        console.log("hello santa, here is a present :) ");
      }
    }
  }

  this.createBoard = function(){
    console.log("level = " + level);
	  squareLength = 18;
	  circleRadius = 9;
	  ratios = { wall:0.1, ice:0.01 }; 
	   gridSize = { x:40, y:35 };
	   svgSize = getSvgSize(gridSize, squareLength);
	   board = buildboard(gridSize, ratios);
	   svgContainer = d3.select(".display")
	                          .append("svg")
	                            .attr("width", svgSize.width)
	                            .attr("height", svgSize.height);
	   scales = getScale(gridSize, svgSize);
	  drawCells(svgContainer, scales, board.path, "path");
	  drawWall(svgContainer, scales, board.wall, "wall");
	  drawCells(svgContainer, scales, board.ice, "ice");

	   groups = { path:svgContainer.append("g"),
	                  position:svgContainer.append("g") };

	  

	   goalPosition = pickRandomPosition(board);
	   points = 0;
	   goal = svgContainer
	      .append("g")
	      .append("circle")
	      .attr("cx", scales.x(goalPosition.x + 0.5))
	      .attr("cy", scales.y(goalPosition.y + 0.5))
	      .attr("r", circleRadius)
	      .attr("class", "goal");

}

  this.createRandomEnemy = function(){

  	   enemyRandomPosition = pickRandomPosition(board);
  	   enemyRandomDirection = pickRandomPosition(board);
  	   enemyRandom = svgContainer
  	      .append("g")
  	      .append("circle")
  	      .attr("cx", scales.x(enemyRandomPosition.x + 0.5))
  	      .attr("cy", scales.y(enemyRandomPosition.y + 0.5))
  	      .attr("r", circleRadius)
  	      .attr("class", "enemyRandom");
  }

  this.createShortestPathEnemy = function(){
  	   enemyPosition = pickRandomPosition(board);
  	   enemy = svgContainer
  	      .append("g")
  	      .append("circle")
  	      .attr("cx", scales.x(enemyPosition.x + 0.5))
  	      .attr("cy", scales.y(enemyPosition.y + 0.5))
  	      .attr("r", circleRadius)
  	      .attr("class", "enemy");  
  	  
  	  
  }

  this.createGoalEnemy = function(){
       enemyGoalPosition = pickRandomPosition(board);
       enemyGoal = svgContainer
          .append("g")
          .append("circle")
          .attr("cx", scales.x(enemyGoalPosition.x + 0.5))
          .attr("cy", scales.y(enemyGoalPosition.y + 0.5))
          .attr("r", circleRadius)
          .attr("class", "enemyGoal");  
      
      
  }

  this.createPlayer = function() {
  	currentPosition = pickRandomPosition(board);
    playerDirection = {x:0, y:0}
  	player = svgContainer
  	      .append("g")
  	      .append("circle")
  	      .attr("cx", scales.x(currentPosition.x + 0.5))
  	      .attr("cy", scales.y(currentPosition.y + 0.5))
  	      .attr("r", circleRadius)
  	      .attr("class", "position");
  }

  this.createSanta = function(){
    santaPosition = pickRandomPosition(board);
    santa = svgContainer
          .append("g")
          .append("circle")
          .attr("cx", scales.x(santaPosition.x + 0.5))
          .attr("cy", scales.y(santaPosition.y + 0.5))
          .attr("r", circleRadius)
          .attr("class", "santa");
  }






}