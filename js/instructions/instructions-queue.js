var MinorBecomesInconsistent = function(queue) {
    this.code = queue + " enters an inconsistent state.";
    this.tooltip = "The queue's invariants cease to apply. Any call (in another thread) to an Enqueue or Dequeue method on this queue will break the program.";
    this.execute = function (threadState, globalState) {
        if (globalState[queue].inconsistent) {
            win("Two threads entered a non-thread-safe function at the same time.");
        } else {

        }
        globalState[queue].inconsistent = true;
        moveToNextInstruction(threadState);
    };
};
var MinorEnqueue = function(queue) {
    this.code = queue + " gains a new element.";
    this.tooltip = "Increments the number of elements in the queue.";
    this.execute = function (threadState, globalState) {
        globalState[queue].value++;
        moveToNextInstruction(threadState);
    };
};
var MinorDequeue = function(queue) {
    this.code = queue + " loses an element.";
    this.tooltip = "Decrements the number of elements in the queue. If it falls below zero, an exception is thrown.";
    this.execute = function (threadState, globalState) {
        if (globalState[queue].value <= 0) {
            win("An InvalidOperationException was thrown.<br>(trying to read from an empty queue)")
        }
        else {
            globalState[queue].value--;
            moveToNextInstruction(threadState);
        }
    };
};
var QueueNotEmptyExpression = function(queue) {
    var expression = new GreaterThanExpression(new VariableExpression(instanceMemberExpressionCode(queue, "Count")), new LiteralExpression(0));
    this.code = expression.code;
    this.tooltip = "Returns true if the queue is not empty.";
    this.evaluate = function (threadState, globalState) {
      if (globalState[queue].value > 0) {
          return true;
      }  else {
          return false;
      }
    };
};
var QueueIsEmptyExpression = function(queue) {
    var expression = new EqualityExpression(new VariableExpression(instanceMemberExpressionCode(queue, "Count")), new LiteralExpression(0));
    this.code = expression.code;
    this.tooltip = "Returns true if the queue is empty.";
    this.evaluate = function (threadState, globalState) {
        if (globalState[queue].value == 0) {
            return true;
        }  else {
            return false;
        }
    };
};
var MinorBecomesConsistent = function(queue) {
    this.code = queue + " returns to a consistent state.";
    this.tooltip = "The queue's invariants start to apply again. Calling further Enqueue and Dequeue methods after this instruction does not break safety.";
    this.execute = function (threadState, globalState) {
        globalState[queue].inconsistent = false;
        moveToNextInstruction(threadState);
    };
};
var createEnqueueUnsafe = function(queue, item) {
    var minorInstructions = [
        new MinorBecomesInconsistent(queue),
        new MinorEnqueue(queue),
        new MinorBecomesConsistent(queue)
    ];

    var v = new ExpandableInstruction(instanceMethodExpressionCode(queue, "Enqueue", item), minorInstructions);
    v.tooltip = "[Expandable] Adds an object to the end of the queue. This operation is not atomic nor thread-safe.";
    return v;
};
var createDequeueUnsafe = function(queue) {
    var minorInstructions = [
        new MinorBecomesInconsistent(queue),
        new MinorDequeue(queue),
        new MinorBecomesConsistent(queue)
    ];
    var v = new ExpandableInstruction(instanceMethodExpressionCode(queue, "Dequeue"), minorInstructions);
    v.tooltip = "[Expandable] Removes an object from the front of the queue. Raises an exception if the queue is empty. This operation is not atomic nor thread-safe.";
    return v;
};
