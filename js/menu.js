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
	    source.append("<span class='mainMenuLevelCaption'>" + level.name + "</span>");
	    source.append("<br>");
	    source.append("<span class='mainMenuLevelDescription'>" + level.intro + "</span>");
	    source.append("<br>");
	    var button = $('<button class="btn btn-default">Play</button>');
	    button.click(startLevelCreator(levelId));
	    if (localStorage.getItem('level_' + level.id)) {
		    button.html("Replay");
		    source.append("This level has been completed.<br>");
		    source.addClass('mainMenuSolvedLevel');
	    }
	    source.append(button);
	    $("#mainarea").append(source);
    }
}
