levels["ARC0-RetainRelease"] = new Level("ARC0-RetainRelease",
	"Retain and Release",
	"An introduction to manual reference counting.",
	"Objects in Objective-C are reference counted. Every object starts off with a reference count of 1. " +
	"When you <span class='keyword'>retain</span> an object, it increases the reference count by 1. " +
	"When you <span class='keyword'>release</span> an object, it decreases the reference count by 1. " +
	"If an object's reference count drops to 0, it is deallocated.",
	"Great! Let's get on with the show.",
	[
		new Thread([
			new ArcPrimitiveAssignment("a", new ArcAllocateExpression("NSObject")),
			new ObjcRetainInstruction(new VariableExpression("a")),
			new ObjcReleaseInstruction(new VariableExpression("a")),
			new ObjcReleaseInstruction(new VariableExpression("a")),
			new FailureInstruction()
		])
	],
	{
		"a" : new RefCountVariable("a")
	}
);

levels["ARC1-SimpleArc"] = new Level("ARC1-SimpleArc",
	"Automatic Reference Counting",
	"Overview of how ARC works",
	"Automatic Reference Counting (ARC) simplifies memory management by automatically inserting " +
	"<span class='keyword'>retain</span> and <span class='keyword'>release</span> statements for you. " +
	"These don't show up in the code, they are inserted by the compiler. When you assign an object " +
	"to a pointer, the compiler automatically releases the previous object it was pointing to and " +
	"retains the new object it will point to.",
	"Great! Let's get on with the show.",
	[
		new Thread([
			new ArcPrimitiveAssignment("a", new ArcAllocateExpression("NSObject")),
			new ArcAssignInstruction("b", new VariableExpression("a")),
			new ArcAssignInstruction("a", new NullExpression("nil")),
			new ArcAssignInstruction("b", new NullExpression("nil")),
			new FailureInstruction()
		])
	],
	{
		"a" : new RefCountVariable("a"),
		"b" : new RefCountVariable("b")
	}
);

levels["ARC2-StrongNonAtomic"] = new Level("ARC2-StrongNonAtomic",
	"Strong vs. Strong",
	"Discover the cracks in Automatic Reference Counting",
	"Assigning a reference counted object to a strong pointer isn't an atomic operation.<br>" +
	"Discover what can go wrong when two threads share an object.",
	"Congratulations! You succeeded in releasing an already deallocated object!",
	[
		new Thread([
			new WhileInstruction(new LiteralExpression(true), "loop"),
			new ArcAssignInstruction("a", new NullExpression("nil")),
			new ArcPrimitiveAssignment("a", new ArcAllocateExpression("NSObject")),
			new EndWhileInstruction("loop")
		]),
		new Thread([
			new WhileInstruction(new LiteralExpression(true), "loop"),
			new ArcAssignInstruction("b", new VariableExpression("a")),
			new ArcAssignInstruction("b", new NullExpression("nil")),
			new EndWhileInstruction("loop")
		])
	],
	{
		"a" : new RefCountVariable("a"),
		"b" : new RefCountVariable("b")
	}
);

/*
levels["ARC3-Autoreleasing"] = new Level("ARC3-Autoreleasing",
	"Drowning in Autorelease",
	"Find out the hidden dangers of __autoreleasing and autorelease pools.",
	)
*/
