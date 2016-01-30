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
		localStorage.setItem('level_' + window.level.id, "solved");
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
	this.execute = function(threadState, globalState) {
		if (test(threadState, globalState)) {
			threadState.programCounter++;  // goto true branch
		} else {
			// false -> find matching Else
			var i;
			console.log(threadState);
			console.log(threadState.instructions);
			for (i = 0; i < threadState.instructions.length; i++) {
				var instruction = threadState.instructions[i];
				console.log(instruction);
				if ((instruction instanceof ElseInstruction) && instruction.name == name) {
					break;
				}
			}
			console.assert(i < threadState.instructions.length);
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
	threadInstructions: null,

	// thread state:
	// {
	//	programCounter: (number of current instruction),
	//	variables: {
	//		'variableName': (value)
	//	},
	//	program: (instructions)
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

var stepThread = function(thread) {
	var maxInstructions = level.threads[thread].instructions.length;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	if (pc < maxInstructions) {
		level.threads[thread].instructions[pc].execute(threadState, gameState.globalState);
		updateProgramCounters();
		updateGlobalVariables();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

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
	mainArea.append('<div class="clearboth"></div>');
	mainArea.append(sourcesSection);

	var threadStates = [];
	for (var i = 0; i < threadCount; i++) {
		threadStates[i] = {
			programCounter: 0,
			variables: {},
			instructions: level.threads[i].instructions
		};
	}
	gameState.threadState = threadStates;
	gameState.threadInstructions = threadInstructions;
	gameState.globalState = {};

	updateProgramCounters();
	updateGlobalVariables();
}

var startSelectedLevel = function() {
	level = levels[$('#levelSelect').val()];
	startLevel(level);
};

var clearProgressAction = function () {
    localStorage.clear();
    if (confirm("Progress has been cleared. Do you want to return to the main menu and refresh?")) {
        returnToMainMenu();
    }
};

$(function() {
	$('button#start').click(startSelectedLevel);
    $('button#goToMain').click(returnToMainMenu);
    $('#clearProgress').click(clearProgressAction);
});

$(function() {
    returnToMainMenu();
});
