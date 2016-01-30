var declareVictory = function(reason) {
    localStorage.setItem('level_' + window.level.id, "solved");
    win();
}
