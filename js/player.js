  function player(){
    this.pos = gameBoard.pickRandomPosition();
    this.direction = {x:0, y:0}
    this.hasPresent = false;
    this.svgElement = svgContainer.append("image");
                        

    this.draw = function() {
      if(this.hasPresent){
        this.svgElement           
        .attr("x", scales.x(this.pos.x + 0.5) - 15)
        .attr("y", scales.y(this.pos.y + 0.5) - 15)
        .attr("width", 30)
        .attr("height", 30)
        .attr("xlink:href", "images/player_with_present.png");
      } else {
        this.svgElement    
        .attr("x", scales.x(this.pos.x + 0.5) - 15)
        .attr("y", scales.y(this.pos.y + 0.5) - 15)
        .attr("width", 30)
        .attr("height", 30)
        .attr("xlink:href", "images/player.png");
      }
    }

}
