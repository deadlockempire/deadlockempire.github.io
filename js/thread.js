var Thread = function(instructions, name) {
	if (!(instructions instanceof Array)) {
		alert("You forgot to add square brackets inside a Thread constructor!");
	}
	this.instructions = instructions;
	this.name = name;
};
