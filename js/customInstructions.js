var MinorBecomesInconsistent = function(queue) {
    this.code = queue + " enters an inconsistent state.";
    this.execute = function (threadState, globalState) {
        if (globalState[queue].inconsistent) {
            win("Two threads entered a non-thread-safe function at the same time.");
        } else {

        }
        globalState[queue].inconsistent = true;
    };
};
var MinorEnqueue = function(queue) {
    this.code = queue + " gains a new element.";
    this.execute = function (threadState, globalState) {
        globalState[queue].value++;
    };
};
var MinorBecomesConsistent = function(queue) {
    this.code = queue + " returns to a consistent state.";
    this.execute = function (threadState, globalState) {
        globalState[queue].inconsistent = false;
    };
};
var createEnqueueUnsafe = function(queue, number) {
    var minorInstructions = [
        new MinorBecomesInconsistent(queue),
        new MinorEnqueue(queue),
        new MinorBecomesConsistent(queue)
    ];
    var v = new ExpandableInstruction(queue + ".Enqueue(" + number + ")");
    v.tooltip = "[Expandable] Adds an object to the end of the queue. This operation is not atomic nor thread-safe.";
    return v;
};