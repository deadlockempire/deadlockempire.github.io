function startLevelCreator(level) {
	return function() {
		startLevel(level);
	}
}

var returnToMainMenu = function() {
	$("#mainarea").html("");
	$("#alert").hide();
	for (var levelId in levels) {
		// TODO: 'clear saved progress' button
		var level = levels[levelId];
		var source = $('<div class="mainMenuLevel"></div>');
		var isCompleted = localStorage.getItem('level_' + level.id);
		if (isCompleted) {
			source.addClass('completed');
			source.append('<span class="menu-completion-icon glyphicon glyphicon-ok"></span>');
		}
		source.append("<div class='mainMenuLevelCaption'>" + level.name + "</div>");
		source.append("<div class='mainMenuLevelDescription'>" + level.intro + "</div>");
		/*
		var button = $('<button class="btn btn-default">Play</button>');
		button.click(startLevelCreator(levelId));
		if (isCompleted) {
			button.html("Replay");
			source.addClass('mainMenuSolvedLevel');
		}
		source.append(button);
		*/
		source.css({cursor: 'pointer'});
		source.click(startLevelCreator(levelId));
		$("#mainarea").append(source);
	}
}
