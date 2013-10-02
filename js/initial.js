function initial()
{
	// shuffle numbers 1 to 9, 9 represents blank
	var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	shuffle(numbers);

	// transfer 1*9 numbers to 3*3 state
	return sliceToChunk(numbers, 3);
}

// use Fisher Yates algorithm to shuffle numbers
function shuffle(numbers)
{
	if (numbers.length == 0) {
		return;
	}

	var i = numbers.length;
	while (--i) {
		var j = Math.floor(Math.random()* (i+1));
		var temp = numbers[i];
		numbers[i] = numbers[j];
		numbers[j] = temp;
	}
	return numbers;
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