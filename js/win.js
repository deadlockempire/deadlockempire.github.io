var winScreen;
var loseScreen;

var openWinScreen = function() {
	winScreen.css({display: 'flex'}).hide().fadeIn(400);
};

var win = function(reason) {
	if (levelWasCleared) {
		return;
	}
	if (wasLevelCompleted(gameState.getLevelId())) {
		sendEvent('Gameplay', 'level-won-again', gameState.getLevelId());
	} else {
		sendEvent('Gameplay', 'level-won-first-time', gameState.getLevelId());
		localStorage.setItem('level_' + gameState.getLevelId(), "solved");
	}
	winReason = reason;
	levelWasCleared = true;

	var messages = ["You win!", "Great job!", "Congratulations!"];
	var randomMessage = messages[Math.floor(3 * Math.random())];

	$('#win-congratulation').text(randomMessage);

	var text = gameState.getLevel().victoryText;
	if (reason) {
		$('.victory-condition').html(reason);
	} else {
		$('.victory-condition').html('');
	}
	$('#win-message').html(text);

	if (!areThereMoreLevels()) {
		// game finished
		$('#win-message').append("<br><br>You mastered all the lessons of The Deadlock Empire. Thank you for playing!");
		$('#win-message').append('<br>Any thoughts about the game or ideas for improvement? We\'d like to hear those! Just fill out <a href="http://goo.gl/forms/i05ukNUMmB" target="_blank">this form</a>.');
		$('#win-next-level').hide();
	} else {
		$('#win-next-level').show();
	}

	openWinScreen();
};

var areThereMoreLevels = function() {
	return findNextLevelInCampaign(gameState.getLevelId()) != null;
};

var lose = function(reason) {
	sendEvent('Gameplay', 'level-lost', gameState.getLevelId());

	loseScreen.css({display: 'flex'}).fadeIn(400);
	var text = "";
	if (gameState.getLevel().failureText) {
		text = gameState.getLevel().failureText;
	}
	if (reason) {
		$('.failure-condition').html(reason);
	} else {
		$('.failure-condition').html('');
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
		navigateToMainMenu(gameState.getLevelId());
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
		navigateToMainMenu(gameState.getLevelId());
		loseScreen.fadeOut(300);
	});

	loseScreen = $('#lose-screen');
});
