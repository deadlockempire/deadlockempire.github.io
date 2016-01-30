// constructor
var Instruction = function(code) {
	this.code = code;
	this.execute = function(threadState, globalState) {
		threadState.programCounter++;
	};
};

var WinningInstruction = function(code) {
	this.code = code;
	this.execute = function(threadState, globalState) {
		alert("you win");
	};
};

var AssignInstruction = function(code, variable, value) {
	this.code = code;
	this.variable = variable;
	this.execute = function(threadState, globalState) {
		globalState[variable] = value;
		threadState.programCounter++;
	};
};

var IfInstruction = function(code, test, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState, globalState, threadProgram) {
		if (test(threadState, globalState)) {
			threadState.programCounter++;  // goto true branch
		} else {
			// false -> find matching Else
			var i;
			for (i = 0; i < threadProgram.length; i++) {
				var instruction = threadProgram[i];
				console.log(instruction);
				if ((instruction instanceof ElseInstruction) && instruction.name == name) {
					break;
				}
			}
			console.assert(i < threadProgram.length);
			threadState.programCounter = i;
		}
	};
};

var ElseInstruction = function(code, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState) { threadState.programCounter++; };
};

var level = null;

var gameState = {
	// Unchanging between states:
	// [threadId][instructionId] divs of instructions
	threadInstructions: null,

	// Changing between states:

	// thread state:
	// {
	//	programCounter: (number of current instruction),
	//	variables: {
	//		'variableName': (value)
	//	}
	// }
	threadState: null,

	// global variables
	globalState: null
};

var updateProgramCounters = function() {
	var threadCount = level.threads.length;
	$('.instruction').each(function() {
		$(this).removeClass('current-instruction');
	});
	// update program counters
	for (var i = 0; i < threadCount; i++) {
		var threadState = gameState.threadState[i];
		var pc = threadState.programCounter;

		if (pc < gameState.threadInstructions[i].length) {
			$(gameState.threadInstructions[i][pc]).addClass('current-instruction');
		}
	}
};

var updateGlobalVariables = function() {
	var area = $('.global-state');
	var text = "";
	for (var key in gameState.globalState) {
		text += key + "=" + gameState.globalState[key] + "; ";
	}
	area.html(text);
};

var redraw = function() {
	updateProgramCounters();
	updateGlobalVariables();
	undoButton.attr('disabled', undoHistory.length == 0);
};

var stepThread = function(thread) {
	var program = level.threads[thread].instructions;
	var maxInstructions = program.length;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	if (pc < maxInstructions) {
		saveForUndo();
		program[pc].execute(threadState, gameState.globalState, program);
		redraw();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

var undoHistory = [];

var saveForUndo = function() {
	var state = {
		threadState: gameState.threadState,
		globalState: gameState.globalState
	};
	undoHistory.push(JSON.stringify(state));
};

var undo = function() {
	var last = JSON.parse(undoHistory.pop());
	console.log(last);
	gameState.threadState = last.threadState;
	gameState.globalState = last.globalState;
	redraw();
};

var undoButton;

var startLevel = function(level) {
	var mainArea = $('#mainarea');
	mainArea.html("");
	window.level = level;
	var sourcesSection = $('<div class="sources"></div>');

	var threadCount = level.threads.length;
	var width = 100.0 / threadCount;
	var threadInstructions = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread">thread ' + i + '</div>');
		var stepButton = $('<button>Step</button>');
		stepButton.data('thread', i);
		stepButton.click(function() {
			stepThread($(this).data('thread'));
		});
		threadArea.append(stepButton);
		var source = $('<div class="code"></div>');

		var instructions = [];
		for (var j = 0; j < thread.instructions.length; j++) {
			var instruction = $('<div class="instruction">' + thread.instructions[j].code + '</div>');
			instructions[j] = instruction;
			source.append(instruction);
		}
		threadInstructions[i] = instructions;

		threadArea.append(source);
		threadArea.css({width: width + "%"});
		sourcesSection.append(threadArea);
	}

	mainArea.append('<div class="global-state"></div>');

	undoButton = $('<button>Undo</button>');
	undoButton.click(undo);
	undoButton.attr('disabled', true);
	mainArea.append(undoButton);

	mainArea.append('<div class="clearboth"></div>');
	mainArea.append(sourcesSection);

	gameState.threadState = [];
	for (var i = 0; i < threadCount; i++) {
		gameState.threadState[i] = {
			programCounter: 0,
			variables: {},
		};
	}
	gameState.threadInstructions = threadInstructions;
	gameState.globalState = {};

	redraw();
};

var startSelectedLevel = function() {
	level = levels[$('#levelSelect').val()];
	startLevel(level);
};

var clearProgressAction = function () {
	localStorage.clear();
};

$(function() {
	$('button#start').click(startSelectedLevel);
	$('button#goToMain').click(returnToMainMenu);
	$('#clearProgress').click(clearProgressAction);
});

$(function() {
	returnToMainMenu();
});
