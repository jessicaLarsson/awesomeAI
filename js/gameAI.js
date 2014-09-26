$(function() {

  function getSvgSize(gridSize, squareLength) {
    var width = gridSize.x * squareLength;
    var height = gridSize.y * squareLength;
    return { width:width, height:height };
  }

  function isBorder(x, y, gridSize) {
    return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
  }

  function buildMap(gridSize, ratios) {
    var map = { grid:[], grass:[], rock:[], lava:[] };
    for (x = 0; x < gridSize.x; x++) {
        map.grid[x] = [];
        for (y = 0; y < gridSize.y; y++) {
            var type = "grass";
            if(isBorder(x, y, gridSize)) {
              type = "rock";
            } else {
              if(Math.random() < ratios.rock) {
                type = "rock";
              }
              if(Math.random() < ratios.lava) {
                type = "lava";
              }
            }
            var cell = { x:x, y:y , type:type };
            map.grid[x][y] = cell;
            map[type].push(cell);
        }
    }
    return map;
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
				enemyNext = map.grid[enemyPosition.x-direction][enemyPosition.y];
			}
			else{
        var direction = distY/Math.abs(distY); 
				enemyNext = map.grid[enemyPosition.x][enemyPosition.y-direction];	
			}
		
		switch(enemyNext.type) {
      case "grass":
      case "lava":
        enemyPosition = enemyNext;
        drawEnemyDirection(enemyPosition);
        break;
      
      case "rock":
        //enemyNext = map.grid[enemyPosition.x-1][enemyPosition.y+1]; // DO something different
        enemyPosition = enemyNext;
        drawEnemyDirection(enemyNext);
		    break;

		}
    checkGameOver();
  }

  function enemyRandomNext(){
    console.log("enemyRandom = " + enemyRandom);
    console.log(enemyRandomPosition.x + ", " + enemyRandomPosition.y);
    if(enemyRandomPosition.x == enemyRandomDirection.x && enemyRandomPosition.y == enemyRandomDirection.y) {
        enemyRandomDirection = pickRandomPosition(map);
        
    }
    var distX = (enemyRandomPosition.x-enemyRandomDirection.x);
    var distY = (enemyRandomPosition.y-enemyRandomDirection.y);
    var enemyNext;

      if(Math.abs(distX) > Math.abs(distY)){    
        var direction = distX/Math.abs(distX);  
        enemyNext = map.grid[enemyRandomPosition.x-direction][enemyRandomPosition.y];
      }
      else{
        var direction = distY/Math.abs(distY); 
        enemyNext = map.grid[enemyRandomPosition.x][enemyRandomPosition.y-direction]; 
      }
    
    switch(enemyNext.type) {
      case "grass":
      case "lava":
        enemyRandomPosition = enemyNext;
        drawEnemyRandomDirection(enemyRandomPosition);
        break;
      
      case "rock":
        enemyRandomDirection = pickRandomPosition(map);
        drawEnemyRandomDirection(enemyRandomPosition);
        break;

    }
    //checkGameOver();
  }

  function moveEnemies() {
    
    if(document.getElementById('pathCheckBox').checked == true) {
      enemyNextDistance();
    } else {
      enemy.remove();
    }
    
    //random enemy
    if(document.getElementById('randomCheckBox').checked == true) {
      enemyRandomNext();
    }  else {
      enemyRandom.remove();
    }
    
  }
   
  function inGoal (){
    var goalDist = Math.abs(goalPosition.x-currentPosition.x) + Math.abs(goalPosition.y-currentPosition.y);
    if (goalDist == 0){
        points = points+100;
        document.getElementById('points').innerHTML = '<br>Points: ' + points + '';
		
		//New goal
		goal.remove();
    goal = pickRandomPosition(map);
    goalPosition = goal;

    goal = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(goal.x + 0.5))
      .attr("cy", scales.y(goal.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "goal");

    }
  }

  function checkGameOver(){
    var enemyDist = Math.abs(enemyPosition.x-currentPosition.x) + Math.abs(enemyPosition.y-currentPosition.y);
    
    if(document.getElementById('randomCheckBox').checked == true) {
       enemyRandomDist = Math.abs(enemyRandomPosition.x-currentPosition.x) + Math.abs(enemyRandomPosition.y-currentPosition.y);
    } else {
      enemyRandomDist = 1; //make the distance !=0
    }

    if(enemyDist == 0 || enemyRandomDist == 0){
      clearInterval(enemyMoveInterval);
      alert("GAME OVER LOSER!!");
    }
  }

  function pickRandomPosition(map) {
    var grass = map.grass;
    var i = Math.ceil(Math.random() * grass.length);
    return grass[i];
  }

  function keyDownHandler(event){
    var key = event.which;
    var next;

    // Let keypress handle displayable characters
      if(key>46){ return; }

      switch(key){
          case 37:  // left key
                next =  map.grid[currentPosition.x-1][currentPosition.y];
                break;

              case 39:  // right key 
                next = map.grid[currentPosition.x+1][currentPosition.y];
                break;

               case 38: //up key
                next = map.grid[currentPosition.x][currentPosition.y-1];
                break;

               case 40: //down key
                  next = map.grid[currentPosition.x][currentPosition.y+1];
                break;

              default:
                break;
          }
          executeCommands(next);
		      inGoal();

        }

  function executeCommands(next) {
      switch(next.type) {
        case "grass":
          currentPosition = next;
          //console.log(currentPosition.x + ", " + currentPosition.y);
          drawCurrentPosition(currentPosition);
          break;
        
        case "rock":
          // stay at the same place
          break;
        
        case "lava":
          //någonting ska väl hända??
          return;
        
        default:
          throw "Unexpected terrain type "+next.type;
      }
  }

  //MAP
  var squareLength = 18;
  var circleRadius = 8;
  var ratios = { rock:0.05, lava:0.01 }; 
  var gridSize = { x:40, y:35 };
  var svgSize = getSvgSize(gridSize, squareLength);
  var map = buildMap(gridSize, ratios);
  var svgContainer = d3.select(".display")
                          .append("svg")
                            .attr("width", svgSize.width)
                            .attr("height", svgSize.height);
  var scales = getScale(gridSize, svgSize);
  drawCells(svgContainer, scales, map.grass, "grass");
  drawCells(svgContainer, scales, map.rock, "rock");
  drawCells(svgContainer, scales, map.lava, "lava");

  var groups = { path:svgContainer.append("g"),
                  position:svgContainer.append("g") };

  //shortest path enemy
  var currentPosition = pickRandomPosition(map);;
  var enemyPosition = pickRandomPosition(map);
  var enemy = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(enemyPosition.x + 0.5))
      .attr("cy", scales.y(enemyPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemy");  
  
  //random enemy
  var enemyRandomPosition = pickRandomPosition(map);
  var enemyRandomDirection = pickRandomPosition(map);
  var enemyRandom = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(enemyRandomPosition.x + 0.5))
      .attr("cy", scales.y(enemyRandomPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemyRandom");

  var goalPosition = pickRandomPosition(map);
  var points = 0;
  var goal = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(goalPosition.x + 0.5))
      .attr("cy", scales.y(goalPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "goal");

   
  var player = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(currentPosition.x + 0.5))
      .attr("cy", scales.y(currentPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "position");
	  
  window.addEventListener("keydown", keyDownHandler, true);
  var enemyMoveInterval = setInterval(function () {moveEnemies()}, 300); 
  
});