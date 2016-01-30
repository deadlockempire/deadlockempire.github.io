// constructor
var Instruction = function(code) {
	this.code = code;
	this.execute = function() {};
};

var WinningInstruction = function(code) {
	this.code = code;
	this.execute = function() { alert("you win"); };
};

var Level = function(intro, threads) {
	this.intro = intro;
	this.threads = threads;
};

var Thread = function(instructions) {
	this.instructions = instructions;
};

var level = new Level(
	"In this level, you want to finish the second thread.",
	[
		new Thread([
			new Instruction("Hello World!"),
		]),
		new Thread([
			new Instruction("foo"),
			new Instruction("bar"),
			new Instruction("zoo"),
			new WinningInstruction("[REACH THIS TO WIN]")
		]),
		new Thread([
			new Instruction("bar"),
			new WinningInstruction("[OR REACH THIS TO WIN]"),
			new Instruction("bar"),
		])
	]
);

var gameState = {
	threadInstructions: null,

	// thread state:
	// {
	//	programCounter: (number of current instruction),
	//	variables: {
	//		'variableName': (value)
	//	}
	// }
	threadState: null
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

var stepThread = function(thread) {
	var maxInstructions = level.threads[thread].instructions.length;
	var threadState = gameState.threadState[thread];
	var pc = threadState.programCounter;
	if (pc < maxInstructions) {
		level.threads[thread].instructions[pc].execute();
		threadState.programCounter++;
		updateProgramCounters();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

var startLevel = function() {
	var mainArea = $('#mainarea');
	mainArea.html("");
	level = levels[$('#levelSelect').val()];
	console.log($('#levelSelect').val());

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

	mainArea.append('<div class="clearboth"></div>');
	mainArea.append(sourcesSection);

	var threadStates = [];
	for (var i = 0; i < threadCount; i++) {
		threadStates[i] = {
			programCounter: 0,
			variables: {}
		};
	}
	gameState.threadState = threadStates;
	gameState.threadInstructions = threadInstructions;

	updateProgramCounters();
};

var clearProgressAction = function () {
    localStorage.clear();
};

$(function() {
	$('button#start').click(startLevel);
    $('button#goToMain').click(returnToMainMenu);
    $('#clearProgress').click(clearProgressAction);
});

$(function() {
    returnToMainMenu();
});