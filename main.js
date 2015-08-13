var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var currentIcon = document.getElementById("current");
var currentCommand = " ";

var activeBackground = new Image();
activeBackground.src = "icons/active.png";

var maxx = canvas.width, maxy = canvas.height, step = 20;
var maxi = 32, maxj = 24;

function clearScreen() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

//var board = [];
//for (var i = 0; i < 32; ++i) {
//	board[i] = [];
//	for (var j = 0; j < 24; ++j) {
//		board[i][j] = " ";
//	}
//}

function Board() {
	this.field = [];
	for (var i = 0; i < 32; ++i) {
		this.field[i] = [];
		for (var j = 0; j < 24; ++j) {
			this.field[i][j] = " ";
		}
	}

	this.active = {
		x: 0,
		y: 0
	}
	this.direction = {
		x: 1,
		y: 0
	}
	this.stack = [];

	this.input = "";
	this.output = "";
}
Board.prototype.move = function() {
	this.active.x = (this.active.x + this.direction.x + maxi) % maxi;
	this.active.y = (this.active.y + this.direction.y + maxj) % maxj;
}
Board.prototype.push = function(x) {
	this.stack.push(x);
}
Board.prototype.pop = function() {
	if (this.stack.length > 0) {
		return this.stack.pop()
	} else {
		return 0;
	}
}
Board.prototype.clone = function() {
	var copy = new Board();
	for (var i = 0; i < 32; ++i) {
		copy.field[i] = this.field[i].slice(0);
	}
	return copy;
}

function op(f, argN) {
	return function(board) {
		var args = [];
		for (var i = 0; i < argN; ++i) {
			args.push(board.pop());
		}
		args = args.reverse();
		board.push(f.apply(null, args));
	};
}

function boolToInt(b) {
	if (b) {
		return 1;
	} else {
		return 0;
	}
}

function digitPush(d) {
	return function(board) {
		board.push(d);
	};
}

var commands = {
	" ": {
		file: " ",
		action: function(board) {
		}
	},
	"<": {
		file: "<",
		action: function(board) {
			board.direction = {
				x: -1,
				y: 0
			}
		}
	},
	">": {
		file: ">",
		action: function(board) {
			board.direction = {
				x: 1,
				y: 0
			}
		}
	},
	"^": {
		file: "^",
		action: function(board) {
			board.direction = {
				x: 0,
				y: -1
			}
		}
	},
	"v": {
		file: "v",
		action: function(board) {
			board.direction = {
				x: 0,
				y: 1
			}
		}
	},
	"?": {
		file: "question",
		action: function(board) {
			var rand = Math.floor(Math.random() * 4);
			commands[["<", "^", ">", "v"][rand]].action(board);
		}
	},

	"+": {
		file: "+",
		action: op(function(a, b) { return a + b; }, 2)
	},
	"-": {
		file: "-",
		action: op(function(a, b) { return a - b; }, 2)
	},
	"*": {
		file: "*",
		action: op(function(a, b) { return a * b; }, 2)
	},
	"/": {
		file: "div",
		action: op(function(a, b) { return a / b; }, 2)
	},
	"%": {
		file: "%",
		action: op(function(a, b) { return a % b; }, 2)
	},
	"!": {
		file: "!",
		action: op(function(a) { boolToInt(a == 0); }, 1)
	},
	"`": {
		file: "`",
		action: op(function(a, b) { boolToInt(a > b); }, 2)
	},

	"_": {
		file: "_",
		action: function(board) {
			if (board.pop() != 0) {
				commands["<"].action(board);
			} else {
				commands[">"].action(board);
			}
		}
	},
	"|": {
		file: "|",
		action: function(board) {
			if (board.pop() != 0) {
				commands["^"].action(board);
			} else {
				commands["v"].action(board);
			}
		}
	},
	"\"": {
		file: "quote",
		action: function() {}
	},
	":": {
		file: ":",
		action: function(board) {
			var x = board.pop();
			board.push(x);
			board.push(x);
		}
	},
	"\\": {
		file: "backslash",
		action: function(board) {
			var a = board.pop();
			var b = board.pop();
			board.push(a);
			board.push(b);
		}
	},
	"$": {
		file: "$",
		action: function(board) {
			board.pop();
		}
	},
	".": {
		file: "dot",
		action: function(board) {
			board.output += board.pop();
		}
	},
	",": {
		file: ",",
		action: function(board) {
			board.output += String.fromCharCode(board.pop());
		}
	},
	"#": {
		file: "hash",
		action: function(board) {
			board.move();
		}
	},

	"g": {
		file: "g",
		action: function(board) {
			var y = board.pop();
			var x = board.pop();
			board.push(board.field[x][y].charCodeAt(0));
		}
	},
	"p": {
		file: "p",
		action: function(board) {
			var y = board.pop();
			var x = board.pop();
			var value = board.pop();
			board.field[x][y] = String.fromCharCode(value);
		}
	},
	"&": {
		file: "ampersand",
		action: function(board) {
			//TODO
			if (board.input.length > 0) {
				while (board.input.length > 0 && board.input.charAt(0) == ' ') {
					board.input = board.input.slice(1);
				}

				if (board.input.length == 0) {
					return;
				}

				var x = parseInt(board.input);
				board.push(x);
				board.input = board.input.slice(x.toString().length);
			}
		}
	},
	"~": {
		file: "tilde",
		action: function(board) {
			if (input.length > 0) {
				board.push(board.input.charCodeAt(0));
				board.input = board.input.slice(1);
			}
		}
	},
	"@": {
		file: "@",
		action: function(board) {
			board.direction = {
				x: 0,
				y: 0
			}
		}
	},

	"0": {
		file: "0",
		action: digitPush(0)
	},
	"1": {
		file: "1",
		action: digitPush(1)
	},
	"2": {
		file: "2",
		action: digitPush(2)
	},
	"3": {
		file: "3",
		action: digitPush(3)
	},
	"4": {
		file: "4",
		action: digitPush(4)
	},
	"5": {
		file: "5",
		action: digitPush(5)
	},
	"6": {
		file: "6",
		action: digitPush(6)
	},
	"7": {
		file: "7",
		action: digitPush(7)
	},
	"8": {
		file: "8",
		action: digitPush(8)
	},
	"9": {
		file: "9",
		action: digitPush(9)
	}
}

