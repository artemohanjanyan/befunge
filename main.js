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
	" ": {
		file: " "
	},
	"<": {
		file: "<"
	},
	">": {
		file: ">"
	},
	"^": {
		file: "^"
	},
	"v": {
		file: "v"
	},
	"?": {
		file: "question"
	},

	"+": {
		file: "+"
	},
	"-": {
		file: "-"
	},
	"*": {
		file: "*"
	},
	"/": {
		file: "div"
	},
	"%": {
		file: "%"
	},
	"!": {
		file: "!"
	},
	"`": {
		file: "`"
	},

	"_": {
		file: "_"
	},
	"|": {
		file: "|"
	},
	"\"": {
		file: "quote"
	},
	":": {
		file: ":"
	},
	"\\": {
		file: "backslash"
	},
	"$": {
		file: "$"
	},
	".": {
		file: "dot"
	},
	",": {
		file: ","
	},
	"#": {
		file: "hash"
	},

	"g": {
		file: "g"
	},
	"p": {
		file: "p"
	},
	"&": {
		file: "ampersand"
	},
	"~": {
		file: "tilde"
	},
	"@": {
		file: "@"
	},

	"0": {
		file: "0"
	},
	"1": {
		file: "1"
	},
	"2": {
		file: "2"
	},
	"3": {
		file: "3"
	},
	"4": {
		file: "4"
	},
	"5": {
		file: "5"
	},
	"6": {
		file: "6"
	},
	"7": {
		file: "7"
	},
	"8": {
		file: "8"
	},
	"9": {
		file: "9"
	}
}

for (var command in commands) {
	(function(c) {
		console.log(c);
		document.getElementById(c).addEventListener("mousedown", function() {
			console.log(commands[c].file);
			currentCommand = c;
			currentIcon.src = "icons/" + commands[c].file + ".png";
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
