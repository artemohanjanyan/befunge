var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var currentIcon = document.getElementById("current");
var currentCommand = " ";

var maxx = canvas.width, maxy = canvas.height, step = 20;
var maxi = 32, maxj = 24;

function clearScreen() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function circle(x, y, r) {
	context.beginPath();
	context.strokeStyle = "#ffffff";
	context.arc(x, y, r, 0, Math.PI*2);
	context.stroke();
}

function rectangle(x1, y1, x2, y2) {
	context.beginPath();
	context.rect(x1, y1, x2, y2);
	context.strokeStyle = "#000000";
	context.stroke();
}

var board = [];
for (var i = 0; i < 32; ++i) {
	board[i] = [];
	for (var j = 0; j < 24; ++j) {
		board[i][j] = " ";
	}
}

var commands = {
	"<": 1,
	">": 1,
	"^": 1,
	"v": 1,
	" ": 1,
	"0": 1,
	"1": 1,
	"2": 1,
	"3": 1,
	"4": 1,
	"5": 1,
	"6": 1,
	"7": 1,
	"8": 1,
	"9": 1
}

for (var command in commands) {
	(function(c) {
		document.getElementById(command).addEventListener("mousedown", function() {
			console.log(c);
			currentCommand = c;
			currentIcon.src = "icons/" + c + ".png";
		});
	})(command);
}

canvas.addEventListener("mousedown", function(event) {
	var x = event.clientX - canvas.getBoundingClientRect().left;
	var y = event.clientY - canvas.getBoundingClientRect().top;

	var i = Math.floor(x / step);
	var j = Math.floor(y / step);

	board[i][j] = currentCommand;
});

function draw() {
	requestAnimationFrame(draw);

	clearScreen();

	for (var x = 0; x < maxx; x += step) {
		for (var y = 0; y < maxy; y += step) {
			context.beginPath();
			context.rect(x, y, step, step);
			//context.strokeStyle = "#000000";
			context.stroke();
		}
	}

	for (var i = 0; i < maxi; ++i) {
		for (var j = 0; j < maxj; ++j) {
			context.drawImage(document.getElementById(board[i][j]), i * step, j * step, step, step);
		}
	}
}

draw();
