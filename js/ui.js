function showMessage(caption, text) {
    $('#alertCaption').html(caption);
    $('#alertText').html(text);
    $('#alert').show();
}

var updateProgramCounters = function() {
	$('.instruction').each(function() {
		$(this).removeClass('current-instruction');
	});
	$('.expansion').each(function() {
		$(this).css({display: "none"});
	});
	// update program counters
	for (var i = 0; i < gameState.getThreadCount(); i++) {
		var threadState = gameState.threadState[i];
		var pc = threadState.programCounter[0];
		var program = gameState.getProgramOfThread(i);

		if (pc < program.length) {
			$('#instruction-' + i + '-' + pc).addClass('current-instruction');
		}

		if (program[pc] instanceof ExpandableInstruction) {
			$('#instruction-' + i + '-' + pc + '-expansion').css({display: (threadState.expanded ? 'block' : 'none')});

			if (threadState.expanded) {
				$('#instruction-' + i + '-' + pc + '-sub' + threadState.programCounter[1]).addClass('current-instruction');
			}
		}
	}
};

var updateGlobalVariables = function() {
	var area = $('.global-state');
	area.html("<hr>");
	for (var key in gameState.globalState) {
		var variable = gameState.globalState[key];
		var representation = $('<div class="variable"></div>');
		representation.append($('<span class="type"></span>').text(variable.type));
		representation.append($('<span class="name"></span>').text(variable.name));
		if (variable.value == "unimportant") {

		}
		else {
			representation.append($('<span class="equalSign"></span>').text('='));

			var valueRepr;
			if (variable.type == "String") {
				valueRepr = '"' + variable.value + '"';
			}
			else if (variable.type.indexOf("Semaphore") != -1) {
				valueRepr = 'SemaphoreSlim [count: ' + variable.value + ']';
			}
			else if (variable.type.indexOf("Queue") != -1) {
				valueRepr = 'Queue [element count: ' + variable.value + ']';
			}
			else {
				valueRepr = variable.value.toString();
			}

			representation.append($('<span class="value"></span>').text(valueRepr));
		}

		representation.append(";");
		if (variable.lastLockedByThread != null) {
			representation.append(" (locked by thread " + variable.lastLockedByThread + ")");
		}
		area.append(representation);
	}
};

var redraw = function() {
	updateProgramCounters();
	updateGlobalVariables();

	var undoEnabled = (undoHistory.length > 0);
	undoButton.attr('disabled', !undoEnabled);
	undoButton.removeClass('btn-info');
	undoButton.removeClass('btn-default');
	undoButton.addClass(undoEnabled ? 'btn-info' : 'btn-default');

	if (levelWasCleared && areThereMoreLevels()) {
		nextChallengeButton.show();
		wonBanner.show();
	} else {
		nextChallengeButton.hide();
		wonBanner.hide();
	}

	for (var i = 0; i < gameState.getThreadCount(); i++) {
		var program = gameState.getProgramOfThread(i);
		var threadState = gameState.threadState[i];
		var currentInstruction = program[threadState.programCounter[0]];

		if (isThreadFinished(i)) {
			threadButtons[i].step.attr('disabled', true);
			threadButtons[i].step.attr('title', 'This thread is finished.');
			threadButtons[i].step.tooltip();
		} else if (isThreadBlocked(i)) {
			threadButtons[i].step.attr('disabled', true);
			threadButtons[i].step.attr('title', 'This thread is blocked.');
			threadButtons[i].step.tooltip();
		} else {
			threadButtons[i].step.attr('disabled', false);
			threadButtons[i].step.attr('title', '');
			threadButtons[i].step.tooltip('destroy');
		}

		var isExpandable = (currentInstruction instanceof ExpandableInstruction);
		threadButtons[i].expand.attr('disabled', !(isExpandable && !threadState.expanded));
	}
};
