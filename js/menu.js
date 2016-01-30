function startLevelCreator(level) {
	return function() {
		startLevel(level);
	}
}

var returnToMainMenu = function() {
	$("#mainarea").html("");
	$("#alert").hide();

	var makeLevelBox = function(levelId) {
		var level = levels[levelId];
		var source = $('<div class="mainMenuLevel"></div>');
		var isCompleted = localStorage.getItem('level_' + level.id);
		if (isCompleted) {
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
		var quest = campaign[campaignKey];
		var heading = $('<h2></h2>');
		heading.text(quest.name);
		$('#mainarea').append(heading);
		for (var i = 0; i < quest.levels.length; i++) {
			var levelId = quest.levels[i];
			var source = makeLevelBox(levelId);
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
