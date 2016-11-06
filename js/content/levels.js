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
                new EndIfInstruction("if")
            ])
        ],
        {
            "a" : new IntegerVariable("a", 0)
        }
    ),
    "2-flags": new Level(
        "2-flags",
        "Boolean Flags Are Enough For Everyone",
        "Or so thinks the Deadlock Empire.",
        "<div class='story-intro'>The day finally came. The Deadlock Empire opened its gates and from them surged massive amounts of soldiers, loyal servants of the evil Parallel Wizard. The Wizard has many strengths - his armies are fast, and he can do a lot of stuff that we can't. But now he set out to conquer the world, and we cannot have that.<br><br>" +
        "You are our best <b>Scheduler</b>, commander! We have fewer troops and simpler ones, so we will need your help. Already two armies of the Deadlock Empire are approaching our border keeps. They are poorly equipped and poorly trained, however. You might be able to desync them and break their morale.</div>" +
        "<div>If two threads enter a critical section at the same time, the program is not thread-safe and thus you win the challenge. The <i>while</i> loop at the beginning is called a <i>guard</i> - it prevents execution from continuing into a critical section under certain conditions. However, this here is a weak guard. After you pass it in one thread, if you stop at the right time, you will be able to pass it in the other thread, too.</div>",
        "<div class='story-outro'>You've done it, Scheduler! The armies have broken apart and our soldiers are driving them back. But do not grow complacent - this is merely the beginning of a war - <b>The Great Concurrency War</b> - and we <i>will</i>  win it!</div><div>Congratulations!</div>",
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
            ], "First Army"),
            new Thread([
                new WhileInstruction(new LiteralExpression(true), "eternal"),

                new WhileInstruction(new InequalityExpression(new VariableExpression("flag"), new LiteralExpression(false)), "while"),
                new EmptyStatement(),
                new EndWhileInstruction("while"),

                createAssignment("flag", new LiteralExpression(true)),

                new CriticalSectionInstruction(),

                createAssignment("flag", new LiteralExpression(false)),

                new EndWhileInstruction("eternal")
            ], "Second Army")
        ],
        {
            "flag" : new BooleanVariable("flag", false)
        }
    ),
    "3-simpleCounter" : new Level(
        "3-simpleCounter",
        "Simple Counter",
        "Is the Deadlock Empire stupid?",
        "<div class='story-intro'>The Parallel Wizard, leader of the Deadlock Empire, has unleashed the first Dragons upon you - these are terrifying creatures but for some reason, these two dragons appear to have critical weakspots specifically designed to be weak. Maybe you can exploit that, Scheduler.</div> <div>Here also you must make both threads enter the critical section.<br>If you'd like to reset the counter, use the orange <span class='tutorial-button-mock'>Reset level</span> button on the right.</div>",
        "<div class='story-outro'>Yes, the dragons are both defeated! But we have just received news that the Empire is sending more of their monsters at your towns. You can't be everywhere, Scheduler, and we win wherever you go, but you should know that each passing hour more villages fall to the dread Empire.</div>" +
        "As you have seen previously, once you pass a test, such as an integer comparison, you don't care about what other threads do to the operands - you have already passed the test and may continue to the critical section. To fix this program, locks would be needed.",
        [
            new Thread([
                new WhileInstruction(new LiteralExpression(true), "while"),
                createIncrement("counter"),
                new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(5)), "if"),
                new CriticalSectionInstruction(),
                new EndIfInstruction("if"),
                new EndWhileInstruction("while")
            ], "Five-Headed Dragon"),
            new Thread([
                new WhileInstruction(new LiteralExpression(true), "while"),
                createIncrement("counter"),
                new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(3)), "if"),
                new CriticalSectionInstruction(),
                new EndIfInstruction("if"),
                new EndWhileInstruction("while")
            ], "Three-Headed Dragon")
        ],
        {
            "counter": new IntegerVariable("counter", 0)
        }
    ),
    "4-confusedCounter" : new Level(
        "4-confusedCounter",
        "Confused Counter",
        "Could it be that some instructions are hidden from sight?",
        "<div class='story-intro'>The Parallel Wizard is now more cunning and the dragons he designs and the armies he trains are more resilient than ever. But still they must be defeated, or else the entire world will fall to the Empire and we will all be forced to learn parallel programming!</div>Could it be that some instructions are hidden from sight?<br><br>Most instructions are <i>not</i> atomic. That means that context may switch during the instruction's execution. For assignments, for example, it means that the expression may be read into registers of a thread, but then context may switch and when the thread receives priority again, it won't read the expression again, it will simply write the register into the left-hand variable.<br><br>To win this level, you must <b>execute</b> the <i>failure instruction</i>. It represents a point in the program that should never be executed normally.",
        "<div class='story-outro'>And yet again the Wizard's tactics have been foiled! Hurray for simplicity!</div>",
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
                createIncrement("second")
            ])
        ],
        {
            "first": new IntegerVariable("first", 0),
            "second": new IntegerVariable("second", 0)
        }
    ),
    "5-peterson": new Level(
        "5-peterson",
        "Three-way Peterson's Algorithm",
        "This riddle is rather fiendish.",
        "The <a href='https://en.wikipedia.org/wiki/Peterson%27s_algorithm'>Peterson's Algorithm</a> is the best known way for 2 threads to synchronize without the use of any synchronization primitives except for atomic value read and atomic value write. However, does a straightforward generalization for multiple threads work?<br><br>(Hint: It doesn't. You won't be able to break this algorithm. However, note that the threads are forced to cycle. If one thread stops cooperating and does not want to enter the critical section anymore, the remaining two threads will be stuck in infinite loops, waiting.)",
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
                    ),
                    "\n         "
                ), "wait"),
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
                    ),
                    "\n         "
                ), "wait"),
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
                    ),
                    "\n         "
                ), "wait"),
                new EmptyStatement(),
                new EndWhileInstruction("wait"),
                new CriticalSectionInstruction(),
                createAssignment("flag3", new LiteralExpression(false)),
                new EndWhileInstruction("eternal")
            ])

        ],
        {
            "flag1" : new BooleanVariable("flag1", false),
            "flag2" : new BooleanVariable("flag2", false),
            "flag3" : new BooleanVariable("flag3", false),
            "turn" : new IntegerVariable("turn", 2)
        }
    ),
    "L1-lock": new Level(
        "L1-lock",
        "Insufficient Lock",
        "Locks don't solve everything.",
        "<div class='story-intro'>The Deadlock Empire strikes again, and in force!<br><br>" +
        "Their dragons still have critical sections where they are weak, but this time, they have brought armored locks to hide them from us. Our artillery is not powerful enough to punch through this armor or to defeat the dragons without exploiting the critical sections. It falls upon you, Scheduler, to reveal to us a way to access the critical sections, even under the armored locks.</div>" +
        "<i>Locks</i> (or <i>mutexes</i>, from <i>mut</i>ual <i>ex</i>clusion) disallow more threads from running some code at the same time. At any point in time, a lock is either <i>locked</i> (or <i>held</i>) by one thread, or it's <i>unlocked</i>. Locks have two basic operations: <i>locking</i> and <i>unlocking</i>.<br><br>" +
        "When thread X tries to <i>lock</i> an unlocked lock L, the lock is granted to X and nobody else can lock L again until X <i>unlocks</i> it. " +
        "On the other hand, if L is already held by another thread Y, X cannot obtain the lock L. You can usually choose what happens then: common options are <i>\"block until Y releases L and retry\"</i>, <i>\"try to lock L immediately, fail if L is locked\"</i>, and <i>\"wait for Y to unlock L, but give up after a timeout period\"</i>. <br><br>" +
        "You might wonder why do we need the <i>\"block until Y releases L and retry\"</i> option: you could accomplish something similar by using <i>\"try to lock immediately\"</i> in a loop: <code>while (!locked) { if (TryLock(obj) { break; } }</code>. (This pattern is called a <i>spinlock</i>.) The problem with this loop is that it <i>actively waits</i>. If you let this loop run for 1 second without letting the thread that holds the lock progress, it will just keep reentering the loop, without any hope of progress until the lock is released (by another thread). Basically, the computer just burns CPU cycles when it runs this code. The option that blocks until we manage to grab the lock tells the runtime: \"We can't go on until this other thread releases this lock, so don't even schedule us until that happens.\"<br><br>" +
        "If more threads are waiting on the same lock, one of them will lock it when it unlocks, but you can't make any assumptions about which one will win.<br><br>" +
        "In C# (unlike, for example, C++), there is no designated type for locks. Instead, all <code>object</code>s (including any classes) can act as locks and can be locked and unlocked via the <a href='https://msdn.microsoft.com/en-us/library/system.threading.monitor.aspx'>System.Threading.Monitor</a> static class.<br><br>" +
        "For our purposes, we will only need <code>Monitor.Enter(obj)</code>, which locks <code>obj</code> (or waits until it unlocks and retries) and <code>Monitor.Exit(obj)</code>, which unlocks it. C# <code>Monitor</code>s are a cross between <i>locks</i> and <i>condition variables</i> (which you shall conquer later).<br><br>" +
        "Finally, a lot of C# code just uses a simple pattern of locking provided by the <code>lock</code> statement, which handles most common cases nicely and is easier than fiddling with <code>Monitor</code>. <code>lock (obj) { ... }</code> is translated by the compiler to a <code>Monitor.Enter</code>/<code>Exit</code> pair on <code>obj</code>. As a bonus, it also properly handles exceptions. It's easy to forget this when you use <code>Monitor</code> directly: if anything between <code>Enter</code> and <code>Exit</code> throws an exception and the lock is not released by an exception handler (e.g., in a <code>finally</code> block), it forever remains locked by the thread which threw the exception, which is not good.<br><br>" +
        "Have a look at the <a href='https://msdn.microsoft.com/en-us/library/c5kehkcz.aspx'>documentation for the lock statement</a> if you'd like to know more.<br><br>Play with these two threads. See what happens when you lock the lock in one thread and try to lock it again in another one?" +
        "",
        "<div class='story-outro'>As soon as you revealed to us the way to get under the lock armor, our mages let out a volley of cold fire against the dragons. We slaughtered them and as the dragons fell, the invading army retreated.</div>" +
        "Locks are the most commonly used synchronization primitive. It is very useful to know them.",
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
            "mutex": new ObjectVariable("mutex", "unimportant"),
            "i": new IntegerVariable("i", 0)
        }
    ),
    "L2-deadlock": new Level(
        "L2-deadlock",
        "Deadlock",
        "Stop the Empire army in its tracks!",
        "<div class='story-intro'>Encouraged by your victory against the armored dragons, you move on to the Refactor Lands, a critical territory where the Deadlock Empire is always trying to recruit more towns to convert to their paradigms. Even now, they are moving a great army to this territory in the hope of intimidating developers to accept their teachings. This must not be allowed to happen.</div>A '<a href='http://en.wikipedia.org/wiki/Deadlock' target='_blank'>deadlock</a>' is a scenario where all threads in the program wait for each other to release some resource (usually locks). None of them is willing to concede a resource before the other ones and thus the program is stuck - forever waiting for locks which will never be released. In this game, if you cause a deadlock to occur, you win the challenge immediately.",
        "<div class='story-outro'>Today you have scored an important victory! Not only are the armies blocked from moving forward but the people of Refactor Lands have seen the problems that come with parallel programming and praise you and say they will gladly stay with a sequentialist design. Now only one thing remains to be done here - plant a flag atop the local hill.</div>This was the most simple deadlock scenario - two threads mutually waiting for each other, because each was stuck on a different lock. Congratulations all the same for solving it!<br>" +
        "To avoid deadlocks in your programs, be very dilligent whenever you grab multiple locks. If two threads need the same locks, locking and unlocking them in the same order in both threads is one way to avoid deadlocking the two threads.",
        [
            new Thread([
                new MonitorEnterInstruction("mutex"),
                new MonitorEnterInstruction("mutex2"),
                new CriticalSectionInstruction(),
                new MonitorExitInstruction("mutex"),
                new MonitorExitInstruction("mutex2")
            ]),
            new Thread([
                new MonitorEnterInstruction("mutex2"),
                new MonitorEnterInstruction("mutex"),
                new CriticalSectionInstruction(),
                new MonitorExitInstruction("mutex2"),
                new MonitorExitInstruction("mutex")
            ])
        ],
        {
            "mutex" : new ObjectVariable("mutex", "unimportant"),
            "mutex2" : new ObjectVariable("mutex2", "unimportant")
        }
    ),
    "L3-complexer": new Level(
        "L3-complexer",
        "A More Complex Thread",
        "Three locks, two threads, one flag.",
        "<span class='story-intro'>You look up the Refactor Lands hill at the lone flag that shows who controls this important territory. You climb fast - you must reach it first. Unfortunately, that won't happen - not one, not two, but three enemy armies are closing in on the hill and they will all reach the flag before you do. You must do something about this, stop them somehow, if you are to claim this territory and save the poor people of Refactor Lands the trouble of changing paradigms.</span><br><br>" +
        "This may appear difficult at first. There's a lot of locks, a boolean flag and critical sections. The code is not very readable and an error could be anywhere. In fact, it wouldn't surprise us if you found a solution to this challenge different from what we thought of when creating it. You should definitely write more concise and understandable code than this.<br><br>" +
        "Even so, you might use this advice: In C#, locks can be locked recursively. For example, a thread can <i>lock</i> (via <i>Monitor.Enter</i>) a single object multiple times. In order to release the lock on that object and permit other threads to lock it, <i>all</i> of the locks must be released, i.e. the method <i>Monitor.Exit</i> must be called the same number of times as <i>Monitor.Enter</i>.<br><br>" +
        "You did not encounter <code><a href='https://msdn.microsoft.com/en-us/library/system.threading.monitor.tryenter'>Monitor.TryEnter()</a></code> yet. It does exactly what it says on the tin: it tries to lock a lock if possible. If the lock is unlocked, it locks it and returns <code>true</code>. Otherwise, the lock remains locked by its owner and the method returns <code>false</code>.<br><br>",
        "<span class='story-outro'>You replace the neutral flag with the sign of the Sequentialists. You have won. Smiling, you look down from the hill at the three armies locked in place - neither able to move. Once again, you have proven the uselessness of parallelism.</span><br><br>The <b><a href='https://msdn.microsoft.com/en-us/library/system.threading.monitor.tryenter'>Monitor.TryEnter()</a></b> method, if successful, also locks the mutex and in C#, objects can be locked recursively. In order for a lock to be released, it must be <i>exited</i> the same number of times it was <i>entered</i>. In this game, you saw that there is no matching <i>Monitor.Exit()</i> call to the <i>.TryEnter()</i> call and thus the first thread was able to lock the object, recursively, many times, making it impossible for the second thread to lock it.",
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
            "mutex" : new ObjectVariable("mutex"),
            "mutex2" : new ObjectVariable("mutex2"),
            "mutex3" : new ObjectVariable("mutex3"),
            "flag": new BooleanVariable("flag", false)
        }
    ),
    "S1-simple" : new Level(
        "S1-simple",
        "Semaphores",
        "A semaphore is a simple synchronization primitive.",
        "<div class='story-intro'>You behold the Factory Lands of the Deadlock Empire. You are almost in awe. Everything runs smoothly and efficiently, all factories producing new materials at the same time without unnecessary delays, everything manned by thousands of workers. Cooperation. But there are weaknesses - it may be efficient but it is unstable. A single mistake - anywhere - can bring entire factories down. You take one look at the fearsome mechanical dragons leaving the factories on numerous conveyor bolts and your determination is sealed. You will destroy this land.</div>" +
        "<a href='https://msdn.microsoft.com/en-us/library/system.threading.semaphoreslim(v=vs.110).aspx'>Semaphores</a> limit the number of threads that can access a resource at the same time. In C#, they are implemented by the SemaphoreSlim class." +
        "You can imagine a semaphore as a stack of coins. When a thread wants to access the resource protected by the semaphore, it needs to take a coin. Once it's done, it returns the coin to the stack.<br>" +
        "To take a coin, you can call the <code><a href='https://msdn.microsoft.com/en-us/library/dd270787(v=vs.110).aspx'>Wait()</a></code> method on the semaphore. If there are no coins on the stack, the method waits until someone returns a coin. If you don't want to wait forever, you can pass it how long should it wait, in milliseconds. In that case, <code>Wait()</code> will return a boolean indicating whether it obtained a coin.<br>" +
        "The <code><a href='https://msdn.microsoft.com/en-us/library/dd235727(v=vs.110).aspx'>Release()</a></code> method adds a coin on the stack. Normally, you would call <code>Release()</code> only after a <code>Wait()</code> - you would take a coin, do something while you have it, and then give it back. However, you can also call <code>Release()</code> while you don't have any coins yourself. If you let Thread 1 run, you will see it do this: if it can't find a coin within 500 milliseconds, it will create a new one.<br><br>" +
        "The two threads below try to use a semaphore to ensure they don't enter the critical section at the same time. Can you figure out what are they doing wrong?",
        "<div class='story-outro'>A few factories stopped but the Parallel Wizard is hard at work repairing them. You must move on and act quickly to capitalize on this.</div>",
        [
            new Thread([
                createOuterWhile(),
                new SemaphoreWaitInstruction("semaphore"),
                new CriticalSectionInstruction(),
                new SemaphoreReleaseInstruction("semaphore"),
                createOuterWhileEnd()
            ]),
            new Thread([
                createOuterWhile(),
                new IfLongInstruction(new SemaphoreTryWaitExpression("semaphore"), "if"),
                new CriticalSectionInstruction(),
                new SemaphoreReleaseInstruction("semaphore"),
                new ElseInstruction("if"),
                new SemaphoreReleaseInstruction("semaphore"),
                new EndIfLongInstruction("if"),
                createOuterWhileEnd()
            ])
        ],
        {
            "semaphore" : new SemaphoreVariable("semaphore", 0)
        }
    ),
    "S2-producerConsumer" : new Level(
        "S2-producerConsumer",
        "Producer-Consumer",
        "A new victory condition awaits you!",
        "<div class='story-intro'>You pick your target - one dragon-producing factory is sending its creations directly into an armory that outfits the machines with destructive weapons. If you disrupt this supply line, you will greatly reduce the number of dragons at the Empire's disposal.</div>" +
        "In <a href='https://en.wikipedia.org/wiki/Producer–consumer_problem'>producer-consumer scenarios</a>, one thread produces some items that another thread consumes. " +
        "For example, one thread could accept work requests from a user, and another thread could take outstanding requests and fulfill them.<br>" +
        "Even through the producer-consumer problem might look trivial, it has some subtle complexity to it. For example, what if the consumer needs a lot of time to consume one item, while the producer produces items as fast as it can? We could run out of memory.<br>" +
        'Semaphores are useful for producer-consumer problems. Remember the "coin stack" analogy: each item in the queue is represented by a coin; when the producer produces a new one, it adds a coin, and when the consumer consumes an item, it removes a coin.<br><br>' +
        "In this challenge, your goal is cause an exception to be raised.<br>",
        "<div class='story-outro'>Alarms sound over the lands but you hear only the sweet sound of victory. Soon, the Sequentialists will win and everything will happen in order, as was meant to be.</div>" +
        "Admittedly, this was not an extremely difficult producer-consumer pattern to exploit but you performed quite well nonetheless.",
        [
            new Thread([
                createOuterWhile(),
                new IfLongInstruction(new SemaphoreTryWaitExpression("semaphore"), "if"),
                createDequeueUnsafe("queue"),
                new ElseInstruction("if"),
                new CommentInstruction("Nothing in the queue."),
                new EndIfLongInstruction("if"),
                createOuterWhileEnd()
            ]),
            new Thread([
                createOuterWhile(),
                new SemaphoreReleaseInstruction("semaphore"),
                createEnqueueUnsafe("queue", LanguageDependentConstruction("Dragon")),
                createOuterWhileEnd()
            ])
        ]
        ,
        {
            "semaphore" : new ManualResetEventVariable("semaphore", 0),
            "queue" : new QueueVariable("queue", new ObjectType("Dragon"), 0)
        }
    ),
    "S3-producerConsumer" : new Level(
        "S3-producerConsumer",
        "Producer-Consumer (variant)",
        "The victory conditions just keep coming!",
        "<div class='story-intro'>Only one factory line remains. If you disrupt this, the entire land will be swept clean and the Empire will have lost all production.</div>" +
        "For this challenge, it will be useful to know that most library methods are not thread-safe and if two threads enter an unsafe method on the same object simultaneously, strange things may happen. Things that result in your victory.",
        "<div class='story-outro'>Congratulations, Scheduler! The Empire's economy is in shambles.</div>Are you ready for the next challenge?",
        [
            new Thread([
                createOuterWhile(),
                createEnqueueUnsafe("queue", LanguageDependentConstruction("Golem")),
                createOuterWhileEnd()
            ], "The Producer"),
            new Thread([
                createOuterWhile(),
                new IfInstruction(new QueueNotEmptyExpression("queue"), "if"),
                createDequeueUnsafe("queue"),
                new EndIfInstruction("if"),
                createOuterWhileEnd()
            ], "The Consumer")
        ],
        {
            "queue" : new QueueVariable("queue", new ObjectType("Golem"), 0)
        }
    ),
    "CV1-simple": new Level(
        "CV1-simple",
        "Condition Variables",
        "Don't worry. It's not <i>that</i> hard.",
        "Condition variables are, unfortunately, still a rather difficult topic. We won't even try to get you a confusing story here, they're just hard. Try. If you fail, skip.",
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
            "mutex" : new ObjectVariable("mutex", "unimportant"),
            "queue" : new QueueVariable("queue", new IntegerType(), 0)
        }
    )
};
