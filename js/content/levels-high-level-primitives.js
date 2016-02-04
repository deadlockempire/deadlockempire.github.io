levels["H1-ManualResetEvent"] = new Level(
    "H1-ManualResetEvent",
    "Manual Reset Event",
    "Introduces the ManualResetEventSlim class, a no-fuss simple primitive.",
    "The <b>ManualResetEventSlim</b> (which supersedes the older ManualResetEvent that is maintained for backwards compatibility only) is an object with a single boolean flag and three methods - Wait, Set and Reset. The Wait() method blocks if the \"reset event\" is \"signaled\" (it starts out nonsignaled). Whether the event is signaled or not is set manually by the programmer using the methods Set() and Reset().<br><br>" +
    "For example, you might want to block a thread until some long computation finishes on another thread. To do this, you might create a ManualResetEvent named 'computationFinished' and call 'computationFinished.Wait()' on the first thread and 'computationFinished.Set()' on the computing thread after the computation is complete.",
    "You've done well. Using ManualResetEventSlim is trickier if you use both Set() and Reset() rather than only Set().",
    [
        new Thread([
            createOuterWhile(),
            new ManualResetEventWait("sync"),
            new IfInstruction(new EqualityExpression(new ModuloExpression(new VariableExpression("counter"), new LiteralExpression(2)), new LiteralExpression(1)), "if"),
            new FailureInstruction(),
            new EndIfInstruction("if"),
            createOuterWhileEnd()
        ]),
        new Thread([
            createOuterWhile(),
            new ManualResetEventReset("sync"),
            createIncrement("counter"),
            createIncrement("counter"),
            new ManualResetEventSet("sync"),
            createOuterWhileEnd()
        ])
    ],
    {
        "counter" : new IntegerVariable("counter", 0),
        "sync" : new ManualResetEventVariable("sync", false)
    }
);
levels["H2-CountdownEvent"] = new Level(
  "H2-CountdownEvent",
  "Countdown Event",
  "Introduces the CountdownEvent class, a more powerful barrier but also trickier.",
    "The <b><a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a></b> class has an internal counter and is initialized with a number. " +
    "Its <a href='https://msdn.microsoft.com/en-us/library/dd321954'>.Signal()</a> method atomically decrements the counter. Its <a href='https://msdn.microsoft.com/en-us/library/dd270769'>.Wait()</a> method blocks the calling thread until the counter reaches zero. You can use this primitive to wait until all threads finished their work if you know the size of the work, for example. Its advantage compared to the <a href='https://msdn.microsoft.com/en-us/library/system.threading.barrier'>Barrier</a> is that you can wait without signalling, and that you can signal multiple times from the same thread.<br><br>" +
    "However, this could also be a vulnerability if handled improperly, as you can see in this level.",
    "Yes! When using the <a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a>, you must make extra sure that you are not leaving yourself open to deadlocks - the <i>.Wait()</i> calls will block indefinitely if not enough <i>.Signal()</i> calls have been made. Suppose you use the CountdownEvent for loading data. If one of threads fails to load data and somehow crashes, therefore not signalling, the program will be blocked and you won't be able to terminate the waiting thrads.",
    [
        new Thread([
            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(20))),
            new IfInstruction(new GreaterOrEqualExpression(new VariableExpression("progress"), new LiteralExpression(20)), "if"),
            new CountdownEventSignal("event"),
            new EndIfInstruction("if"),

            new CountdownEventWait("event")
        ]),
        new Thread([
            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(30))),

            new IfInstruction(new GreaterOrEqualExpression(new VariableExpression("progress"), new LiteralExpression(30)), "if"),
            new CountdownEventSignal("event"),
            new EndIfInstruction("if"),



            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(50))),

            new IfInstruction(new GreaterOrEqualExpression(new VariableExpression("progress"), new LiteralExpression(80)), "if2"),
            new CountdownEventSignal("event"),
            new EndIfInstruction("if2"),

            new CountdownEventWait("event")
        ])
    ],
    {
        "progress" : new IntegerVariable("progress", 0),
        "event" : new CountdownEventVariable("event", 3)
    }
);
levels["H3-CountdownEvent"] = new Level(
    "H3-CountdownEvent",
    "Countdown Event Revisited",
    "I fixed the bug. What are you going to do about it, huh?",
    "This is now much simpler, no? This <a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a> is going to be a breeze for you, Scheduler.",
    "The high-level synchronization primitives such as <i>CountdownEvent</i> are very safe and throw exceptions whenever something bad happens. For example, as you have just seen, it is impossible to signal if the event counter is already at zero. Good job!",
    [
        new Thread([
            createOuterWhile(),
            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(20))),
            new CountdownEventSignal("event"),
            new CountdownEventWait("event"),
            new IfInstruction(new EqualityExpression(new VariableExpression("progress"), new LiteralExpression(100)), "success"),
            new GameOverInstruction(),
            new EndIfInstruction("success"),
            createOuterWhileEnd()
        ]),
        new Thread([
            createOuterWhile(),
            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(30))),
            new CountdownEventSignal("event"),
            createAssignment("progress", new AdditionExpression(new VariableExpression("progress"), new LiteralExpression(50))),
            new CountdownEventSignal("event"),
            new CountdownEventWait("event"),
            new IfInstruction(new EqualityExpression(new VariableExpression("progress"), new LiteralExpression(100)), "success"),
            new GameOverInstruction(),
            new EndIfInstruction("success"),
            createOuterWhileEnd()
        ])
    ],
    {
        "progress" : new IntegerVariable("progress", 0),
        "event" : new CountdownEventVariable("event", 3)
    }
);
