 function enemy (type) {
	this.pos = gameBoard.pickRandomPosition();
	this.type = type;
	this.svgElement = svgContainer.append("image");
	this.circleRadius = 12;

	randomGoal = gameBoard.pickRandomPosition(); //not that nice to do this here, better solution?


	this.draw = function (){
       this.svgElement           
        .attr("x", scales.x(this.pos.x + 0.5) - 15)
        .attr("y", scales.y(this.pos.y + 0.5) - 15)
        .attr("width", 30)
        .attr("height", 30)
        .attr("xlink:href", "images/enemy1.png");
	}

	this.move = function () {

		var distX, distY;

		if(this.type =="enemyAstar") {
			pathStart = {x:this.pos.x, y:this.pos.y};
			pathEnd = {x:player.pos.x, y:player.pos.y};
			// calculate path
			currentPath = findPathAstar(gameBoard,pathStart,pathEnd);
			this.pos = gameBoard.board.grid[currentPath[1][0]][currentPath[1][1]];
			this.draw();


		} else {
	
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
			} 
			this.draw();
		}

	}


	this.removeSVG = function (){
		this.svgElement.remove();
	}

///////////////////////////////////////////////////////////////////
// PATHFINDING WITH THE ASTAR ALGORITHM 
///////////////////////////////////////////////////////////////////

function findPathAstar(board, pathStart, pathEnd)
{
	// shortcuts for speed
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;

	var boardSize =	board.gridSize.x*board.gridSize.y;

	var distanceFunction = ManhattanDistance;
	var findNeighbours = function(){};

	function ManhattanDistance(Point, Goal)
	{	
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	// Neighbours functions, used by findNeighbours function
	// to locate adjacent available cells that aren't blocked
	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < board.gridSize.y && canWalkHere(x, S),
		myE = E < board.gridSize.x && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	function canWalkHere(x, y)
	{
		var p = gameBoard.board.grid[x][y];
		if(p.type =="path") return true;
		return false;
	};

	// Node function, returns a new object with Node properties
	// Used in the calculatePath function to store route costs, etc.
	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the board linear array
			value:Point.x + (Point.y * board.gridSize.x),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};

		return newNode;
	}

	// Path function, executes AStar algorithm operations
	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates //TESTA SKICKA IN PATHSTART
		var	mypathStart = Node(null, {x:pathStart.x, y:pathStart.y});
		var mypathEnd = Node(null, {x:pathEnd.x, y:pathEnd.y});

		// create a long array that will contain all board cells
		var AStar = new Array(boardSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = boardSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the board graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until the Open list is empty
		return result;
	}

	// actually calculate the a-star path!
	// this returns an array of coordinates
	// that is empty if no path is possible
	return calculatePath();

} // end of findPathAstar() function
}
