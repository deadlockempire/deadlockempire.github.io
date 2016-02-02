levels["D1-Dragonfire"] = new Level("D1-Dragonfire",
    "Dragonfire",
    "Withstand the onslaught of the Parallel Wizard's legions!",
    "You look upon the field of battle. It is not going well.<br><br>" +
    "Your nemesis, the Parallel Wizard, supreme sovereign of the Deadlock Empire, controls armies of minions and even now they are marching through the plains to siege your cities and lay waste to your lands. Your army is powerful as well, but there is one creature it cannot face. It's the Wizard's greatest warrior - the mechanical dragon! Your soldiers cannot withstand its scorching fire!<br><br>" +
    "But the dragon is merely a creature of artifice. You cannot reprogram it, but you can affect it. If you could somehow find its weakspot, or perhaps a critical section of some kind, it would be a great victory for the forces of Sequentiality.",
    "Well done, commander!<br><br>" +
    "The dragon breathed out its last fireball, for the discord you sowed in its two heads was too much. Its critical section exploded and the dragon collapsed on the ground, crushing dozens of the Parallel Wizard's minions in the process. You have scored a great victory. Your soldiers cheered for your success and with raised spirits threw themselves into battle once more. The enemy forces faltered.<br><br>" +
    "But then, a catastrophe! Another dragon appeared on the horizon, and on its back, a fearsome sorcerer. Can you defeat them in the next challenge? You must - because if you don't, all that is simple in the world will soon exist no more.",
    [
        new Thread([
            createOuterWhile(),
            new MonitorEnterInstruction("firebreathing"),
            new FlavorInstruction("incinerate_enemies()"),
            new IfInstruction(new SemaphoreTryWaitExpression("fireball"), "if"),
            new CommentInstruction("Swoosh!"),
            new FlavorInstruction("blast_enemies()"),
            new CommentInstruction("Uh... that was tiring."),
            new CommentInstruction("I'd better rest while I'm vulnerable..."),
            new SemaphoreWaitInstruction("fireball"),
            new SemaphoreWaitInstruction("fireball"),
            new CriticalSectionInstruction(),
            createAssignment("c", new LiteralExpression(0)),
            new CommentInstruction("Safe now..."),
            new EndIfInstruction("if"),
            createAssignment("c", new SubtractionExpression(new VariableExpression("c"), new LiteralExpression(1))),
            createAssignment("c", new AdditionExpression(new VariableExpression("c"), new LiteralExpression(1))),
            new MonitorExitInstruction("firebreathing"),
            createOuterWhileEnd()
        ]),
        new Thread([
            new CommentInstruction("This is stupid."),
            new CommentInstruction("The other head gets all the cool toys,"),
            new CommentInstruction("...and I get stuck recharging."),
            createOuterWhile(),
            new IfLongInstruction(new LessThanExpression(new VariableExpression("c"), new LiteralExpression(2)), "if"),
            new CommentInstruction("Dis gonna be good."),
            new SemaphoreReleaseInstruction("fireball"),
            createIncrement("c"),
            new ElseInstruction("if"),
            new CommentInstruction("I hate being in here."),
            new CriticalSectionInstruction(),
            new EndIfLongInstruction("if"),
            /*
             new MonitorEnterInstruction("firebreathing"),
             new FlavorInstruction("scorch_a_single_villager()"),
             new MonitorExitInstruction("firebreathing"),
             */
            createOuterWhileEnd()

        ])
    ],
    {
        "firebreathing": {
            name: "firebreathing",
            type: "System.Object",
            value: "awesome power"
        },
        "fireball": {
            name: "fireball",
            type: "System.Threading.SemaphoreSlim",
            value: 0
        },
        "c": {
            name: "c",
            type: "System.Int32",
            value: 0
        }
    }
);
levels["D2-Sorcerer"] = new Level(
    "D2-Sorcerer",
    "Triple Danger",
    "You face not only a two-headed dragon, but a sorcerer as well!",
    "As you were celebrating your victory, a new enemy appeared on the field of battle - a sorcerer riding a fearsome dragon. This one was even more terrifying than the last. The sorcerer calls upon magical energy from the lands and feeds it to the dragon. And this new dragon - it has no critical sections.<br><br>" +
    "Energized by the sorcerer's mana, the dragon launches fireballs left and right, devastating the Sequentialist army. The other head casts terrible lightning bolts targetting your most courageous captains.<br><br>" +
    "You must eliminate this new threat soon or all will be lost - but how can you win?",
    "The dragon is in utter confusion. Its head keep arguing over who should have priority on receiving mana and tear each other apart. Without the heads, the dragons cannot keep afloat and crashes right on top of an enemy commander. The sorcerer dies from the fall instantly.<br><br>" +
    "Such success greatly bolsters your army's morale. They catch a second wind and charge the enemy who calls retreat immediately. You have won this battle, Commander Scheduler, and your subordinates are grateful.<br><br>" +
    "And now, the time has come to take the battle to the enemy - to fight the Parallel Wizard in his own land!",
    [
        new Thread([
            new CommentInstruction("Sorcerer"),
            createOuterWhile(),
            new MonitorEnterInstruction("conduit"),
            new CommentInstruction("I summon mana for you, dragon!"),
            new CommentInstruction("Incinerate the enemies!"),
            createEnqueueUnsafe("energyBursts", "new EnergyBurst()"),
            new MonitorExitInstruction("conduit"),
            createOuterWhileEnd()
        ]), new Thread([
            new CommentInstruction("Dragon Head (Left)"),
            createOuterWhile(),
            new IfInstruction(new QueueNotEmptyExpression("energyBursts"), "if"),
            new MonitorEnterInstruction("conduit"),
            createDequeueUnsafe("energyBursts"),
            new FlavorInstruction("lightning_bolts(terrifying: true)"),
            new MonitorExitInstruction("conduit"),
            new EndIfInstruction("if"),
            createOuterWhileEnd()
        ]), new Thread([
            new CommentInstruction("Dragon Head (Right)"),
            createOuterWhile(),
            new IfInstruction(new QueueNotEmptyExpression("energyBursts"), "if"),
            new MonitorEnterInstruction("conduit"),
            createDequeueUnsafe("energyBursts"),
            new FlavorInstruction("fireball(mighty: true)"),
            new MonitorExitInstruction("conduit"),
            new EndIfInstruction("if"),
            createOuterWhileEnd()
        ])
    ],
    {
        "conduit": {
            name: "conduit",
            type: "System.Object",
            value: "magical power"
        },
        "energyBursts": {
            name: "energyBursts",
            type: "System.Queue<EnergyBurst>",
            value: 3
        }
    }
);
levels["D4-Boss"] = new Level(
    'D4-Boss',
    "Boss Fight",
    "This is it. The final duel between the Master Scheduler and the Parallel Wizard.",
    "You defeated the Parallel Wizard's armies in battle and now you finally stand in front of the doors of his massive fortress. The time has come to end this war.<br><br>" +
    "The Parallel Wizard is clever in his defenses, however, and keeps his only weakness in his inner sanctum inside the fortress. To reach inside, you will need to adopt some of his underhanded tactics. It is a pity that a Sequentialist commander must resort to concurrent tricks to defeat this foe but such is reality.<br><br>" +
    "You reluctantly cast the spell that splits your spirit in two. And then you both enter the fortress...",
    "In the end... victory!<br><br>" +
    "The Parallel Wizard is destroyed and his fortress crumbles at your feet. You have won. Never again will programmers over the world have to endure the difficulty of correct multithreaded programming because in defeating the Parallel Wizard, you have banished concurrency.<br><br>" +
    "'Although,' you wonder, 'the tricks I used were somewhat useful... and I did feel quite a bit faster when parallelized. Perhaps there is something to this whole parallelism thing.'<br><br>" +
    "Indeed, perhaps there is, commander. Perhaps parallelism is useful, after all, Master Scheduler. After all, with the skills you gained fighting The Deadlock Empire, do you doubt that you have become... an even greater Parallel Wizard?",
    [
        new Thread([
            createOuterWhile(),
            createIncrement("darkness"),
            createIncrement("evil"),
            new IfInstruction(new AndExpression(
                new InequalityExpression(
                    new VariableExpression("darkness"),
                    new LiteralExpression(2)
                ),
                new InequalityExpression(
                    new VariableExpression("evil"),
                    new LiteralExpression(2)
                )
                ), "outerif"),
            new IfInstruction(new SemaphoreTryWaitExpression("fortress"), "if"),
            new SemaphoreWaitInstruction("fortress"),
            new MonitorEnterInstruction("sanctum"),
            createMonitorWait("sanctum"),
            new CriticalSectionInstruction(),
            new MonitorExitInstruction("sanctum"),
            new EndIfInstruction("if"),
            new EndIfInstruction("outerif"),
            createOuterWhileEnd()
        ]),
        new Thread([
            createOuterWhile(),
            createIncrement("darkness"),
            createIncrement("evil"),
            new IfInstruction(new AndExpression(
                new InequalityExpression(
                    new VariableExpression("darkness"),
                    new LiteralExpression(2)
                ),
                new EqualityExpression(
                    new VariableExpression("evil"),
                    new LiteralExpression(2)
                )
            ), "outerif"),
            new MonitorEnterInstruction("sanctum"),
            new MonitorPulse("sanctum"),
            new MonitorExitInstruction("sanctum"),
            new CriticalSectionInstruction(),
            new EndIfInstruction("outerif"),
            new SemaphoreReleaseInstruction("fortress"),
            createAssignment("darkness", new LiteralExpression(0)),
            createAssignment("evil", new LiteralExpression(0)),
            createOuterWhileEnd()
        ])
    ],
    {
        "darkness" : {
            name : "darkness",
            type : "System.Int32",
            value : 0
         },
        "evil" : {
            name : "evil",
            type : "System.Int32",
            value : 0
        },
        "fortress" : {
            name : "fortress",
            type : "System.Threading.SemaphoreSlim",
            value : 0
        },
        "sanctum" : {
            name : "sanctum",
            type : "System.Object",
            value : "unimportant"
        }
    }





);

levels["D3-Gate"] = new Level(
    "D3-Gate",
    "The Parallel Gate",
    "Are you strong enough to enter the Parallel Wizard's domain?",
    "INTRO STORY",
    "END STORY",
    [

    ],
    {

    }
);