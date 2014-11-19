function gameBoard(){
  squareLength = 18;
  circleRadius = 9;
  this.gridSize = { x:40, y:35 };
  this.svgSize = getSvgSize(this.gridSize, squareLength);
  board = buildboard(this.gridSize);
  
  svgContainer = d3.select(".display")
                        .append("svg")
                          .attr("width", this.svgSize.width)
                          .attr("height", this.svgSize.height);
  
      var xScale = d3.scale.linear().domain([0,this.gridSize.x]).range([0,this.svgSize.width]);
    var yScale = d3.scale.linear().domain([0,this.gridSize.y]).range([0,this.svgSize.height]);
    scales =  { x:xScale, y:yScale };
  drawCells(svgContainer, scales, board.path, "path");
  drawWall(svgContainer, scales, board.wall, "wall");
  drawCells(svgContainer, scales, board.ice, "ice");

  groups = { path:svgContainer.append("g"),
                position:svgContainer.append("g") };


  this.pickRandomPosition = function() {
    var path = board.path;
    var i = Math.ceil(Math.random() * path.length);
    return path[i];
  }

  function getSvgSize(gridSize, squareLength) {
    var width = gridSize.x * squareLength;
    var height = gridSize.y * squareLength;
    return { width:width, height:height };
  }

  function isBorder(x, y, gridSize) {
    return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
  }

  function buildboard(gridSize) {
    var board = { grid:[], path:[], wall:[], ice:[] };
    for (x = 0; x < gridSize.x; x++) {
        board.grid[x] = [];
        for (y = 0; y < gridSize.y; y++) {
          var type = "path";
          if(isBorder(x, y, gridSize)) {
            type = "wall";
          } else {

            if(x==9 && y>10 && y<25)
            {
              type = "wall";
            }
            if((x==30 && y>10 && y<25))
            {
              type = "wall";
            }
            if(y==6 && x>9 && x<30)
            {
              type = "wall";
            }
            if((y==28 && x>9 && x<30))
            {
              type = "wall";
            }
                  
            if(x>17 && x<22 && y>15 && y<19) {
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

   this.getScale = function() {
    var xScale = d3.scale.linear().domain([0,this.gridSize.x]).range([0,this.svgSize.width]);
    var yScale = d3.scale.linear().domain([0,this.gridSize.y]).range([0,this.svgSize.height]);
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
}