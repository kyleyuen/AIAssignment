function randomPlay(state)
{
	var blankX = 2;
	var blankY = 2;
	var actions = [];

	for (var i =0; i < 10000; ++i) {
		if (blankX != 0) {
			actions.push("up");
		}
		if (blankX != 2) {
			actions.push("down");
		}
		if (blankY != 0) {
			actions.push("left");
		}
		if (blankY != 2) {
			actions.push("right");
		}

		var index = Math.floor(Math.random() * actions.length);
		var action = actions[index];
		takeAction(action);
		actions = [];
	}

	function takeAction(action)
	{
		switch (action) {
			case 'up':
				moveToUpSide(state, blankX, blankY);
				blankX -= 1;
				break;
			case 'down':
				moveToDownSide(state, blankX, blankY);
				blankX += 1;
				break;
			case 'left':
				moveToLeftSide(state, blankX, blankY);
				blankY -= 1;
				break;
			case 'right':
				moveToRightSide(state, blankX, blankY);
				blankY += 1;
				break;
		}
	}
}

function reachTarget(state) {
	return state.toString() === TARGET_STATE.toString();
}

var steps = 0;
// move blank picture to up side
function moveToUpSide(state, blankX, blankY)
{
	var text = "#" + numberToText[state[blankX - 1][blankY]];
	var action = "+=" + (HEIGHT + REGULAR_PADDING).toString();

	++steps;
	setTimeout(function() {
		$(text).animate({top: action});
	}, ANIMATION_TIME * steps);

	swap(state, blankX, blankY, blankX - 1, blankY);
}

// move blank picture to down side
function moveToDownSide(state, blankX, blankY)
{
	var text = "#" + numberToText[state[blankX + 1][blankY]];
	var action = "-=" + (HEIGHT + REGULAR_PADDING).toString();

	++steps;
	setTimeout(function() {
		$(text).animate({top: action});
	}, ANIMATION_TIME * steps);

	swap(state, blankX, blankY, blankX + 1, blankY);
}

// move blank picture to left side
function moveToLeftSide(state, blankX, blankY)
{
	var text = "#" + numberToText[state[blankX][blankY - 1]];
	var action = "+=" + (WIDTH + REGULAR_PADDING).toString();

	++steps;
	setTimeout(function() {
		$(text).animate({left: action});
	}, ANIMATION_TIME * steps);

	swap(state, blankX, blankY, blankX, blankY - 1);
}

// move blank picture to right side
function moveToRightSide(state, blankX, blankY)
{
	var text = "#" + numberToText[state[blankX][blankY + 1]];
	var action = "-=" + (WIDTH + REGULAR_PADDING).toString();

	++steps;
	setTimeout(function() {
		$(text).animate({left: action});
	}, ANIMATION_TIME * steps);

	swap(state, blankX, blankY, blankX, blankY + 1);
}

function swap(state, x1, y1, x2, y2)
{
	var temp = state[x1][y1];
	state[x1][y1] = state[x2][y2];
	state[x2][y2] = temp;
}