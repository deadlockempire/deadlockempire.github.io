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
        "sync" : {
            name : "sync",
            type : "System.Threading.ManualResetEventSlim",
            value : false
        }
    }
);
// TODO (sooth): huh, how is countdownEvent different from barrier? is it superseded?
levels["H2-CountdownEvent"] = new Level(
  "H2-CountdownEvent",
  "Countdown Event",
  "Introduces the CountdownEvent class HUH",
    "INTRO",
    "OUTRO",
    [

    ],
    {

    }
);
