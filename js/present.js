function present () {
	var pos = game.pickRandomPosition(board);
	this.x = pos.x;
	this.y = pos.y;
	this.pickedUp = false;
	this.svgElement = svgContainer;
	this.done = 0;


	this.drawPresent = function (){
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
		this.pickedUp = true;
		playerHasPresent = true;
		console.log("whahaha ");
		this.svgElement.remove();
		//gör nåt med gubben, typ ändra färg 
	}

	this.giveToSanta = function () {
		this.done += 1;

	}



}

