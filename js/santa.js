function santa(){
    // this.pos = gameBoard.pickRandomPosition();
    this.pos = {x:23, y:22};
    this.svgElement = "";

  this.draw = function(){
  	this.svgElement = svgContainer
      .append("g")
      .append("circle")
      .attr("cx", scales.x(this.pos.x + 0.5))
      .attr("cy", scales.y(this.pos.y + 0.5))
      .attr("r", circleRadius)
      .attr("class", "santa");
	}
}