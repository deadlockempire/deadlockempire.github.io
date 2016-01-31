var winScreen;

var win = function(reason) {
	localStorage.setItem('level_' + window.level.id, "solved");
	winScreen.fadeIn(400);

	//$('#win-screen .icon').slideDown();
	//
	localStorage.setItem("level_" + window.levelName, true);

	var messages = ["You win!", "Great job!", "Congratulations!"];
	var randomMessage = messages[Math.floor(3 * Math.random())];

	$('#win-congratulation').text(randomMessage);

	// TODO: taky popsat, jak jsem to znicil

	var text = level.victoryText;
	if (reason) {
		text += "<p>" + reason + "</p>";
	}
	$('#win-message').html(text);

	if (findNextLevelInCampaign(window.levelName) == null) {
		// game finished
		$('#win-message').append("<br><br>You mastered all the lessons of The Deadlock Empire. Thank you for playing!");
		$('#win-next-level').hide();
	} else {
		$('#win-next-level').show();
	}
};

$(function() {
	winScreen = $('#win-screen');
	winScreen.css({display: 'none'});

	$('#dismiss-win').click(function() {
		winScreen.fadeOut(300);
		// TODO: disallow more interaction with the code
	});

	// TODO: what if we win the last level?
	$('#win-next-level').click(function() {
		var next = findNextLevelInCampaign(window.levelName);
		startLevel(next);
		winScreen.fadeOut(300);
		// TODO: go to next level
	});

	$('#win-go-to-menu').click(function() {
		returnToMainMenu();
		winScreen.fadeOut(300);
	});
});
