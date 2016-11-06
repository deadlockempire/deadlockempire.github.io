levels["H1-ManualResetEvent"] = new Level(
    "H1-ManualResetEvent",
    "Manual Reset Event",
    "Introduces the ManualResetEventSlim class, a no-fuss simple primitive.",
    "<div class='story-intro'>We are pushing the enemy back. The next thing we need to do - we must learn to fight the Deadlock Empire's most modern weaponry.</div>" +
    "The <b>ManualResetEventSlim</b> (which supersedes the older ManualResetEvent that is maintained for backwards compatibility only) is an object with a single boolean flag and three methods - Wait, Set and Reset. The Wait() method blocks <b>until</b> the \"reset event\" is \"signaled\" (it starts out nonsignaled). Whether the event is signaled or not is set manually by the programmer using the methods Set() and Reset().<br><br>" +
    "For example, you might want to block a thread until some long computation finishes on another thread. To do this, you might create a ManualResetEvent named 'computationFinished' and call 'computationFinished.Wait()' on the first thread and 'computationFinished.Set()' on the computing thread after the computation is complete.<br><br>" +
    "<small>BUGFIX (February 9, 2016): Previously, the <code>.Wait()</code> errorneously blocked when the reset event was signaled (the reverse of what it does in C#). This has been fixed.</small>",
    "<div class='story-outro'>Enemy neutralized. Let's see what's coming next.</div>" +
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
    "<div class='story-intro'>The Countdown Dragons are a threat to us - this newest Empire weapon flies right up to you and self-destructs at the worst possible moment, sending ripples of doom throughout our armies.</div>" +
    "The <b><a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a></b> class has an internal counter and is initialized with a number. " +
    "Its <a href='https://msdn.microsoft.com/en-us/library/dd321954'>.Signal()</a> method atomically decrements the counter. Its <a href='https://msdn.microsoft.com/en-us/library/dd270769'>.Wait()</a> method blocks the calling thread until the counter reaches zero. You can use this primitive to wait until all threads finished their work if you know the size of the work, for example. Its advantage compared to the <a href='https://msdn.microsoft.com/en-us/library/system.threading.barrier'>Barrier</a> is that you can wait without signalling, and that you can signal multiple times from the same thread.<br><br>" +
    "However, this could also be a vulnerability if handled improperly, as you can see in this level.",
    "<div class='story-outro'>Well done, Scheduler.</div>" +
    "Yes! When using the <a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a>, you must make extra sure that you are not leaving yourself open to deadlocks - the <i>.Wait()</i> calls will block indefinitely if not enough <i>.Signal()</i> calls have been made. Suppose you use the CountdownEvent for loading data. If one of threads fails to load data and somehow crashes, therefore not signalling, the program will be blocked and you won't be able to terminate the waiting threads.",
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
    "<div class='story-intro'>The Empire is desperate. They cannot think that Countdown Dragons have any future at this point. We've defeated them before, we'll defeat them again.</div>" +
    "This is now much simpler, no? This <a href='https://msdn.microsoft.com/en-us/library/system.threading.countdownevent'>CountdownEvent</a> is going to be a breeze for you, Scheduler.",
    "<div class='story-outro'>Easy, wasn't it, Master Scheduler? But beware - for there is one more weapon at the Empire's disposal - and the Parallel Wizard is rolling it out in the very next challenge...!</div>The high-level synchronization primitives such as <i>CountdownEvent</i> are very safe and throw exceptions whenever something bad happens. For example, as you have just seen, it is impossible to signal if the event counter is already at zero. Good job!",
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
levels["H4-Barrier"] = new Level(
    "H4-Barrier",
    "The Barrier",
    "The Deadlock Empire rolls out a new defensive weapon.",
    "<div class='story-intro'>Soldiers of the Deadlock Empire let out a mighty cheer as a new device rolls out from their factories. It is a giant armored <b>wall</b>, covered in spikes and it is now rolling on its mighty wheels towards your troops, casting fireballs from its magical engines. You would do well to destroy this new weapon before it crushes your armies.</div>" +
    "The <a href='https://msdn.microsoft.com/en-us/library/system.threading.barrier'>Barrier class</a> is quite safe when used correctly, though it must have been difficult to create correctly for the developers of the .NET framework. The Barrier has a fixed <i>number of participants</i> - in this case, <b>two</b>. It has only one useful method - <i>.SignalAndWait()</i> that blocks until all participants reach it. Then, all participant threads are let through the barrier and the barrier resets.",
    "<div class='story-outro'>Three courageous heroes punched their way to the Barrier. The Barrier shoots fireballs but your heroes are agile and evade successfully. In the end, the Barrier crumbles.<br><br>" +
    "It's another victory for the Sequentialists! The Empire's modern weapons have been turned to dust. Now we shall see what we can do about their conventional armies.</div>It is highly recommended that you set the participant count to exactly the number of threads using the barrier in any real-world code.",
    [
        new Thread([
            createOuterWhile(),
            new InterlockedIncrement("fireballCharge"),
            new BarrierSignalAndWait("barrier"),
            new IfInstruction(new LessThanExpression(new VariableExpression("fireballCharge"), new LiteralExpression(2)), "if"),
            new FailureInstruction(),
            new EndIfInstruction("if"),
            new FlavorInstruction("fireball()"),
            createOuterWhileEnd()
        ]),
        new Thread([
            createOuterWhile(),
            new InterlockedIncrement("fireballCharge"),
            new BarrierSignalAndWait("barrier"),
            createOuterWhileEnd()
        ]),
        new Thread([
            createOuterWhile(),
            new InterlockedIncrement("fireballCharge"),
            new BarrierSignalAndWait("barrier"),
            new BarrierSignalAndWait("barrier"),
            createAssignment("fireballCharge",  new LiteralExpression(0)),
            createOuterWhileEnd()
        ])
    ],
    {
        "fireballCharge" : new IntegerVariable("fireballCharge", 0),
        "barrier": new BarrierVariable("barrier", 2)
    }
);