Board.prototype.go = function() {
	commands[this.field[this.active.x][this.active.y]].action(this);
	this.move();
}

var board = new Board();

for (var command in commands) {
	(function(c) {
		document.getElementById(c).addEventListener("click", function() {
			console.log(commands[c].file);
			currentCommand = c;
			currentIcon.src = "icons/" + commands[c].file + ".png";
		});
	})(command);
}

var delays = [10, 50, 100, 500, 1000];
var intervalId;
var isRunning = false;
var isPaused = false;

canvas.addEventListener("click", function(event) {
	if (isRunning) {
		return;
	}

	var x = event.clientX - canvas.getBoundingClientRect().left;
	var y = event.clientY - canvas.getBoundingClientRect().top;

	var i = Math.floor(x / step);
	var j = Math.floor(y / step);

	board.field[i][j] = currentCommand;
});

document.getElementById("delay").addEventListener("input", function(event) {
	document.getElementById("delayText").innerHTML = delays[event.target.value];

	if (isRunning) {
		window.clearInterval(intervalId);
		intervalId = window.setInterval(go, delays[event.target.value]);
	}
});

function go() {
	board.go();
	document.getElementById("position").innerHTML = "[" + board.active.x + "; " + board.active.y + "]";
}

document.getElementById("start").addEventListener("click", function () {
	document.getElementById("start").disabled = true;
	document.getElementById("pause").disabled = false;
	document.getElementById("stop").disabled = false;

	board = board.clone();
	board.input = document.getElementById("input").value;
	intervalId = window.setInterval(go, delays[document.getElementById("delay").value]);
	isRunning = true;
});

document.getElementById("pause").addEventListener("click", function () {
	if (!isPaused) {
		isPaused = true;
		window.clearInterval(intervalId);
	} else {
		isPaused = false;
		intervalId = window.setInterval(go, delays[document.getElementById("delay").value]);
	}
});

document.getElementById("stop").addEventListener("click", function () {
	document.getElementById("start").disabled = false;
	document.getElementById("pause").disabled = true;
	document.getElementById("stop").disabled = true;

	if (!isPaused) {
		window.clearInterval(intervalId);
	}
	isRunning = false;
	isPaused = false;
});

function draw() {
	requestAnimationFrame(draw);

	clearScreen();

	for (var i = 0; i < maxi; ++i) {
		for (var j = 0; j < maxj; ++j) {
			try {
				if (/*isRunning &&*/ board.active.x == i && board.active.y == j) {
					context.drawImage(activeBackground, i * step, j * step, step, step);
				} else {
					context.drawImage(document.getElementById(" "), i * step, j * step, step, step);
				}

				if (board.field[i][j] in commands) {
					context.drawImage(document.getElementById(board.field[i][j]), i * step, j * step, step, step);
				} else {
					//TODO some pic
				}
			} catch(err) {
				console.log("some error at point [" + i + "; " + j + "]");
			}
		}
	}

	document.getElementById("output").innerHTML = board.output;
	document.getElementById("stack").innerHTML = board.stack;
}
draw();
