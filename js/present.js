function present () {
	var pos = game.pickRandomPosition(board);
	this.x = pos.x;
	this.y = pos.y;
	this.pickedUp = false;
	this.svgElement = svgContainer;


	this.drawPresent = function (){
		this.svgElement = svgContainer
	      .append("g")
	      .append("circle")
	      .attr("cx", scales.x(this.x + 0.5))
	      .attr("cy", scales.y(this.y + 0.5))
	      .attr("r", circleRadius)
	      .attr("class", "goal");
	}

	this.pickedUpAction = function () {
		this.pickedUp = true;
		console.log("whahaha ");
		this.svgElement.remove();
		//gör nåt med gubben, typ ändra färg 
	}



}

