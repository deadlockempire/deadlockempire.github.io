var Level = function(name, intro, victoryText, threads) {
	this.intro = intro;
	this.name = name
	this.victoryText = victoryText;
	this.threads = threads;
};

var Thread = function(instructions) {
	this.instructions = instructions;
};