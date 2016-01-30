function startLevelCreator(level) {
	return function() {
		startLevel(level);
	}
}

var wasLevelCompleted = function(levelId) {
	return localStorage.getItem('level_' + levelId);
}

var returnToMainMenu = function() {
	var mainArea = $('#mainarea');
	mainArea.html("");
	$("#alert").hide();

	var logo = $("<img src='img/logo.png' id='logo'>");
	var heading = $("<h1 id='game'>The Deadlock Empire</h1>");

	mainArea.append(logo);
	mainArea.append(heading);
	mainArea.append($('<div class="clearboth"></div>'));

	var makeLevelBox = function(levelId) {
		var level = levels[levelId];
		if (!level) {
			console.log("ERROR: No such level: ", levelId);
			return $('<div></div>');
		}
		var source = $('<div class="mainMenuLevel"></div>');
		if (wasLevelCompleted(level.id)) {
			source.addClass('completed');
			source.append('<span class="menu-completion-icon glyphicon glyphicon-ok"></span>');
		}
		source.append("<div class='mainMenuLevelCaption'>" + level.name + "</div>");
		source.append("<div class='mainMenuLevelDescription'>" + level.shortDescription + "</div>");
		source.css({cursor: 'pointer'});
		source.click(startLevelCreator(levelId));
		return source;
	};

	var foundUnfinished = false;
	for (var campaignKey in campaign) {
		var quest = campaign[campaignKey];
		if (quest.name == "Debugging levels" && !debugMode) {
			continue;
		}
		var heading = $('<h2 class="menu-heading"></h2>');
		heading.text(quest.name);
		mainArea.append(heading);
		for (var i = 0; i < quest.levels.length; i++) {
			var levelId = quest.levels[i];
			var source = makeLevelBox(levelId);
			if (!wasLevelCompleted(levelId) && !foundUnfinished) {
				source.addClass('nextToPlay');
				foundUnfinished = true;
				source.prepend('<span class="menu-next-to-play-icon glyphicon glyphicon-tower"></span>');
			}
			mainArea.append(source);
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
