var Level = function(id, name, intro, victoryText, threads) {
    this.id = id;
	this.intro = intro;
	this.name = name
	this.victoryText = victoryText;
	this.threads = threads;
};

var Thread = function(instructions) {
	this.instructions = instructions;
};