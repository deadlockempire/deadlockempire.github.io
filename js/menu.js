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
		button.click(function () {
            startLevel(level);
		});
		source.append(button);
		$("#mainarea").append(source);
    }
}