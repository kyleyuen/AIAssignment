// define a move's property, which contains state, blank postion,
// function value and last move node's index
// and operation
function Move(state, blankX, blankY, gValue, hValue, lastMoveIndex, operation)
{
	this.state = state;
	this.blankX = blankX;
	this.blankY = blankY;
	this.gValue = gValue;
	this.hValue = hValue;
	this.lastMoveIndex = lastMoveIndex;
	this.operation = operation;
}

function play(initialState, targetState)
{
	var maxMoves = 4096;
	var targetStateToNumber = stateToNumber(targetState);
	var blankPosition = getPosition(initialState, 9);

	var open = new Array();
	var closed = new Array();
	var reachedStates = new Array();
	var directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	var index = 0;
	var start = new Move(stateToNumber(initialState), blankPosition[0], blankPosition[1],
						 0, heuristicFunction(initialState, targetState), -1, -1);
	open.push(start);

	// run A* algorithm
	while (open.length != 0) {
		// get minimum value node from open list
		var node = getMinimumNode(open);
		// put this node to closed list and delete from open list
		closed.push(node);

		// if reach target state, then braek out loop
		if (closed[index].state == targetStateToNumber) {
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
				if (reachedStates.indexOf(nextState) == -1) {
					reachedStates.push(nextState);
					var node = new Move(nextState, blankX, blankY, 
										closed[index].gValue + 1, 
										heuristicFunction(currentState, targetState), index, i);
					open.push(node);
				}
				swap(currentState, closed[index].blankX, closed[index].blankY, blankX, blankY);
			}
		}

		++index;
		if (index > maxMoves) {
			alert("no solution");
			return false;
		}
	}

	var path = getPath(closed, index);
	movePictureByJQuery(closed, path, 1);
	console.log(path);
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
function heuristicFunction(currentState, targetState)
{
	var result = 0;
	for (var i = 0; i < 3; ++i) {
		for (var j = 0; j < 3; ++j) {
			if (targetState[i][j] == 9) {
				continue;
			}
			var postion = getPosition(currentState, targetState[i][j]);
			var distance = Math.abs(i - postion[0]) + Math.abs(j - postion[1]);
			result = result + distance;
		}
	}
	return result;
}

// get specific number's position in state array
function getPosition(state, number)
{
	for (var i = 0; i < 3; ++i) {
		for (var j = 0; j < 3; ++j) {
			if (state[i][j] == number) {
				return [i, j];
			}
		}
	}
}

// get minimum value node from open list
function getMinimumNode(nodes)
{
	var value = 100000;
	var index = -1;
	for (var i = 0; i < nodes.length; ++i) {
		if (value > nodes[i].gValue + nodes[i].hValue) {
			value = nodes[i].gValue + nodes[i].hValue;
			index = i;
		}
	}

	var result = nodes[index];
	nodes.splice(index, 1);
	return result;
}

// judge given position is valid or not
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

// calculate solution path
function getPath(closed, index)
{
	var path = new Array();
	while (closed[index].lastMoveIndex != -1) {
		path.push(index);
		index = closed[index].lastMoveIndex;
	}
	path.push(index);
	return path.reverse();
}

// use jquery to implement animation effect
function movePictureByJQuery(closed, path, index)
{
	if (index == path.length) {
		return;
	}

	var lastState = numberToState(closed[path[index - 1]].state);
	var id = "#" + numberToText[lastState[closed[path[index]].blankX][closed[path[index]].blankY]];

	var attr;
	var effect;
	switch (closed[path[index]].operation) {
		// up
		case 0:
			attr = "top";
			effect = "+=" + (HEIGHT + REGULAR_PADDING).toString() + "px";
			break;
		// right
		case 1:
			attr = "left";
			effect = "-=" + (WIDTH + REGULAR_PADDING).toString() + "px";
			break;
		// down
		case 2:
			attr = "top";
			effect = "-=" + (HEIGHT + REGULAR_PADDING).toString() + "px";
			break;
		// left
		case 3:
			attr = "left";
			effect = "+=" + (WIDTH + REGULAR_PADDING).toString() + "px";
			break;
	}

	var animation;
	if (attr === "top") {
		animation = $(id).animate({top: effect});
	}
	else if (attr === "left") {
		animation = $(id).animate({left: effect});
	}
	$.when(animation).done(function() {
		movePictureByJQuery(closed, path, index + 1);
	});
}