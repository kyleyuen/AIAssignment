function randomPlay(state)
{
	var blankX = 2;
	var blankY = 2;

	var step = 0;
	takeAction("img", "top", "+=0px");

	function takeAction(id, attr, effect)
	{
		++step;
		console.log(step);
		//console.log(id + attr + effect);
		if (attr === "top") {
			$(id).animate({top: effect}, callback);
		}
		else if (attr === "left") {
			$(id).animate({left: effect}, callback);
		}

		function callback()
		{
			var result = calculateNextAction();
			takeAction(result[0], result[1], result[2]);
		}
	}

	function calculateNextAction()
	{
		var actions = [];

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
		return analysisAction(action);
	}

	function analysisAction(action)
	{
		var id;
		var attr;
		var effect;
		switch (action) {
			case "up":
				id = "#" + numberToText[state[blankX-1][blankY]];
				attr = "top";
				effect = "+=" + (HEIGHT + REGULAR_PADDING).toString() + "px";

				swap(state, blankX, blankY, blankX-1, blankY);
				--blankX;
				break;

			case "down":
				id = "#" + numberToText[state[blankX+1][blankY]];
				attr = "top";
				effect = "-=" + (HEIGHT + REGULAR_PADDING).toString() + "px";

				swap(state, blankX, blankY, blankX+1, blankY);
				++blankX;
				break;

			case "left":
				id = "#" + numberToText[state[blankX][blankY-1]];
				attr = "left";
				effect = "+=" + (WIDTH + REGULAR_PADDING).toString() + "px";

				swap(state, blankX, blankY, blankX, blankY-1);
				--blankY;
				break;

			case "right":
				id = "#" + numberToText[state[blankX][blankY+1]];
				attr = "left";
				effect = "-=" + (WIDTH + REGULAR_PADDING).toString() + "px";

				swap(state, blankX, blankY, blankX, blankY+1);
				++blankY;
				break;
		}
		return [id, attr, effect];
	}
}

function swap(state, x1, y1, x2, y2)
{
	var temp = state[x1][y1];
	state[x1][y1] = state[x2][y2];
	state[x2][y2] = temp;
}