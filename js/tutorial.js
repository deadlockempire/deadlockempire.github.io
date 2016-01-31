levels["T1-Interface"] = new Level("T1-Interface",
    "Tutorial 1: Interface",
    "Click here to begin the tutorial.",
    "Welcome to <b>The Deadlock Empire</b>. dear player! You are the <b>Scheduler</b>. Before you are two threads of a parallelized computer program. Your objective here, as always, is to make sure it breaks in some way. In this tutorial, you will break it by having both threads enter the critical section at the same time.<br><br>" +
    "First, follow the tutorial hints and learn about the interface. You may refresh the page to view the hints again. Then, step through the two programs until the active instructions of both threads are on the critical section line.",
    "Well done, player! There are a few more important things you must learn before you will be able to play <b>The Deadlock Empire</b> on your own. Please move to the next tutorial challenge to learn about them.",
    [
        new Thread([
            new CommentInstruction("This is the first thread."),
            new FlavorInstruction("business_logic()"),
            new CriticalSectionInstruction(),
            new FlavorInstruction("business_logic()")
        ]),
        new Thread([
            new CommentInstruction("This is the second thread."),
            new IfInstruction(new VariableExpression("flag"), "if"),
            new CriticalSectionInstruction(),
            new EndIfInstruction("if")
        ])
    ],
    {
        "flag" : {
            name : "flag",
            type : "System.Boolean",
            value : true
        }
    }
);
var loadTutorial1 = function() {
    $("h1").attr("data-intro", "This game consists of <i>challenges</i>. Each challenge has a name. Press 'Enter' or click the button to continue.").attr("data-step", 1);
    $("#storyIntro").attr("data-intro", "Each challenge begins with a short explanation of what it's about or what you want you want to do. In short, your objective is always to break the program somehow.").attr("data-step", 2);
    $(".thread").first().attr("data-intro", "This is one of the two threads that compose the program. Note that each thread has its own 'Step' button.").attr("data-step", 4);
    $(".current-instruction").first().attr("data-intro", "The left thread is about to execute this \"instruction\" (a comment, really).").attr("data-step", 5);
    $(".stepforwards").first().attr("data-intro", "Press this button to advance the corresponding thread by one instruction forwards.").attr("data-step", 6);
    $(".undobutton").first().attr("data-intro", "In case you make a mistake, you can click 'Undo' to return one step backwards.").attr("data-step", 7);
    $(".global-state").first().attr("data-intro", "The program also contains global (static) variables which are displayed here.").attr("data-step", 8);
    $("#instruction-0-2").add("#instruction-1-2").attr("data-intro", "In this level, your objective is to step through the programs in such an order that both critical sections are \"active instructions\" at the same time.<br><br>Good luck!").attr("data-step", 9);
    var intro = introJs();
    intro.onhintclose(function (stepid) {
        console.log('hint closed', stepId);
    });
    intro.start();
}