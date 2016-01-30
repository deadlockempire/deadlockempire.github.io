function startLevelCreator(level) {
    return function() {
        startLevel(level);
    }
}

var returnToMainMenu = function() {
    $("#mainarea").html("");
    for (var levelId in levels) {
        var level = levels[levelId];
		var source = $('<div class="mainMenuLevel"></div>');
		source.append("<span class='mainMenuLevelCaption'>" + level.name + "</span>");
		source.append("<br>");
		source.append("<span class='mainMenuLevelDescription'>" + level.intro + "</span>");
		source.append("<br>");
		var button = $('<button>Play</button>');
		button.click(startLevelCreator(level));
		if (localStorage.getItem['level_' + levelId]) {
		    button.html("Replay");
		    source.append("This level has been completed.<br>");
		    source.addClass('mainMenuSolvedLevel');
		}
		source.append(button);
		$("#mainarea").append(source);
    }
}