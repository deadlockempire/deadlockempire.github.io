function startLevelCreator(level) {
	return function() {
		startLevel(level);
	}
}

var wasLevelCompleted = function(levelId) {
	return localStorage.getItem('level_' + levelId);
}

var returnToMainMenu = function() {
	$("#mainarea").html("");
	$("#alert").hide();

	var makeLevelBox = function(levelId) {
		var level = levels[levelId];
		var source = $('<div class="mainMenuLevel"></div>');
		if (wasLevelCompleted(level.id)) {
			source.addClass('completed');
			source.append('<span class="menu-completion-icon glyphicon glyphicon-ok"></span>');
		}
		source.append("<div class='mainMenuLevelCaption'>" + level.name + "</div>");
		source.append("<div class='mainMenuLevelDescription'>" + level.intro + "</div>");
		source.css({cursor: 'pointer'});
		source.click(startLevelCreator(levelId));
		return source;
	};

	for (var campaignKey in campaign) {
		if (campaignKey == "debuggingLevels" && !debugMode) {
			continue;
		}
		var quest = campaign[campaignKey];
		var heading = $('<h2 class="menu-heading"></h2>');
		heading.text(quest.name);
		$('#mainarea').append(heading);
		var foundUnfinished = false;
		for (var i = 0; i < quest.levels.length; i++) {
			var levelId = quest.levels[i];
			var source = makeLevelBox(levelId);
			if (!wasLevelCompleted(levelId) && !foundUnfinished) {
				source.addClass('nextToPlay');
				foundUnfinished = true;
				source.prepend('<span class="menu-next-to-play-icon glyphicon glyphicon-tower"></span>');
			}
			$("#mainarea").append(source);
		}
	}

	/*
	for (var levelId in levels) {
		// TODO: 'clear saved progress' button
		var source = makeLevelBox(levelId);
		$("#mainarea").append(source);
	}
	*/
}
