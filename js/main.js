// constructor
var Instruction = function(code) {
	this.code = code;
};

var level = {
	threads: [
		[
			new Instruction("Hello World!"),
		],
		[
			new Instruction("foo"),
			new Instruction("bar"),
			new Instruction("zoo")
		],
		[
			new Instruction("bar"),
			new Instruction("foo"),
			new Instruction("bar"),
		]
	]
};

var gameState = {
	threadInstructions: null,
	programCounters: null
};

var updateProgramCounters = function() {
	var threadCount = level.threads.length;
	$('.instruction').each(function() {
		$(this).removeClass('current-instruction');
	});
	// update program counters
	for (var i = 0; i < threadCount; i++) {
		var pc = gameState.programCounters[i];
		$(gameState.threadInstructions[i][pc]).addClass('current-instruction');
	}
};

var stepThread = function(thread) {
	var maxInstructions = level.threads[thread].length;
	console.log(maxInstructions, gameState.programCounters);
	if (gameState.programCounters[thread] + 1 < maxInstructions) {
		gameState.programCounters[thread]++;
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
		for (var j = 0; j < thread.length; j++) {
			var instruction = $('<div class="instruction">' + thread[j].code + '</div>');
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

	var programCounters = [];
	for (var i = 0; i < threadCount; i++) {
		programCounters[i] = 0;
	}
	gameState.programCounters = programCounters;
	gameState.threadInstructions = threadInstructions;

	updateProgramCounters();
};

$(function() {
	$('button#start').click(startLevel);
});
