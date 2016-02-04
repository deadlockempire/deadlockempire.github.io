var winScreen;
var loseScreen;

var win = function(reason) {
	if (levelWasCleared) {
		return;
	}
	localStorage.setItem('level_' + gameState.getLevelId(), "solved");
	winScreen.fadeIn(400);
	levelWasCleared = true;

	var messages = ["You win!", "Great job!", "Congratulations!"];
	var randomMessage = messages[Math.floor(3 * Math.random())];

	$('#win-congratulation').text(randomMessage);

	var text = gameState.getLevel().victoryText;
	if (reason) {
		text += "<br><br><p>Victory Condition: <i>" + reason + "</i></p>";
	}
	$('#win-message').html(text);

	if (!areThereMoreLevels()) {
		// game finished
		$('#win-message').append("<br><br>You mastered all the lessons of The Deadlock Empire. Thank you for playing!");
		$('#win-next-level').hide();
	} else {
		$('#win-next-level').show();
	}
};

var areThereMoreLevels = function() {
	return findNextLevelInCampaign(gameState.getLevelId()) != null;
};

var lose = function(reason) {
	loseScreen.fadeIn(400);
	var text = "";
	if (gameState.getLevel().failureText) {
		text = gameState.getLevel().failureText;
	}
	if (reason) {
		if (text != "") {
			text += "<br><br>";
		}
		text += "<p>Failure Condition: <i>" + reason + "</i></p>";
	}
	$("#lose-message").html(text);
};

$(function() {
	winScreen = $('#win-screen');
	winScreen.css({display: 'none'});

	$('#dismiss-win').click(function() {
		winScreen.fadeOut(300);
		redraw();  // shows 'next challenge' button
	});

	// TODO: what if we win the last level?
	$('#win-next-level').click(goToNextLevel);

	$('#win-go-to-menu').click(function() {
		returnToMainMenu();
		winScreen.fadeOut(300);
	});

	$('#lose-restart').click(function() {
		resetLevel();
		loseScreen.fadeOut(300);
	});

	$('#lose-step-back').click(function() {
		undo();
		loseScreen.fadeOut(300);
	});

	$('#lose-go-to-menu').click(function() {
		returnToMainMenu();
		loseScreen.fadeOut(300);
	});

	loseScreen = $('#lose-screen');
});
