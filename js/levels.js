var levels = {
	"test": new Level(
	    "test",
	    "Test Level",
		"In this level, you slay monsters.",
		"You have won.",
		[
			new Thread([
				new Instruction("Hello World!"),
			]),
			new Thread([
				new AssignInstruction("global hello = 'world'", 'hello', 'world'),
				new Instruction("foo"),
				new Instruction("bar"),
				new Instruction("zoo"),
				new WinningInstruction("[REACH THIS TO WIN]")
			]),
			new Thread([
				new Instruction("bar"),
				new AssignInstruction("global hello = 'foo'", 'hello', 'foo'),
				new WinningInstruction("[OR REACH THIS TO WIN]"),
				new Instruction("foo"),
				new Instruction("bar"),
			])
		]),
	"tutorial": new Level(
	    "tutorial",
		"Tutorial Level",
		"We don't have enough instructions.",
		"You have learnt no lesson here.",
		[
			new Thread([
				new Instruction("This is the single-thread tutorial.")
			])
		])
};
