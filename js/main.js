var HEIGHT = 200;
var WIDTH = 200;
var REGULAR_PADDING = 20;
var ANIMATION_TIME = 400;
var numberToText = {1:"one", 2:"two", 3:"three",
					4:"four", 5:"five", 6:"six",
					7:"seven", 8:"eight", 9:"blank"};

$(document).ready(function() {
	///*
	var initialState = [[2, 7, 3], [9, 5, 8], [1, 4, 6]];
	var targetState = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
	//*/
	/*
	var initialState = [[8, 9, 3], [2, 1, 4], [7, 6, 5]];
	var targetState = [[1, 2, 3], [8, 9, 4], [7, 6, 5]];
	*/

	// render pictures to page in proper position
	assighToBoard(initialState);
	
	var controlState = 0;
	$("#initialStateButton").click(function() {
		if (controlState != 0) {
			assighToBoard(initialState);
			controlState = 0;
		}
	});
	$("#targetStateButton").click(function() {		
		if (controlState != 1) {
			assighToBoard(targetState);
			controlState = 1;
		}
	});

	$("#autoplayButton").click(function() {
		if (controlState == 0) {
			play(initialState, targetState);
			controlState = 1;
		}
	});
	$("#shuffleButton").click(function() {
		var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		initialState = sliceToChunk(shuffle(numbers), 3);
		targetState = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

		assighToBoard(initialState);
		controlState = 0;
	});
})

function assighToBoard(state)
{
	for (var i = 0; i < state.length; ++i) {
		for (var j = 0; j < state[i].length; ++j) {
			var text = "#" + numberToText[state[i][j]];
			var top = (HEIGHT + REGULAR_PADDING) * i;
			var left = (WIDTH + REGULAR_PADDING) * j;
			$(text).css({"top": top, "left": left});
		}
	}
}