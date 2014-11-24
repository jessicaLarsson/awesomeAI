  function player(){
    this.pos = gameBoard.pickRandomPosition();
    this.direction = {x:0, y:0}
    this.hasPresent = false;
    this.svgElement = svgContainer
                        .append("g")
                        .append("circle")

    this.draw = function() {
      if(this.hasPresent){
        this.svgElement    
          .attr("cx", scales.x(this.pos.x + 0.5))
          .attr("cy", scales.y(this.pos.y + 0.5))
          .attr("r", circleRadius)
          .attr("class", "gotPresent");
      } else {
        this.svgElement    
          .attr("cx", scales.x(this.pos.x + 0.5))
          .attr("cy", scales.y(this.pos.y + 0.5))
          .attr("r", circleRadius)
          .attr("class", "player");
      }
    }

}