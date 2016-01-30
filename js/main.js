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

var checkForVictoryConditions = function() {
    var howManyCriticalSections = 0;
    for (var threadId in level.threads) {
	    if (isThreadFinished(threadId)) {
		    continue;
	    }
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

var isThreadFinished = function(thread) {
	var program = level.threads[thread].instructions;
	var maxInstructions = program.length;
        var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	return pc >= maxInstructions;
};

var stepThread = function(thread) {
	var program = level.threads[thread].instructions;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	if (!isThreadFinished(thread)) {
		saveForUndo();
		program[pc].execute(threadState, gameState.globalState, program);
		checkForVictoryConditions();
		redraw();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

var getThreadCount = function() {
	return level.threads.length;
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
var threadStepButtons;

var startLevel = function(levelName) {
	level = levels[levelName];
	localStorage.setItem("lastLevel", levelName);
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

	threadStepButtons = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread"></div>');

		var stepButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-play"></span>&nbsp;Step</button>');
		stepButton.data('thread', i);
		stepButton.click(function() {
			stepThread($(this).data('thread'));
		});
		threadStepButtons[i] = stepButton;
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
	if (level.variables) {
		gameState.globalState = level.variables;
	}

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
	$('button#goToMain').click(function() {
		localStorage.removeItem("lastLevel");
		returnToMainMenu();
	});
	$('#clearProgress').click(clearProgressAction);
	$('#alertHide').click(function () {
		console.log("hiding");
		$('#alert').hide();
	});
	var select = $("#levelSelect");
	$.each(levels,function(key, value)
	{
		select.append('<option value=' + key + '>' + value.name + '</option>');
		$.each(value.threads, function(key2, thread)
		{
			var indent = 0;
			for (var instructionName in thread.instructions) {
				var instruction = thread.instructions[instructionName];
				if (instruction instanceof  ElseInstruction ||
					instruction instanceof EndWhileInstruction) {
					indent--;
				}
				for (var i = 0; i < indent; i++) {
					instruction.code = "  " + instruction.code;
				}
				if (instruction instanceof IfInstruction ||
					instruction instanceof WhileInstruction) {
					indent++;
				}
			}
		});
	});


});

$(function() {
	if (localStorage.getItem("lastLevel") && levels[localStorage.getItem("lastLevel")]) {

		startLevel(localStorage.getItem("lastLevel"));
	} else {
		returnToMainMenu();
	}
});

