function present () {
	var pos = gameBoard.pickRandomPosition();
	this.x = pos.x;
	this.y = pos.y;
	this.pickedUp = false;
	this.svgElement = svgContainer;
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


	// this.drawPresent = function (){
	// 	console.log("i drawPresent");
	// 	this.svgElement = svgContainer
	      
	//       .append("object")
	//       .attr("data", "../images/present_red.svg")
	//       .attr("width", 10)
	//       .attr("height", 10)
	//       .attr("type", "image/svg+xml");
	// }

	this.pickedUpAction = function () {
		if(!playerHasPresent) {
			// this.pickedUp = true;
			pickedUpPresents ++;
			playerHasPresent = true;
			this.svgElement.remove();

		} else document.getElementById('santasResponse').innerHTML = '<br><b>Santa: </b> You can only pick up one present at a time - bring me the present you are currently carrying!';
	}

	this.giveToSanta = function () {
		this.done += 1;

	}



}

