var declareVictory = function(reason) {
    showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"! The reason for victory is "' + reason + '"!');
    localStorage.setItem('level_' + window.level.id, "solved");
}