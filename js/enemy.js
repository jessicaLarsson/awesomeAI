 function enemy (type) {
	this.pos = gameBoard.pickRandomPosition(board);
	this.type = type;
	this.svgElement = "";
	this.circleRadius = 9;

	randomGoal = gameBoard.pickRandomPosition(); //not that nice to do this here, better solution?


	this.draw = function (){
		scales = gameBoard.getScale();
		this.svgElement = d3.select("svg")
	      .append("g")
	      .append("circle")
	      .attr("cx", scales.x(this.pos.x + 0.5))
	      .attr("cy", scales.y(this.pos.y + 0.5))
	      .attr("r", this.circleRadius)
	      .attr("class", this.type);
	}

	this.move = function () { //enemyRandomNext
		var distX, distY;
		
		if(this.type == "enemyNextDistance"){
			
			distX = (this.pos.x-currentPosition.x);
			distY = (this.pos.y-currentPosition.y);
	
		}else if(this.type == "enemyRandomNext"){
			
			if(this.pos.x == randomGoal.x && this.pos.y == randomGoal.y) {
		        randomGoal = gameBoard.pickRandomPosition();
		    }	    
		    distX = (this.pos.x-randomGoal.x);
		    distY = (this.pos.y-randomGoal.y);

		}else if(this.type == "enemyNextGoal"){
		 	distX = (this.pos.x-(currentPosition.x + playerDirection.x*10));
		    distY = (this.pos.y-(currentPosition.y + playerDirection.y*10));
		    if(distX && distY < 10){
		      distX = (this.pos.x-currentPosition.x);
		      distY = (this.pos.y-currentPosition.y);
		    }
		}

		var nextPos;

		if(distX != 0 || distY != 0){ //inte dela med 0 nedan
		    if(Math.abs(distX) > Math.abs(distY)){    
				var direction = distX/Math.abs(distX);  
				nextPos = board.grid[this.pos.x-direction][this.pos.y];
			}else{
				var direction = distY/Math.abs(distY); 
				nextPos = board.grid[this.pos.x][this.pos.y-direction]; 
			}

			switch(nextPos.type) {
				case "path":
				case "ice":
					this.pos = nextPos;
					break;
	      
	      		case "wall":
		        	// DO something different
				    break;

				default:
	          		throw "Unexpected terrain type "+nextPos.type;

			}
			this.updatePos();
		}

	}

	this.updatePos = function (){
		this.removeSVG();
		this.draw();
	}

	this.removeSVG = function (){
		this.svgElement.remove();
	}
}
