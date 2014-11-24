function present () {
	var pos = gameBoard.pickRandomPosition();
	this.x = pos.x;
	this.y = pos.y;
	this.pickedUp = false;
	this.svgElement = "";
	this.done = 0;


	this.draw = function (){
		this.svgElement = svgContainer
	      .append("g")
	      .append("circle")
	      .attr("cx", scales.x(this.x + 0.5))
	      .attr("cy", scales.y(this.y + 0.5))
	      .attr("r", circleRadius)
	      .attr("class", "goal");
	}

	this.pickedUpAction = function () {
		if(!player.hasPresent) {
			// this.pickedUp = true;
			pickedUpPresents ++;
			player.hasPresent = true;
			this.svgElement.remove();

		} else document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> You can only pick up one present at a time - bring me the present you are currently carrying!';
	}

	this.giveToSanta = function () {
		this.done += 1;

	}



}

