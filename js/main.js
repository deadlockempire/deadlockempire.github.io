var level = null;

var gameState = {
	// thread state:
	// {
	//	programCounter: [(number of current instruction), (number of current subinstruction)],
	//	expanded: (boolean: is current major instruction expanded)
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

/*
var win = function() {
	showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"!"');
	localStorage.setItem('level_' + window.level.id, "solved");
};
*/

var isThreadBlocked = function(threadId) {
	if (isThreadFinished(threadId)) {
		return false;
	}
	var program = level.threads[threadId].instructions;
	var threadState = gameState.threadState[threadId];
	var currentInstruction = program[threadState.programCounter[0]];
	if (currentInstruction.isBlocking && currentInstruction.isBlocking(threadState, gameState.globalState)) {
		return true;
	}
	if (threadState.expanded) {
		var currentMinor = currentInstruction.minorInstructions[threadState.programCounter[1]];
		if (currentMinor.isBlocking && currentMinor.isBlocking(threadState, gameState.globalState)) {
			return true;
		}
	}
	return false;
};

var areAllThreadsBlocked = function() {
	for (var threadId in level.threads) {
		if (!isThreadBlocked(threadId)) {
			return false;
		}
	}
	return true;
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
		var currentInstruction = instructions[programCounter[0]];
		if (currentInstruction.isCriticalSection) {
			howManyCriticalSections++;
		}
	}
	if (howManyCriticalSections >= 2) {
		win();
		return;
	}

	if (areAllThreadsBlocked()) {
		win();
		return;
	}
};

var isThreadFinished = function(thread) {
	var program = level.threads[thread].instructions;
	var maxInstructions = program.length;
        var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter[0];
	return pc >= maxInstructions;
};

var stepThread = function(thread) {
	var program = level.threads[thread].instructions;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter[0];
	if (!isThreadFinished(thread)) {
		saveForUndo();
		if (threadState.expanded) {
			program[pc].minorInstructions[threadState.programCounter[1]].execute(threadState, gameState.globalState, program);
		} else {
			program[pc].execute(threadState, gameState.globalState, program);
		}
		checkForVictoryConditions();
		redraw();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

var expandThread = function(thread) {
	saveForUndo();
	gameState.threadState[thread].expanded = true;
	redraw();
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
var threadButtons;
var threadContextualButtons;

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

	var globalButtons = $('<div class="global-buttons"></div>');
	mainArea.append(globalButtons);

	var introduction = $('<p></p>');
	introduction.html(level.intro);
	mainArea.append(introduction);

	undoButton = $('<button class="btn btn-info" style="border-top-right-radius: 0; border-bottom-right-radius: 0;"><span class="glyphicon glyphicon-step-backward"></span>&nbsp;Undo</button>');
	undoButton.click(undo);
	undoButton.attr('disabled', true);
	globalButtons.append(undoButton);

	var resetButton = $('<button class="btn btn-warning" style="border-top-left-radius: 0; border-bottom-left-radius: 0;"><span class="glyphicon glyphicon-repeat"></span>&nbsp;Reset level</button>');
	resetButton.click(function() {
		bootbox.confirm('Really reset the level?', function(confirmed) {
			if (confirmed) {
				resetLevel();
			}
		});
	});
	globalButtons.append(resetButton);

	globalButtons.append("&nbsp;&nbsp;");
	var mainMenuButton = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-menu-hamburger"></span>&nbsp;Return to main menu</button>');
	mainMenuButton.click(function() {
		bootbox.confirm('Really give up?', function(confirmed) {
			if (confirmed) {
				returnToMainMenu();
			}
		});
	});
	globalButtons.append(mainMenuButton);

	var sourcesSection = $('<div class="sources"></div>');

	var threadCount = level.threads.length;
	var width = 100.0 / threadCount;

	threadButtons = [];
	threadContextualButtons = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread"></div>');

		var stepButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-play"></span>&nbsp;Step</button>');
		stepButton.data('thread', i);
		stepButton.click(function() {
			stepThread($(this).data('thread'));
		});
		threadArea.append(stepButton);

		var expandButton = $('<button class="btn btn-default"><span class="glyphicon glyphicon-search"></span>&nbsp;Expand</button>');
		expandButton.data('thread', i);
		expandButton.click(function() {
			expandThread($(this).data('thread'));
		});
		threadArea.append(expandButton);

		threadButtons[i] = {
			step: stepButton,
			expand: expandButton
		};

		var contextualButtons = $('<span class="contextual-buttons"></span>');
		threadContextualButtons[i] = contextualButtons;
		threadArea.append(contextualButtons);

		// Possible extra actions go here.

		var source = $('<div class="code"></div>');

		for (var j = 0; j < thread.instructions.length; j++) {
			var instruction = $('<div class="instruction">' + thread.instructions[j].code + '</div>');
			instruction.attr('id', 'instruction-' + i + '-' + j);
			if (thread.instructions[j].tooltip) {
				instruction.attr("title", thread.instructions[j].code + ". \n" + thread.instructions[j].tooltip);
			}
			source.append(instruction);

			if (thread.instructions[j] instanceof ExpandableInstruction) {
				var expansion = $('<div class="expansion" id="instruction-' + i + '-' + j + '-expansion"></div>');

				for (var k = 0; k < thread.instructions[j].minorInstructions.length; k++) {
					var si = $('<div class="instruction">' + thread.instructions[j].minorInstructions[k].code + '</div>');
					si.attr('id', 'instruction-' + i + '-' + j + '-sub' + k);
					// TODO tooltip, refactor
					expansion.append(si);
				}

				instruction.append(expansion);
			}
		}

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
			programCounter: [0, 0],
			id: i,
			expanded: false
		};
	}
	gameState.globalState = {};
	if (level.variables) {
		// HAX
		gameState.globalState = JSON.parse(JSON.stringify(level.variables));
	}

	redraw();
};

var startSelectedLevel = function() {
	startLevel($('#levelSelect').val());
};

var clearProgressAction = function () {
	bootbox.confirm("Are you sure you want to clear all your progress?", function(confirmed) {
		if (confirmed) {
			localStorage.clear();
			returnToMainMenu();
		}
	});
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

