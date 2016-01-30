var winScreen;

var win = function(reason) {
	winScreen.fadeIn(400);

	//$('#win-screen .icon').slideDown();

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
		$('#win-message').append("<br><br>You mastered all the lessons of Deadlock Empire. Thank you for playing!");
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
});
