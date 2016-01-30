function showMessage(caption, text) {
    $('#alertCaption').html(caption);
    $('#alertText').html(text);
    $('#alert').show();
}

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
	area.html("");
	for (var key in gameState.globalState) {
		var variable = gameState.globalState[key];
		var representation = $('<div class="variable"></div>');
		representation.append($('<span class="type"></span>').text(variable.type));
		representation.append($('<span class="name"></span>').text(variable.name));
		representation.append("=");

		var valueRepr;
		if (variable.type == "String") {
			valueRepr = '"' + variable.value + '"';
		}

		representation.append($('<span class="value"></span>').text(valueRepr));
		area.append(representation);
	}
};

var redraw = function() {
	updateProgramCounters();
	updateGlobalVariables();
	undoButton.attr('disabled', undoHistory.length == 0);
};
