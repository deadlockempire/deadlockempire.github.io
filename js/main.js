/**
 * @return {bool|string} false if nothing is blocked, string if blocked with a
 *                       reason, true if blocked without a given reason.
 *
 * TODO(prvak): The naming is getting a bit weird now that we return block reasons.
 */
var isThreadBlocked = function(threadId) {
	if (isThreadFinished(threadId)) {
		return false;
	}
	var program = gameState.getProgramOfThread(threadId);
	var threadState = gameState.threadState[threadId];
	var currentInstruction = program[threadState.programCounter[0]];
	if (currentInstruction.isBlocking) {
		var result = currentInstruction.isBlocking(threadState, gameState.globalState);
		if (result) {
			return result;
		}
	}
	if (threadState.expanded) {
		var currentMinor = currentInstruction.minorInstructions[threadState.programCounter[1]];
		if (currentMinor.isBlocking) {
			var result = currentMinor.isBlocking(threadState, gameState.globalState);
			if (result) {
				return result;
			}
		}
	}
	return false;
};

var areAllThreadsBlocked = function() {
	for (var threadId in gameState.getLevel().threads) {
		if (!isThreadBlocked(threadId)) {
			return false;
		}
	}
	return true;
};

var areAllThreadsFinished = function() {
	for (var threadId in gameState.getLevel().threads) {
		if (!isThreadFinished(threadId)) {
			return false;
		}
	}
	return true;
};

var checkForVictoryConditions = function() {
	var howManyCriticalSections = 0;
	for (var threadId in gameState.getLevel().threads) {
		if (isThreadFinished(threadId)) {
			continue;
		}
		var thread = gameState.getLevel().threads[threadId];
		var instructions = thread.instructions;
		var threadState = gameState.threadState[threadId];
		var programCounter = threadState.programCounter;
		var currentInstruction = instructions[programCounter[0]];
		if (currentInstruction.isCriticalSection) {
			howManyCriticalSections++;
		}
	}
	if (howManyCriticalSections >= 2) {
		win("Two threads were in a critical section at the same time.");
		return;
	}

	if (areAllThreadsBlocked()) {
		win("A deadlock occurred - all threads were blocked simultaneously.");
		return;
	}

	if (areAllThreadsFinished()) {
		lose('All threads of the program ran to the end, so the program was successful. Try to sabotage the program before it finishes.');
		return;
	}
};

var isThreadFinished = function(thread) {
	var program = gameState.getProgramOfThread(thread);
	var maxInstructions = program.length;
        var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter[0];
	return pc >= maxInstructions;
};

