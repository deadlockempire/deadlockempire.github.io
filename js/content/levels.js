var levels = {
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
		"Here also you must make both threads enter the critical section. This should not be hard.<br>If you'd like to reset the counter, use the orange <span class='tutorial-button-mock'>Reset level</span> button on the right.",
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
		"The Peterson Algorithm is the best known way for 2 threads to synchronize without the use of any synchronization primitives except for atomic value read and atomic value write. However, does a straightforward generalization for multiple threads work?<br><br>(Hint: It doesn't. You won't be able to break this algorithm. However, note that the threads are forced to cycle. If one thread stops cooperating and does not want to enter the critical section anymore, the remaining two threads will be stuck in infinite loops, waiting.)",
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
		"The <b><a href='https://msdn.microsoft.com/en-us/library/system.threading.monitor.tryenter'>Monitor.TryEnter()</a></b> method, if successful, also locks the mutex and in C#, objects can be locked recursively. In order for a lock to be released, it must be <i>exited</i> the same number of times it was <i>entered</i>. In this game, you saw that there is no matching <i>Monitor.Exit()</i> call to the <i>.TryEnter()</i> call and thus the first thread was able to lock the object, recursively, many times, making it impossible for the second thread to lock it.",
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
		"A semaphore is a simple synchronization primitive.",
		"<a href='https://msdn.microsoft.com/en-us/library/system.threading.semaphoreslim(v=vs.110).aspx'>Semaphores</a> limit the number of threads that can access a resource at the same time. In C#, they are implemented by the SemaphoreSlim class. " +
		"You can imagine a semaphore as a stack of coins. When a thread wants to access the resource protected by the semaphore, it needs to take a coin. Once it's done, it returns the coin to the stack.<br>" +
		"To take a coin, you can call the <code><a href='https://msdn.microsoft.com/en-us/library/dd270787(v=vs.110).aspx'>Wait()</a></code> method on the semaphore. If there are no coins on the stack, the method waits until someone returns a coin. If you don't want to wait forever, you can pass it how long should it wait, in milliseconds. In that case, <code>Wait()</code> will return a boolean indicating whether it obtained a coin.<br>" +
		"The <code><a href='https://msdn.microsoft.com/en-us/library/dd235727(v=vs.110).aspx'>Release()</a></code> method adds a coin on the stack. Normally, you would call <code>Release()</code> only after a <code>Wait()</code> - you would take a coin, do something while you have it, and then give it back. However, you can also call <code>Release()</code> while you don't have any coins yourself. If you let Thread 1 run, you will see it do this: if it can't find a coin within 500 milliseconds, it will create a new one.<br><br>" +
		"The two threads below try to use a semaphore to ensure they don't enter the critical section at the same time. Can you figure out what are they doing wrong?",
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
			"ss" : new SemaphoreVariable("ss", 0)
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
			"queue" : new QueueVariable("queue", "int", 0)
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
			"queue" : new QueueVariable("queue", "int", 0)
		}
	),
	"CV1-simple": new Level(
		"CV1-simple",
		"Condition Variables",
		"Don't worry. It's not <i>that</i> hard.",
		"Condition variables are, unfortunately, a difficult topic. But - we have hope that you will manage.",
		"Your skill is unmatched, Master Scheduler! Truly no program is safe before you.",
		[
			new Thread([
				createOuterWhile(),
				new MonitorEnterInstruction("mutex"),
				new IfInstruction(new QueueIsEmptyExpression("queue"), "if"),
				createMonitorWait("mutex"),
				new EndIfInstruction("if"),
				createDequeueUnsafe("queue"),
				new MonitorExitInstruction("mutex"),
				createOuterWhileEnd()
			]),
			new Thread([
				createOuterWhile(),
				new MonitorEnterInstruction("mutex"),
				new IfInstruction(new QueueIsEmptyExpression("queue"), "if"),
				createMonitorWait("mutex"),
				new EndIfInstruction("if"),
				createDequeueUnsafe("queue"),
				new MonitorExitInstruction("mutex"),
				createOuterWhileEnd()
			]),
			new Thread([
				createOuterWhile(),
				new MonitorEnterInstruction("mutex"),
				createEnqueueUnsafe("queue", 42),
				new MonitorPulseAll("mutex"),
				new MonitorExitInstruction("mutex"),
				createOuterWhileEnd()
			])
		],
		{
			"mutex" : {
				name : "mutex",
				type : "System.Object",
				value : "unimportant"
			},
			"queue" : new QueueVariable("queue", "int", 0)
		}
	)
};
