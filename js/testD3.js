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

  function drawMowerHistory(groups, scales, path) {
    groups.path.selectAll(".path").remove();
    var lineFunction = d3.svg.line()
               .x(function(d) { return scales.x(d.x + 0.5); })
               .y(function(d) { return scales.y(d.y + 0.5); })
               .interpolate("linear");

    var lineGraph = groups.path.append("path")
                              .attr("d", lineFunction(path))
                              .attr("class", "path")
                              .attr("fill", "none");

    // position
    var circleData = groups.position.selectAll("circle").data(path);
    circleData.exit().remove();
    var circles = circleData.enter().append("circle");
    var circleAttributes = circles
             .attr("cx", function (d) { return scales.x(d.x + 0.5); })
             .attr("cy", function (d) { return scales.y(d.y + 0.5); })
             .attr("r", function (d) { return circleRadius; })
             .attr("class", "position");
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
        }

  function executeCommands(next) {
      switch(next.type) {
        case "grass":
          currentPosition = next;
          console.log(currentPosition.x + ", " + currentPosition.y);
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
  var ratios = { rock:0.05, lava:0.05 };
  var gridSize = { x:40, y:35 };

  var svgSize = getSvgSize(gridSize, squareLength);
  var map = buildMap(gridSize, ratios);
  var start = pickRandomPosition(map);

  var currentPosition = start;

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




  window.addEventListener("keydown", keyDownHandler, true);
  
});