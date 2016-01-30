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
	// keyed by variable name
	// value is {
	//	'type': (typ),
	//	'name': (jmeno),
	//	'value': (value, JS primitive),
	//	'lastLockedByThread': (ID of last thread that locked the
	//		variable, or null),
	//	'lockCount': (lock count, 0 if none)
	// }
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

var assign = function(variable, type, value) {
	// TODO: type checking?
	gameState.globalState[variable] = {
		type: type,
		name: variable,
		value: value,
		lastLockedByThread: null,
		lockCount: 0
	};
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

var checkForVictoryConditions = function() {
    var howManyCriticalSections = 0;
    for (var threadId in level.threads) {
        var thread = level.threads[threadId];
        var instructions = thread.instructions;
        var threadState = gameState.threadState[threadId];
        var programCounter = threadState.programCounter;
        var currentInstruction = instructions[programCounter];
        if (currentInstruction.isCriticalSection) {
            howManyCriticalSections++;
        }
    }
    if (howManyCriticalSections >= 2) {
        showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"!"');
		localStorage.setItem('level_' + window.level.id, "solved");
    }
};

var stepThread = function(thread) {
	var program = level.threads[thread].instructions;
	var maxInstructions = program.length;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	if (pc < maxInstructions) {
		saveForUndo();
		program[pc].execute(threadState, gameState.globalState, program);
		checkForVictoryConditions();
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

var resetLevel = function() {
	startLevel(window.levelName);
};

var undoButton;

var startLevel = function(levelName) {
	level = levels[levelName];
	var mainArea = $('#mainarea');
	mainArea.html("");
	window.level = level;
	window.levelName = levelName;

	var title = $('<h1></h1>');
	title.text(level.name);
	mainArea.append(title);

	var introduction = $('<p></p>');
	introduction.html(level.intro);
	mainArea.append(introduction);

	var globalButtons = $('<div class="global-buttons"></div>');
	mainArea.append(globalButtons);

	undoButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-step-backward"></span>&nbsp;Undo</button>');
	undoButton.click(undo);
	undoButton.attr('disabled', true);
	globalButtons.append(undoButton);

	var resetButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-repeat"></span>&nbsp;Reset level</button>');
	resetButton.click(function() {
		if (confirm('Really reset the level?')) {
			resetLevel();
		}
	});
	globalButtons.append(resetButton);

	var sourcesSection = $('<div class="sources"></div>');

	var threadCount = level.threads.length;
	var width = 100.0 / threadCount;
	var threadInstructions = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread"></div>');
		var stepButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-play"></span>&nbsp;Step</button>');
		stepButton.data('thread', i);
		stepButton.click(function() {
			stepThread($(this).data('thread'));
		});
		threadArea.append(stepButton);

		// Possible extra actions go here.

		var source = $('<div class="code"></div>');

		var instructions = [];
		for (var j = 0; j < thread.instructions.length; j++) {
			var instruction = $('<div class="instruction">' + thread.instructions[j].code + '</div>');
			if (thread.instructions[j].tooltip) {
				instruction.attr("title", thread.instructions[j].code + ". \n" + thread.instructions[j].tooltip);
			}
			instructions[j] = instruction;
			source.append(instruction);
		}
		threadInstructions[i] = instructions;

		threadArea.append(source);
		threadArea.css({width: width + "%"});
		sourcesSection.append(threadArea);
	}

	mainArea.append(sourcesSection);
	mainArea.append('<div class="clearboth"></div>');

	mainArea.append('<div class="global-state"></div>');

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
	startLevel($('#levelSelect').val());
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
	$('#alertHide').click(function () {
		console.log("hiding");
		$('#alert').hide();
	});
});

$(function() {
	returnToMainMenu();
});
