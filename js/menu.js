function startLevelCreator(level) {
	return function() {
		navigateToLevel(level);
	}
}

var wasLevelCompleted = function(levelId) {
	return localStorage.getItem('level_' + levelId);
};

var scrollLevelIntoView = function(levelId) {
	console.log('scrolling to display level', levelId);
	$('#level-' + levelId)[0].scrollIntoView();
};

var returnToMainMenu = function() {
	var mainArea = $('#mainarea');
	mainArea.html("");
	$("#alert").hide();

	var logo = $("<img src='img/logo.png' id='logo'>");
	var logoRight = $("<img src='img/logo.png' id='logoRight'>");
	var heading = $("<h1 id='game'>The Deadlock Empire</h1>");
	var subheading = $("<h2 id='subtitle'>Slay dragons, master concurrency!</h2>");
	var introText = $("<div id='introtext'>Welcome to <b>The Deadlock Empire</b>, commander!<br><br>The skills you need are your intelligence, cunning, perseverance and the will to test yourself against the intricacies of multi-threaded programming in the divine language of C#. Each <i>challenge</i> below is a computer program of two or more threads. You take the role of the Scheduler - and a cunning one! Your objective is to exploit flaws in the programs to make them crash or otherwise malfunction.<br><br>For example, you might cause a <a href='http://en.wikipedia.org/wiki/Deadlock'>deadlock</a> to occur or you might schedule context switches in such a way that two threads enter the same <a href='http://en.wikipedia.org/wiki/Critical_section'>critical section</a> at the same time. Any action that disrupts the program this way counts as a victory for you.<br><br>You are the <b>Scheduler</b> - you only have one tool at your disposal: the ability to switch contexts at any time, as the total master of time and interruptions. Let's hope it is enough... it has to be, because the Parallel Wizard's armies are upon us and only you can lead the Sequentialist armies into victory!</div>");

	mainArea.append(logo);
	mainArea.append(logoRight);
	mainArea.append(heading);
	mainArea.append(subheading);
	mainArea.append($('<div class="clearboth"></div>'));
	mainArea.append(introText);

	var nextToPlay = getNextQuestLevel();

	var makeLevelBox = function(levelId) {
		var level = levels[levelId];
		if (!level) {
			console.log("ERROR: No such level: ", levelId);
			return $('<div></div>');
		}
		var source = $('<div class="mainMenuLevel"></div>');
		source.attr('id', 'level-' + levelId);
		if (wasLevelCompleted(levelId)) {
			source.addClass('completed');
			source.append('<span class="menu-completion-icon glyphicon glyphicon-ok"></span>');
		} else if (levelId == nextToPlay) {
			source.addClass('nextToPlay');
			source.append('<span class="menu-next-to-play-icon glyphicon glyphicon-tower"></span>');
		} else {
			source.addClass('not-special');
			source.append('<span class="menu-not-special-icon"></span>');
		}
		source.append("<div class='mainMenuLevelCaption'>" + level.name + "</div>");
		source.append("<div class='mainMenuLevelDescription'>" + level.shortDescription + "</div>");
		source.css({cursor: 'pointer'});
		source.click(startLevelCreator(levelId));
		return source;
	};

	for (var campaignKey in campaign) {
		var quest = campaign[campaignKey];
		if (quest.name == "Debugging Levels" && !debugMode) {
			continue;
		}
		var heading = $('<h2 class="menu-heading"></h2>');
		heading.text(quest.name);
		mainArea.append(heading);
		var questDescription = $('<div class="menu-subheading"></div>');
		questDescription.html(quest.description);
		mainArea.append(questDescription);
		for (var i = 0; i < quest.levels.length; i++) {
			var levelId = quest.levels[i];
			var source = makeLevelBox(levelId);
			mainArea.append(source);
		}
	}

	var clearButton = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Clear progress</button>');
	clearButton.click(clearProgressAction);


	var feedbackButton = $('<button class="btn btn-info"><span class="glyphicon glyphicon-envelope"></span>&nbsp;Submit feedback</button>');
	feedbackButton.click(function () {
		window.open('https://docs.google.com/forms/d/1IAbT86UWM1DkKdiVd1F7OXn8IlswnrUth7wavRAORHY/viewform?c=0&w=1', '_blank');
	});

	var clearButtonArea = $('<div style="text-align: right; margin-top: 5em;"></div>');
	clearButtonArea.append(feedbackButton);
	clearButtonArea.append("&nbsp;");
	clearButtonArea.append(clearButton);

	mainArea.append(clearButtonArea);
};
