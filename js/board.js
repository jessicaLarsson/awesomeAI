function gameBoard(){
  squareLength = 25;
  circleRadius = 15;
  this.gridSize = { x:25, y:25 };
  this.svgSize = getSvgSize(this.gridSize, squareLength);
  this.board = { grid:[], path:[], wall:[], ice:[] };
  
  svgContainer = d3.select(".display")
                        .append("svg")
                          .attr("width", this.svgSize.width)
                          .attr("height", this.svgSize.height);
  
  var xScale = d3.scale.linear().domain([0,this.gridSize.x]).range([0,this.svgSize.width]);
  var yScale = d3.scale.linear().domain([0,this.gridSize.y]).range([0,this.svgSize.height]);
  scales =  { x:xScale, y:yScale };

  groups = { path:svgContainer.append("g"),
                position:svgContainer.append("g") };

  this.draw = function(){
    drawCells(svgContainer, scales, this.board.path, "path");
    drawWall(svgContainer, scales, this.board.wall, "wall");
    drawCells(svgContainer, scales, this.board.ice, "ice");
  }


  this.pickRandomPosition = function() {
    var path = this.board.path;
    var i = Math.ceil(Math.random() * path.length);
    return path[i];
  }

  this.getScale = function() {
    var xScale = d3.scale.linear().domain([0,this.gridSize.x]).range([0,this.svgSize.width]);
    var yScale = d3.scale.linear().domain([0,this.gridSize.y]).range([0,this.svgSize.height]);
    return { x:xScale, y:yScale };
  }

  function getSvgSize(gridSize, squareLength) {
    var width = gridSize.x * squareLength;
    var height = gridSize.y * squareLength;
    return { width:width, height:height };
  }

  function isBorder(x, y, gridSize) {
    return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
  }

  this.buildBoard = function() {
    for (x = 0; x < this.gridSize.x; x++) {
        this.board.grid[x] = [];
        for (y = 0; y < this.gridSize.y; y++) {
          var type = "path";
          if(Math.random() < 0.005) type = "ice";
          if(isBorder(x, y, this.gridSize)) {
            type = "wall";
          } else {

            if(x==5 && y>7 && y<17)
            {
              type = "wall";
            }
            if((x==19 && y>7 && y<17))
            {
              type = "wall";
            }
            if(y==5 && x>7 && x<17)
            {
              type = "wall";
            }
            if((y==19 && x>7 && x<17))
            {
              type = "wall";
            }   
            if(y < 14 && y > 10 && x < 14 && x > 10)             
            {
              type = "wall";
            }  
        }

        var cell = { x:x, y:y , type:type };
        this.board.grid[x][y] = cell;
        this.board[type].push(cell);
      }
    }
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


      // Define the gradient
    var gradient = svgContainer.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    // Define the gradient colors
    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFFFFF")
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#E5F0F8")
        .attr("stop-opacity", 1);


    var cellAttributes = cells
             .attr("cx", function (d) { return scales.x(d.x+0.5); })
             .attr("cy", function (d) { return scales.y(d.y+0.5); })
             .attr("r", circleRadius)
              .attr('fill', 'url(#gradient)');
  }
}