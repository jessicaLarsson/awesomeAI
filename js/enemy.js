 function enemy (type) {
	this.pos = gameBoard.pickRandomPosition();
	this.type = type;
	this.svgElement = "";
	this.circleRadius = 12;

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

	this.move = function () {
		var distX, distY;
		
		if(this.type == "enemyClosestDistance"){
			
			distX = (this.pos.x-player.pos.x);
			distY = (this.pos.y-player.pos.y);
	
		}else if(this.type == "enemyRandomMovement"){
			
			if(this.pos.x == randomGoal.x && this.pos.y == randomGoal.y) {
		        randomGoal = gameBoard.pickRandomPosition();
		    }	    
		    distX = (this.pos.x-randomGoal.x);
		    distY = (this.pos.y-randomGoal.y);

		}else if(this.type == "enemyPlayerDirection"){
		 	distX = (this.pos.x-(player.pos.x + player.direction.x*10));
		    distY = (this.pos.y-(player.pos.y + player.direction.y*10));
		    if(distX && distY < 10){
		      distX = (this.pos.x-plsyer.pos.x);
		      distY = (this.pos.y-player.pos.y);
		    }
		}

		var nextPos;

		if(distX != 0 || distY != 0){ //inte dela med 0 nedan
		    if(Math.abs(distX) > Math.abs(distY)){    
				var direction = distX/Math.abs(distX);  
				nextPos = gameBoard.board.grid[this.pos.x-direction][this.pos.y];
			}else{
				var direction = distY/Math.abs(distY); 
				nextPos = gameBoard.board.grid[this.pos.x][this.pos.y-direction]; 
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
