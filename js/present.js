function present () {
	var pos = gameBoard.pickRandomPosition();
	this.x = pos.x;
	this.y = pos.y;
	this.pickedUp = false;
	this.svgElement = "";
	this.done = 0;


	/*this.draw = function (){
		this.svgElement = svgContainer
	      .append("g")
	      .append("circle")
	      .attr("cx", scales.x(this.x + 0.5))
	      .attr("cy", scales.y(this.y + 0.5))
	      .attr("r", circleRadius)
	      .attr("class", "goal");
	}*/

	this.draw = function (){
		this.svgElement = svgContainer
	      .append("image")
	      .attr("x", scales.x(this.x))
	      .attr("y", scales.y(this.y))
	      .attr("width", 25)
	      .attr("height", 25)
	      .attr("xlink:href", "images/present.png");
	}

	this.pickedUpAction = function () {
		if(!player.hasPresent) {
			this.pickedUp = true;
			pickedUpPresents ++;
			player.hasPresent = true;
			this.svgElement.remove();

		} else document.getElementById('santasResponse').innerHTML = 'You can only pick up one present at a time!';
	}

	this.giveToSanta = function () {
		this.done += 1;

	}



}

