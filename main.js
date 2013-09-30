var HEIGHT = 200;
var WIDTH = 200;
var REGULAR_PADDING = 20;
var ANIMATION_TIME = 400;
var TARGET_STATE = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
var numberToText = {1:"one", 2:"two", 3:"three",
					4:"four", 5:"five", 6:"six",
					7:"seven", 8:"eight", 9:"blank"};

$(document).ready(function() {
	// inital and shuffle state array
	var state = initial();
	// render pictures to page in proper position
	assighToBoard(state, numberToText, WIDTH, HEIGHT, REGULAR_PADDING);

	//console.log(state.toString() === target.toString());
	randomPlay(state);
	//alert("congratulations");
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