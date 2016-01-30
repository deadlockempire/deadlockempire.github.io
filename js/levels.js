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
				new AssignInstruction("global hello = 'world'", 'hello', 'String', 'world'),
				new Instruction("foo"),
				new IfInstruction("if (hello == 'foo') {", function(threadState, globalState) {
					return globalState['hello'] && globalState['hello'].value == 'foo';
				}, 'if1'),
				new Instruction("  bar"),
				new Instruction("  zoo"),
				new ElseInstruction("}", 'if1'),
				new WinningInstruction("[REACH THIS TO WIN]")
			]),
			new Thread([
				new Instruction("bar"),
				new AssignInstruction("global hello = 'foo'", 'hello', 'String', 'foo'),
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
		]),
	"criticalSectionTest": new Level(
		"criticalSectionTest",
		"Critical Section Test",
		"This is short description.",
		"This is victory lesson.",
		[
			new Thread([
				new Instruction("This does nothing."),
				new CriticalSectionInstruction()
			]),
			new Thread([
			new Instruction("This does nothing."),
			new CriticalSectionInstruction()
			])

		]),
	"semaphoreTest": new Level(
		"semaphoreTest",
		"Semaphore Test",
		"DESC",
		"VCIT",
		[
			new Thread([
				new SemaphoreReleaseInstruction("ss"),
				new SemaphoreReleaseInstruction("ss"),
				new SemaphoreWaitInstruction("ss"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss")
			]), new Thread([
				new SemaphoreWaitInstruction("ss"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss")
			])
		],
		{
			"ss": {
				"name" : "ss",
				"type" : "System.Threading.SemaphoreSlim",
				"value" : 0
			}
		}
		)
};
