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
	var subheading = $("<h2 id='subtitle'>Break programs - fight dragons!</h2>");
	var introText = $("<div id='introtext'>Welcome to <b>The Deadlock Empire</b>, commander! The skills you need are your intelligence, cunning, perseverance and the will to test yourself against the intricacies of multi-threaded programming in the divine language of C#. Each <i>challenge</i> below is a computer program of two or more threads. You take the role of the Scheduler - and a malicious one! Your objective is to exploit flaws in the programs to make them crash or otherwise malfunction.<br><br>For example, you might cause a <a href='http://en.wikipedia.org/wiki/Deadlock'>deadlock</a> to occur or you might schedule context switches in such a way that two threads enter the same <a href='http://en.wikipedia.org/wiki/Critical_section'>critical section</a> at the same time. Any action that disrupts the program this way counts as a victory for you.<br><br>You are the <b>Scheduler</b> - you only have one tool at your disposal: the ability to switch contexts at any time, as the total master of time and interruptions. It has to be, because the Parallel Wizard's armies are upon us and only you can lead the Sequentalist armies into victory!</div>");

	mainArea.append(logo);
	mainArea.append(heading);
	mainArea.append(subheading);
	mainArea.append($('<div class="clearboth"></div>'));
	mainArea.append(introText);


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
		if (quest.name == "Debugging Levels" && !debugMode) {
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
