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

var updateGlobalObjects = function() {
	var area = $('.global-objects');
	var objects = [];
	for (var key in gameState.globalState) {
		var object = gameState.globalState[key].value;
		if (object instanceof RefCountObject && objects.indexOf(object) < 0) {
			objects.push(object);
		}
	}
	gameState.threadState.forEach(function (thread) {
		for (var key in thread.localVariables) {
			var variable = thread.localVariables[key];
			var object = variable.value;
			if (object instanceof RefCountObject && objects.indexOf(object) < 0) {
				objects.push(object);
			}
		}	
	});
	if (objects.length === 0) {
		area.html("");
		return;
	}
	area.html("<hr>");
	objects.forEach(function (object) {
		var representation = $('<div class="refcount-object"></div>');
		representation.append($('<span class="name"></span>').text(object.name));
		if (object.deallocating) {
			representation.append($('<span class="value"></span>').text(" [deallocating]"));
		} else {
			var valueSpan = $('<span class="value"></span>');
			for (var i = 0; i < object.refCount; ++i) {
				valueSpan.append($('<span class="glyphicon glyphicon-heart"></span>'));
			}
			representation.append(valueSpan);
		}
		area.append(representation);
	});
};

var updateGlobalVariables = function() {
	var area = $('.global-state');
	area.html("<hr>");
	for (var key in gameState.globalState) {
		var variable = gameState.globalState[key];
		var representation = $('<div class="variable"></div>');
		representation.append($('<a href="https://msdn.microsoft.com/en-us/library/' + variable.type + '" class="type"></a>').text(variable.type));
		representation.append($('<span class="name"></span>').text(variable.name));
		if (variable.value == "unimportant") {

		} else if (ToString(variable) != null) {
			representation.append($('<span class="value"></span>').text(" " + ToString(variable)));
		} else {
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
			if (variable.lockCount == 1) {
				representation.append(" (locked by thread " + variable.lastLockedByThread + ")");
			} else {
				representation.append(" (locked by thread " + variable.lastLockedByThread + ", " + variable.lockCount + " times)");
			}
		}
		area.append(representation);
	}

	updateMSDNLinks();
};

var redraw = function() {
	updateProgramCounters();
	updateGlobalVariables();
	updateGlobalObjects();

	var undoEnabled = (undoHistory.length > 0);
	undoButton.attr('disabled', !undoEnabled);
	undoButton.removeClass('btn-info');
	undoButton.removeClass('btn-default');
	undoButton.addClass(undoEnabled ? 'btn-info' : 'btn-default');

	if (levelWasCleared) {
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

		var buttons = threadButtons[i];
		var stepButton = buttons.step;
		if (isThreadFinished(i)) {
			stepButton.attr('disabled', true);
			stepButton.attr('title', 'This thread is finished.');
			stepButton.tooltip();
			buttons.blockReason.html('');
		} else if (isThreadBlocked(i)) {
			stepButton.attr('disabled', true);
			stepButton.attr('title', 'This thread is blocked.');
			stepButton.tooltip();

			var reason = isThreadBlocked(i);
			if (reason === true) {
				// (Default filler.)
				reason = "This thread is blocked.";
			}
			buttons.blockReason.html('<span class="glyphicon glyphicon-time"></span>&nbsp;' + reason);
		} else {
			stepButton.attr('disabled', false);
			stepButton.attr('title', '');
			stepButton.tooltip('destroy');
			buttons.blockReason.html('');
		}

		var isExpandable = (currentInstruction instanceof ExpandableInstruction);
		buttons.expand.attr('disabled', !(isExpandable && !threadState.expanded));
	}
};

var updateMSDNLinks = function() {
	$('a').each(function(i) {
		if (!$(this).hasClass("msdn-link")) {
			if (this.href.indexOf("msdn.microsoft.com") !== -1) {
				$(this).addClass("msdn-link");
				$(this).attr('target', '_blank');
			}
		}
	});
};

$(updateMSDNLinks);
