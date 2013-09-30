// define a move's property, which contains state, blank postion,
// function value and last move node's index
function Move(state, blankX, blankY, gValue, hValue, lastMove)
{
	this.state = state;
	this.blankX = blankX;
	this.blankY = blankY;
	this.gValue = gValue;
	this.hValue = hValue;
	this.lastMove = lastMove;
}

function play(state)
{
	//var maxMoves = 10000;
	var open = new Array();
	var closed = new Array();
	var states = new Array();
	var directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	var index = 0;
	var start = new Move(stateToNumber(state), 2, 2, 0, heuristicFunction(state), -1);
	open.push(start);

	// run A* algorithm
	while (open.length != 0) {
		// get minimum value node from open list
		var nodeIndex = minimumNodeIndex(open);
		// put this node to closed list and delete from open list
		closed.push(open[nodeIndex]);
		open.splice(nodeIndex, 1);

		// if reach target state, then braek out loop
		if (closed[index].state == 123456789) {
			break;
		}

		// try to move blank block to four directions
		for (var i = 0; i < directions.length; ++i) {
			var currentState = numberToState(closed[index].state);
			var blankX = closed[index].blankX + directions[i][0];
			var blankY = closed[index].blankY + directions[i][1];

			// if it is a valid move and not reached before, then put that move to open list
			if (isValidMove(blankX, blankY)) {
				swap(currentState, closed[index].blankX, closed[index].blankY, blankX, blankY);
				var nextState = stateToNumber(currentState);
				if (states.indexOf(nextState) == -1) {
					states.push(nextState);
					var node = new Move(nextState, blankX, blankY, 
						closed[index].gValue + 1, heuristicFunction(state), index);
					open.push(node);
				}
				swap(currentState, closed[index].blankX, closed[index].blankY, blankX, blankY);
			}
		}

		++index;
		if (index > 1024) {
			console.log("no solution");
			break;
		}
	}
	printPath(index - 1);

	function printPath(index)
	{
		if (index == 0) {
			console.log(closed[index].state);
			return;
		}
		printPath(closed[index].lastMove);
		console.log(closed[index].state);
	}
}

// translate state array to number, try to save memory
function stateToNumber(state)
{
	var result = 0
	for (var i = 0; i < 3; ++i) {
		for (var j = 0; j < 3; ++j) {
			result = result * 10 + state[i][j];
		}
	}
	return result;
}


// translate number to state array
function numberToState(number)
{
	var result = new Array();
	for (var i = 0; i < 3; ++i) {
		temp = new Array();
		for (var j = 0; j < 3; ++j) {
			temp.push(parseInt(number.toString()[i*3+j]));
		}
		result.push(temp);
	}
	return result;
}

// calculate current state number's distance to target state
function heuristicFunction(state)
{
	var result = 0;
	for (var i = 0; i < 3; ++i) {
		for (var j = 0; j < 3; ++j) {
			var distance = Math.abs(i - Math.floor((state[i][j] - 1)/3)) +
							Math.abs(j - Math.floor((state[i][j] - 1)%3));
			result = result + distance;
		}
	}
	return result;
}

function minimumNodeIndex(nodes)
{
	var value = 100000;
	var index = -1;
	for (var i = 0; i < nodes.length; ++i) {
		if (value > nodes[i].gValue + nodes[i].hValue) {
			value = nodes[i].gValue + nodes[i].hValue;
			index = i;
		}
	}
	return index;
}

function isValidMove(blankX, blankY)
{
	if (blankX < 0 || blankX > 2) {
		return false;
	}
	if (blankY < 0 || blankY > 2) {
		return false;
	}
	return true;
}

function swap(state, x1, y1, x2, y2)
{
	var temp = state[x1][y1];
	state[x1][y1] = state[x2][y2];
	state[x2][y2] = temp;
}


//--------------------------------------------
$(document).ready(function() {
	var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	shuffle(numbers);
	numbers = sliceToChunk(numbers, 3);
	play(numbers);
});

function shuffle(numbers)
{
	if (numbers.length == 0) {
		return
	}

	var i = numbers.length - 1;
	while (--i) {
		var j = Math.floor(Math.random()*i);
		var temp = numbers[i];
		numbers[i] = numbers[j];
		numbers[j] = temp;
	}
}

function sliceToChunk(numbers, chunk)
{
	var length = Math.floor((numbers.length - 1) / chunk);
	var result = new Array(length);

	var start = 0;
	for (var i = 0; i <= length; ++i) {
		result[i] = numbers.slice(start, start + chunk);
		start = start + chunk;
	}
	return result;
}