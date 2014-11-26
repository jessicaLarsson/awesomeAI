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
		      distX = (this.pos.x-player.pos.x);
		      distY = (this.pos.y-player.pos.y);
		    }
		}

		var nextPos;

		//this needs refactoring
		if(distX != 0 || distY != 0){
			var directionX = 0;
			var directionY = 0;
		    if(Math.abs(distX) > Math.abs(distY)){    
				directionX = distX/Math.abs(distX);  
			}else{
				directionY = distY/Math.abs(distY);
			}
			
			nextPos = gameBoard.board.grid[this.pos.x-directionX][this.pos.y-directionY]; 

			if(nextPos.type == "wall"){
				if (directionX == 0){
					directionX = 1;//distX/Math.abs(distX);  
					directionY = 0;
				}else{
					directionY = 1;//distY/Math.abs(distY);
					directionX = 0;
				}
			}

			nextPos = gameBoard.board.grid[this.pos.x-directionX][this.pos.y-directionY]; 

			switch(nextPos.type) {
				case "path":
				case "ice":
					this.pos = nextPos;
					break;
	      
	      		case "wall":
		        	if(this.type == "enemyRandomMovement"){
		        		randomGoal = gameBoard.pickRandomPosition();
		        	}
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