var stepThread = function(thread) {
	if (isLevelPristine()) {
		sendEvent('Gameplay', 'level-first-step', gameState.getLevelId());
	}

	var program = gameState.getProgramOfThread(thread);
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter[0];
	if (!isThreadFinished(thread)) {
		saveForUndo();
		if (threadState.expanded) {
			program[pc].minorInstructions[threadState.programCounter[1]].execute(threadState, gameState.globalState, program);
		} else {
			program[pc].execute(threadState, gameState.globalState, program);
			threadState.localVariables = [];
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

var nextObjectName = function(type) {
	var count = gameState.objectCounts[type] || 0;
	gameState.objectCounts[type] = ++count;
	return type + " " + count;
}

var undoHistory = [];

var isLevelPristine = function() {
	return undoHistory.length == 0;
};

var saveForUndo = function() {
	var state = {
		threadState: gameState.threadState,
		globalState: gameState.globalState,
		objecCounts: gameState.objectCounts,
	};
	undoHistory.push(JSON.stringify(state));
};

var undo = function() {
	var last = JSON.parse(undoHistory.pop());
	console.log(last);
	// TODO(prvak): This forces us to have JSON-serializable threadState
	// and globalState. Properly (de)serialize?
	gameState.threadState = last.threadState;
	gameState.globalState = last.globalState;
	gameState.objectCounts = last.objectCounts;
	redraw();
};

var resetLevel = function() {
	sendEvent('Gameplay', 'level-restart', gameState.getLevelId());
	startLevel(gameState.getLevelId());
};

var undoButton;
var threadButtons;
var threadContextualButtons;
var nextChallengeButton;

var levelWasCleared = false;

var goToNextLevel = function() {
	var next = findNextLevelInCampaign(gameState.getLevelId());
	sendEvent('Gameplay', 'level-next-entered', next);
	startLevel(next);
	winScreen.fadeOut(300);
};

var startLevel = function(levelName) {
	if (!localStorage.getItem('level_' + levelName + '_opened')) {
		sendEvent('Gameplay', 'level-opened-first', levelName);
		localStorage.setItem('level_' + levelName + '_opened', true);
	}

	levelWasCleared = false;
	undoHistory = [];
	var level = levels[levelName];
	if (!level) {
		fail("trying to start nonexisting level ", levelName);
		return;
	}
	console.log(level);

	var mainArea = $('#mainarea');
	mainArea.html("");

	var title = $('<h1></h1>');
	title.text(level.name);
	mainArea.append(title);

	var globalButtons = $('<div class="global-buttons"></div>');
	mainArea.append(globalButtons);

	var introduction = $('<p id="storyIntro"></p>');
	introduction.html(level.longDescription);
	mainArea.append(introduction);

	//wonBanner = $('<div id="won-banner"></div>');
	wonBanner = $('<div id="won-banner"><span class="glyphicon glyphicon-ok"></span>&nbsp;Congratulations, you completed this challenge!</div>');
	mainArea.append(wonBanner);

	undoButton = $('<button class="undobutton btn btn-info" style="border-top-right-radius: 0; border-bottom-right-radius: 0;"><span class="glyphicon glyphicon-step-backward"></span>&nbsp;Undo</button>');
	undoButton.click(undo);
	undoButton.attr('disabled', true);
	globalButtons.append(undoButton);

	var resetButton = $('<button class="btn btn-warning" style="border-top-left-radius: 0; border-bottom-left-radius: 0;"><span class="glyphicon glyphicon-repeat"></span>&nbsp;Reset level</button>');
	resetButton.click(function() {
		// Don't ask for confirmation if the level is pristine (it
		// should be a NOP anyway).
		if (isLevelPristine()) {
			resetLevel();
			return;
		}

		bootbox.confirm('Really reset the level?', function(confirmed) {
			if (confirmed) {
				resetLevel();
			}
		});
	});
	globalButtons.append(resetButton);

	globalButtons.append("&nbsp;&nbsp;");

	nextChallengeButton = $('<button class="btn btn-primary"><span class="glyphicon glyphicon-chevron-right"></span>&nbsp;View Congratulations</button>');
	nextChallengeButton.click(openWinScreen);
	globalButtons.append(nextChallengeButton);

	var mainMenuButton = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-menu-hamburger"></span>&nbsp;Return to main menu</button>');
	mainMenuButton.click(function() {
		var needConfirmation = true;

		// Don't ask for confirmation if the level is pristine.
		if (isLevelPristine() || levelWasCleared) {
			needConfirmation = false;
		}

		if (needConfirmation) {
			bootbox.confirm('Really give up?', function(confirmed) {
				if (confirmed) {
					navigateToMainMenu(gameState.getLevelId());
				}
			});
		} else {
			navigateToMainMenu(gameState.getLevelId());
		}
	});
	globalButtons.append(mainMenuButton);

	var sourcesSection = $('<div class="sources"></div>');

	var threadCount = level.threads.length;
	var width = 100.0 / threadCount;

	gameState.resetForLevel(level);

	threadButtons = [];
	threadContextualButtons = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread"></div>');

		var threadHeader = $('<h3 class="thread-header"></h3>').text(level.getThreadName(i));
		threadArea.append(threadHeader);

		var stepButton = $('<button class="stepforwards btn btn-default"><span class="glyphicon glyphicon-play"></span>&nbsp;Step</button>');
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

		var blockReason = $('<div class="block-reason"></div>');
		threadArea.append(blockReason);

		threadButtons[i] = {
			step: stepButton,
			expand: expandButton,
			blockReason: blockReason
		};

		var contextualButtons = $('<span class="contextual-buttons"></span>');
		threadContextualButtons[i] = contextualButtons;
		threadArea.append(contextualButtons);

		// Possible extra actions go here.

		var source = $('<div class="code"></div>');

		var makeInstruction = function(instruction, goLeft) {
			var line = $('<div class="instruction"></div>');

			var span = $('<span></span>');

			var indentation = "";
			console.log(instruction);
			for (var i = 0; i < instruction.indent; i++) {
				indentation += "  ";
			}
			span.append(indentation);
			span.append($('<span class="body"></span>').html(instruction.code));

			if (instruction.tooltip) {
				span.attr("title", "<div style='text-align: left;'><code>" + instruction.code + "</code><br>" + instruction.tooltip + "</div>");
			}
			var placement = 'left';
			if (goLeft) {
				placement = 'right';
			}
			span.tooltip({'placement': placement, 'html': true});
			line.append(span);
			return line;
		};

		for (var j = 0; j < thread.instructions.length; j++) {
			var instruction = makeInstruction(thread.instructions[j], i == 0);
			instruction.attr('id', 'instruction-' + i + '-' + j);

			source.append(instruction);

			if (thread.instructions[j] instanceof ExpandableInstruction) {
				var expansion = $('<div class="expansion" id="instruction-' + i + '-' + j + '-expansion"></div>');

				for (var k = 0; k < thread.instructions[j].minorInstructions.length; k++) {
					var si = makeInstruction(thread.instructions[j].minorInstructions[k], i == 0);
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
	mainArea.append('<div class="global-objects"></div>');

	redraw();
	if (level.id == "T1-Interface") {
		loadTutorial1();
	}

	$('body')[0].scrollIntoView();

	updateMSDNLinks();
};

var startSelectedLevel = function() {
	startLevel($('#levelSelect').val());
};

var clearProgressAction = function () {
	bootbox.confirm("Are you sure you want to clear all your progress?", function(confirmed) {
		if (confirmed) {
			localStorage.clear();
			navigateToMainMenu();
		}
	});
};

var autoindentLevels = function() {
	$.each(levels,function(key, value) {
		$.each(value.threads, function(key2, thread) {
			var indent = 0;
			for (var instructionName in thread.instructions) {
				var instruction = thread.instructions[instructionName];
				if (instruction instanceof EndIfInstruction ||
					instruction instanceof EndIfLongInstruction ||
					instruction instanceof ElseInstruction ||
					instruction instanceof EndWhileInstruction ||
					instruction instanceof EndArcAutoreleasePoolInstruction) {
					indent--;
				}
				instruction.indent = indent;
				if (instruction instanceof ExpandableInstruction) {
					for (var j = 0; j < instruction.minorInstructions.length; j++) {
						instruction.minorInstructions[j].indent = indent + 1;
					}
				}
				if (instruction instanceof IfInstruction ||
					instruction instanceof IfLongInstruction ||
					instruction instanceof ElseInstruction ||
					instruction instanceof WhileInstruction ||
					instruction instanceof ArcAutoreleasePoolInstruction) {
					indent++;
				}
			}
		});
	});
};

$(function() {
	$('button#start').click(startSelectedLevel);
	$('button#goToMain').click(navigateToMainMenu);
	$('#clearProgress').click(clearProgressAction);
	$('#alertHide').click(function () {
		console.log("hiding");
		$('#alert').hide();
	});
	var select = $("#levelSelect");
	$.each(levels,function(key, value) {
		select.append('<option value=' + key + '>' + value.name + '</option>');
	});
	autoindentLevels();
});

/**
 * Redirects to a game screen according to current location hash.
 */
var route = function() {
	if (location.hash == '#menu' || !location.hash) {
		returnToMainMenu();
	} else {
		var levelId = location.hash.replace('#', '');
		if (levelId in levels) {
			sendEvent('Gameplay', 'level-entered-hash', levelId);
			startLevel(levelId);
		} else {
			console.warn("hash does not correspond to level, returning to main menu", location.hash);
			returnToMainMenu();
		}
	}
};

var navigateToLevel = function(level) {
	sendEvent('Gameplay', 'level-started-from-menu', level);
	history.pushState({level: level}, level, "#" + level);
	route();
};

/**
 * @param {string} levelIdToDisplay Optional. Level to scroll to.
 */
var navigateToMainMenu = function(levelIdToDisplay) {
	sendEvent('Gameplay', 'navigate-to-menu', levelIdToDisplay);
	history.pushState({menu: true}, "menu", "#menu");
	route();
	if (levelIdToDisplay) {
		scrollLevelIntoView(levelIdToDisplay);
	}
};

$(window).bind('popstate', function(event) {
	console.log('popstate', event, location);
	console.log(location.hash);
	route();
});

$(function() {
	route();
});
