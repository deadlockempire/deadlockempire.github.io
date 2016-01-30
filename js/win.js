var winScreen;

var win = function() {
	winScreen.fadeIn(400);

	//$('#win-screen .icon').slideDown();

	var messages = ["You win!", "Great job!", "Congratulations!"];
	var randomMessage = messages[Math.floor(3 * Math.random())];
	$('#win-congratulation').text(randomMessage);

	// TODO: taky popsat, jak jsem to znicil

	/*
	showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"!"');
	localStorage.setItem('level_' + window.level.id, "solved");
	*/
	$('#win-message').html(level.victoryText);
};

$(function() {
	winScreen = $('#win-screen');
	winScreen.css({display: 'none'});

	$('#dismiss-win').click(function() {
		$('#win-screen').fadeOut(300);
		// TODO: disallow more interaction with the code
	});

	$('#win-next-level').click(function() {
		// TODO: go to next level
	});
});
