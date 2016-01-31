var levels = {
	"monitortest" : new Level("monitortest",
	"A","B","C","D",
	[
		new Thread([
			createMonitorWait("mutex")
		]),
		new Thread([
			createMonitorWait("mutex")
		])
	],
		{
			"mutex" : {
				name: "mutex",
				type: "System.Object",
				value: "unimportant",
				"lockCount": 0,
				"lastLockedByThread": null,
			}
		}),

	"tutorial": new Level(
	    "tutorial",
		"Tutorial Level",
		"We don't have enough instructions.",
		"You have learnt no lesson here.",
		"victorytext",
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
		),
	"infiniteLevel": new Level(
		"infiniteLevel",
		"Infinite Level",
		"DESC",
		"VICTORY",
		[
			new Thread([
				new WhileInstruction("true", function() { return true; }, "eternal"),
				new FlavorInstruction("business_logic()"),
				new EndWhileInstruction("eternal")
			])
		]
	),
	"deadlock": new Level(
		"deadlock",
		"Simple Deadlock",
		"You must cause a deadlock.",
		"Yay. A deadlock!",
		[
			new Thread([
				new MonitorEnterInstruction("mutex"),
				new MonitorEnterInstruction("mutex2"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				new MonitorExitInstruction("mutex2"),
			]),
			new Thread([
				new MonitorEnterInstruction("mutex2"),
				new MonitorEnterInstruction("mutex"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex2"),
				new MonitorExitInstruction("mutex"),
			]),
		],
		{
			"mutex" : {
				name: "mutex",
				type: "System.Object",
				value: "unimportant",
				"lockCount": 0,
				"lastLockedByThread": null,
			},
			"mutex2" : {
				name: "mutex2",
				type: "System.Object",
				value: "unimportant",
				"lastLockedByThread": null,
				"lockCount": 0
			}
		}
	),
	"1-simpletest": new Level(
		"1-simpletest",
		"Simple Test",
		"Tutorial. Learn to step through a program in The Deadlock Empire.",
		"Learn to step through a program in the Thread Safety Breaker in this tutorial level. Simply keep stepping forwards until you reach the failure statement to win.",
		"The failure statement is like an 'assert false' statement. It represents a point in the program that should never be reached or the program was incorrectly programmed. In this game, reaching a failure statement always results in immediate victory.",
		[
			new Thread([
				createAssignment("a", new LiteralExpression(1)),
				createAssignment("a",
					new AdditionExpression(new VariableExpression("a"),
					new LiteralExpression(2))),
				new IfInstruction(new EqualityExpression(new VariableExpression("a"), new LiteralExpression(3)), "if"),
				new FailureInstruction(),
				new EndIfInstruction("}", "if")
			])
		],
		{
			"a" : {
				name : "a",
				type : "System.Int32",
				value : 0
			}
		}
	),
	"2-flags": new Level(
		"2-flags",
		"Boolean Flags Are Enough For Everyone",
		"Who needs locks when you can get by with using just variables? ...or can you?",
		"Who needs locks when you can get by with using just variables? ...or can you?",
		"To break synchronization, stop at unexpected times - here, for example, you had to stop immediately after the end of the loop. The most difficult parallelism bugs come from situations that rarely really happen because they require some strange timing, as in here.",
		[
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "eternal"),

				new WhileInstruction(new InequalityExpression(new VariableExpression("flag"), new LiteralExpression(false)), "while"),
				new EmptyStatement(),
				new EndWhileInstruction("while"),

				createAssignment("flag", new LiteralExpression(true)),

				new CriticalSectionInstruction(),

				createAssignment("flag", new LiteralExpression(false)),

				new EndWhileInstruction("eternal")
			]),
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "eternal"),

				new WhileInstruction(new InequalityExpression(new VariableExpression("flag"), new LiteralExpression(false)), "while"),
				new EmptyStatement(),
				new EndWhileInstruction("while"),

				createAssignment("flag", new LiteralExpression(true)),

				new CriticalSectionInstruction(),

				createAssignment("flag", new LiteralExpression(false)),

				new EndWhileInstruction("eternal")
			])
		],
		{
			"flag" : {
				name : "flag",
				type : "System.Boolean",
				value : false
			}
		}
	),
	"3-simpleCounter" : new Level(
		"3-simpleCounter",
		"Simple Counter",
		"Let's test your skills with a simple problem.",
		"Here also you must make both threads enter the critical section. This should not be hard.",
		"As you have seen previously, once you pass a test, such as an integer comparison, you don't care about what other threads do to the operands - you have already passed the test and may continue to the critical section. To make this work, you would need locks.",
		[
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "while"),						createIncrement("counter"),
				new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(5)), "if"),
				new CriticalSectionInstruction(),
				new EndIfInstruction("if"),
				new EndWhileInstruction("while")
			]),
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "while"), 				createIncrement("counter"),
				new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(3)), "if"),
				new CriticalSectionInstruction(),
				new EndIfInstruction("if"),
				new EndWhileInstruction("while")
			])
		],
		{
			"counter": {
				name: "counter",
				type: "System.Int32",
				value : 0
			}
		}
	),
	"4-confusedCounter" : new Level(
		"4-confusedCounter",
		"Confused Counter",
		"Could it be that some instructions are hidden from sight?",
		"Could it be that some instructions are hidden from sight?",
		"Most instructions are <i>not</i> atomic. That means that context may switch during the instruction's execution. For assignments, for example, it means that the expression may be read into registers of a thread, but then context may switch and when the thread receives priority again, it won't read the expression again, it will simply write the register into the left-hand variable.",
		[
			new Thread([
				new FlavorInstruction("business_logic()"),
				createIncrement("first"),
				createIncrement("second"),
				new IfInstruction(new AndExpression(
					new EqualityExpression(new VariableExpression("second"), new LiteralExpression(2)),
					new InequalityExpression(new VariableExpression("first"), new LiteralExpression(2))), "if"),
				new FailureInstruction(),
				new EndIfInstruction("if")
			]),
			new Thread([
				new FlavorInstruction("business_logic()"),
				createIncrement("first"),
				createIncrement("second"),
				new IfInstruction(new AndExpression(
					new EqualityExpression(new VariableExpression("second"), new LiteralExpression(2)),
					new InequalityExpression(new VariableExpression("first"), new LiteralExpression(2))), "if"),
				new FailureInstruction(),
				new EndIfInstruction("if")
			])
		],
		{
			"first": {
				name: "first",
				type: "System.Int32",
				value : 0
			},
			"second": {
				name: "second",
				type: "System.Int32",
				value : 0
			}
		}
	),
	"5-peterson": new Level(
		"5-peterson",
		"Three-way Peterson Algorithm",
		"This riddle is rather fiendish.",
		"The Peterson Algorithm is the best known way for 2 threads to synchronize without the use of any synchronization primitives except for atomic value read and atomic value write. However, does a straightforward generalization for multiple threads work?",
		"As you saw, it does not. However, there is still a way to do mutual exclusion for three threads with only atomic value read and atomic value write. This method is also called Peterson's Algorithm, but it is not used in practice because solutions using more advanced atomic operations are faster and even methods using locks are more efficient.",
		[
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "eternal"),
				createAssignment("flag1", new LiteralExpression(true)),
				createAssignment("turn", new LiteralExpression(2)),
				new WhileInstruction(new AndExpression(
					new OrExpression(
						new VariableExpression("flag2"),
						new VariableExpression("flag3")
					),
					new OrExpression(
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(2)),
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(3))
					)
				), "wait", "while ((flag2 || flag3) &&\n         (turn == 2 || turn == 3)) {"),
				new EmptyStatement(),
				new EndWhileInstruction("wait"),
				new CriticalSectionInstruction(),
				createAssignment("flag1", new LiteralExpression(false)),
				new EndWhileInstruction("eternal")
			]),

			new Thread([
				new WhileInstruction(new LiteralExpression(true), "eternal"),
				createAssignment("flag2", new LiteralExpression(true)),
				createAssignment("turn", new LiteralExpression(3)),
				new WhileInstruction(new AndExpression(
					new OrExpression(
						new VariableExpression("flag1"),
						new VariableExpression("flag3")
					),
					new OrExpression(
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(1)),
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(3))
					)
				), "wait", "while ((flag1 || flag3) &&\n         (turn == 1 || turn == 3)) {"),
				new EmptyStatement(),
				new EndWhileInstruction("wait"),
				new CriticalSectionInstruction(),
				createAssignment("flag2", new LiteralExpression(false)),
				new EndWhileInstruction("eternal")
			]),

			new Thread([
				new WhileInstruction(new LiteralExpression(true), "eternal"),
				createAssignment("flag3", new LiteralExpression(true)),
				createAssignment("turn", new LiteralExpression(1)),
				new WhileInstruction(new AndExpression(
					new OrExpression(
						new VariableExpression("flag2"),
						new VariableExpression("flag1")
					),
					new OrExpression(
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(2)),
						new EqualityExpression(new VariableExpression("turn"), new LiteralExpression(1))
					)
				), "wait", "while ((flag2 || flag1) &&\n         (turn == 2 || turn == 1)) {"),
				new EmptyStatement(),
				new EndWhileInstruction("wait"),
				new CriticalSectionInstruction(),
				createAssignment("flag3", new LiteralExpression(false)),
				new EndWhileInstruction("eternal")
			])

		],
		{
			"flag1" : {
				name : "flag1",
				type : "System.Boolean",
				value : false
			},
			"flag2" : {
				name : "flag2",
				type : "System.Boolean",
				value : false
			},
			"flag3" : {
				name : "flag3",
				type : "System.Boolean",
				value : false
			},
			turn : {
				name : "turn",
				type : "System.Int32",
				value : 2
			}
		}
	),
	"L1-lock": new Level(
		"L1-lock",
		"Insufficient Lock",
		"Locks don't solve everything.",
		"These threads have total mutual exclusion - one cannot run while the other is active. But still the program can fail. Can you make it so?",
		"Congratulations on this effort!",
		[
			new Thread([
				createOuterWhile(),
				new MonitorEnterInstruction("mutex"),
				createAssignment("i", new AdditionExpression(new VariableExpression("i"), new LiteralExpression(2))),
				new CriticalSectionInstruction(),
				new IfInstruction(new EqualityExpression(new VariableExpression("i"), new LiteralExpression(5)), "if"),
				new FailureInstruction(),
				new EndIfInstruction("if"),
				new MonitorExitInstruction("mutex"),
				createOuterWhileEnd()
			]), new Thread([
				createOuterWhile(),
				new MonitorEnterInstruction("mutex"),
				createAssignment("i", new SubtractionExpression(new VariableExpression("i"), new LiteralExpression(1))),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				createOuterWhileEnd()
		])
		],
		{
			"mutex": {
				name : "mutex",
				type : "System.Object",
				value : "unimportant"
			},
			"i": {
				name : "i",
				type : "System.Int32",
				value : 0
			}
		}
	),
	"L2-deadlock": new Level(
		"L2-deadlock",
		"Deadlock",
		"Stop this code in its tracks!",
		"A 'deadlock' is a scenario where all threads in the program wait for each other to release some resource (usually locks). None of them is willing to concede a resource before the other ones and thus the program is stuck - forever waiting for locks which will never be released.",
		"This was the most simple deadlock scenario - two threads mutually waiting for each other, because each was stuck on a different lock. Congratulations all the same for solving it!",
		[
			new Thread([
				new MonitorEnterInstruction("mutex"),
				new MonitorEnterInstruction("mutex2"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				new MonitorExitInstruction("mutex2"),
			]),
			new Thread([
				new MonitorEnterInstruction("mutex2"),
				new MonitorEnterInstruction("mutex"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex2"),
				new MonitorExitInstruction("mutex"),
			]),
		],
		{
			"mutex" : {
				name : "mutex",
				type : "System.Object",
				value : "unimportant"
			},
			"mutex2" : {
				name : "mutex2",
				type : "System.Object",
				value : "unimportant"
			}

		}
	),
	"L3-complexer": new Level(
		"L3-complexer",
		"A More Complex Thread",
		"Three locks, two threads, one flag.",
		"Solving this problem isn't actually <i>that</i> difficult. Try to understand the program, to split it into parts and then you will find the solution is actually quite easy.",
		"...yes, the 'critical section' was just there to confuse you. However, this kind of error happens in real-life programs, as well. It is not only important to ensure single access to the critical section, but to also prevent deadlocks.",
		[
			new Thread([
				createOuterWhile(),
				new IfLongInstruction(new MonitorTryEnterExpression("mutex"), "if"),
				new MonitorEnterInstruction("mutex3"),
				new MonitorEnterInstruction("mutex"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				new MonitorEnterInstruction("mutex2"),
				createAssignment("flag", new LiteralExpression(false)),
				new MonitorExitInstruction("mutex2"),
				new MonitorExitInstruction("mutex3"),
				new ElseInstruction("if"),
				new MonitorEnterInstruction("mutex2"),
				createAssignment("flag", new LiteralExpression(true)),
				new MonitorExitInstruction("mutex2"),
				new EndIfLongInstruction("if"),
				createOuterWhileEnd()
			]),
			new Thread([
				createOuterWhile(),
				new IfLongInstruction(new VariableExpression("flag"), "if"),
				new MonitorEnterInstruction("mutex2"),
				new MonitorEnterInstruction("mutex"),
				createAssignment("flag", new LiteralExpression(false)),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				new MonitorEnterInstruction("mutex2"),
				new ElseInstruction("if"),
				new MonitorEnterInstruction("mutex"),
				createAssignment("flag", new LiteralExpression(false)),
				new MonitorExitInstruction("mutex"),
				new EndIfLongInstruction("if"),
				createOuterWhileEnd()
			])
		],
		{
			"mutex" : {
				name : "mutex",
				type : "System.Object",
				value : "unimportant"
			},
			"mutex2" : {
				name : "mutex2",
				type : "System.Object",
				value : "unimportant"
			},
			"mutex3" : {
				name : "mutex2",
				type : "System.Object",
				value : "unimportant"
			},
			"flag": {
				name : "flag",
				type : "System.Boolean",
				value : false
			}
		}
	),
	"S1-simple" : new Level(
		"S1-simple",
		"Semaphores",
		"Semaphore is a simple synchronization primitive.",
		"This is an introductory level and should not take too much effort.",
		"Yay! You know how to use semaphores maybe! Let's now proceed to harder levels.",
		[
			new Thread([
				createOuterWhile(),
				new SemaphoreWaitInstruction("ss"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss"),
				createOuterWhileEnd()
			]),
			new Thread([
				createOuterWhile(),
				new IfLongInstruction(new SemaphoreTryWaitExpression("ss"), "if"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss"),
				new ElseInstruction("if"),
				new SemaphoreReleaseInstruction("ss"),
				new EndIfLongInstruction("if"),
				createOuterWhileEnd()
			])
		],
		{
			"ss" : {
				name : "ss",
				type : "System.Threading.SemaphoreSlim",
				value : 0
			}
		}
	),
	"S2-producerConsumer" : new Level(
		"S2-producerConsumer",
		"Producer-Consumer",
		"A new victory condition awaits you!",
		"In this challenge, your goal is cause an exception to be raised.",
		"You should know that this was really a rather simple producer-consumer pattern to exploit but I admit you performed quite well nonetheless.",
		[
			new Thread([
				createOuterWhile(),
				new IfLongInstruction(new SemaphoreTryWaitExpression("ss"), "if"),
				createDequeueUnsafe("queue"),
				new ElseInstruction("if"),
				new CommentInstruction("Nothing in the queue."),
				new EndIfLongInstruction("if"),
				createOuterWhileEnd()
			]),
			new Thread([
				createOuterWhile(),
				new SemaphoreReleaseInstruction("ss"),
				createEnqueueUnsafe("queue", 42),
				createOuterWhileEnd()
			])
		]
		,
		{
			"ss" : {
				name : "ss",
				type : "System.Threading.SemaphoreSlim",
				value : 0
			},
			"queue" : {
				name : "queue",
				type : "System.Queue<int>",
				value : 0
			}
		}
	),
	"S3-producerConsumer" : new Level(
		"S3-producerConsumer",
		"Producer-Consumer (variant)",
		"The victory conditions just keep coming!",
		"For this challenge, it will be useful to know that most library methods are not thread-safe and if two threads enter an unsafe method on the same object simultaneously, strange things may happen. Things that result in your victory.",
		"Congratulations, Scheduler! Are you ready for the next challenge?",
		[
			new Thread([
				new CommentInstruction("The Producer"),
				createOuterWhile(),
				createEnqueueUnsafe("queue", 42),
				createOuterWhileEnd()
			]),
			new Thread([
				new CommentInstruction("The Consumer"),
				createOuterWhile(),
				new IfInstruction(new QueueNotEmptyExpression("queue"), "if"),
				createDequeueUnsafe("queue"),
				new EndIfInstruction("if"),
				createOuterWhileEnd()
			])
		],
		{
			"queue" : {
				name : 'queue',
				type : "System.Queue<int>",
				value : 0
			}
		}
	)



};
