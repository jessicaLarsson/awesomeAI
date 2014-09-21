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
            var rock = Math.random() < ratios.rock;
            var lava = Math.random() < ratios.lava;
            var type = isBorder(x, y, gridSize)?"rock":"grass";
            if(rock) {
              type = "rock";
            }
            if(lava) {
              type = "lava";
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
	enemy
	  .attr("cx", scales.x(enemyPosition.x + 0.5))
      .attr("cy", scales.y(enemyPosition.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemy");
  }
   
  function enemyNextNext(){
		//dist = Math.sqrt(Math.pow((enemyPosition.x-currentPosition.x),2) + Math.pow((enemyPosition.y - currentPosition.y),2)); 
		distX = (enemyPosition.x-currentPosition.x);
		distY = (enemyPosition.y-currentPosition.y);
		var enemyNext;

    console.log("DistX: " + Math.abs(distX) + ", DistY: " + Math.abs(distY));
		
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
        enemyPosition = enemyNext;
        drawEnemyDirection(enemyPosition);
        break;
      
      case "rock":
        enemyNext = map.grid[enemyPosition.x-1][enemyPosition.y+1]; // DO something different
        drawEnemyDirection(enemyPosition);
		    break;

		}
    checkGameOver();
  }
   
  function inGoal (){
    var goalDist = Math.abs(goalPosition.x-currentPosition.x) + Math.abs(goalPosition.y-currentPosition.y);
    if (goalDist == 0){
    	console.log("HURRAAAY!")
    }
  }

  function checkGameOver(){
    var enemyDist = Math.abs(enemyPosition.x-currentPosition.x) + Math.abs(enemyPosition.y-currentPosition.y);
    if(enemyDist == 0){
      clearInterval(enemyMoveInterval);
      console.log("GAME OVER LOSER!!");
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

  var squareLength = 18;
  var circleRadius = 8;
  var ratios = { rock:0.00, lava:0.00 };
  // var ratios = { rock:0.05, lava:0.05 }; 
  var gridSize = { x:40, y:35 };
  var time = 0;

  var svgSize = getSvgSize(gridSize, squareLength);
  var map = buildMap(gridSize, ratios);
  
  var start = pickRandomPosition(map);
  var enemyStart = pickRandomPosition(map);
  var goal = pickRandomPosition(map);

  var currentPosition = start;
  var enemyPosition = enemyStart;
  var goalPosition = goal;
  

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

  var player = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(start.x + 0.5))
      .attr("cy", scales.y(start.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "position");
	  
	var enemy = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(enemyStart.x + 0.5))
      .attr("cy", scales.y(enemyStart.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "enemy");
	  
	  var goal = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(goal.x + 0.5))
      .attr("cy", scales.y(goal.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "goal");


  window.addEventListener("keydown", keyDownHandler, true);
  var enemyMoveInterval = setInterval(function () {enemyNextNext()}, 300); 
  
});