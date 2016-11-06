var ManualResetEventSet = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "Set"));
    this.tooltip = "Atomic. Sets the state of the ManualResetEventSlim to \"signaled\" which causes its Wait() method to no longer be blocking.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        mres.value = true;
        moveToNextInstruction(threadState);
    }
};
var ManualResetEventReset = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "Reset"));
    this.tooltip = "Atomic. Sets the state of the ManualResetEventSlim to \"nonsignaled\" which causes its Wait() method to become blocking.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        mres.value = false;
        moveToNextInstruction(threadState);
    }
};
var ManualResetEventWait = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "Wait"));
    this.tooltip = "Atomic. Blocks until the ManualResetEventSlim's state is set to 'signaled'.";
    this.isBlocking = function(threadState, globalState) {
        var mres = globalState[name];
        if (!mres.value) {
            return "Waiting for signal (<code>" + LanguageDependentIdentifierCapitalisation(name) + ".Set()</code>)";
        }
        return false;
    };
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    }
};
var CountdownEventSignal = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "Signal"));
    this.tooltip = "Atomic. Decrements the CountdownEvent's countdown timer by one. Throws an exception if the timer is already at zero.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        if (mres.value == 0) {
            win("An InvalidOperationException was thrown.<br>(attempted to decrement a countdown timer below zero)");
            return;
        }
        mres.value--;
        moveToNextInstruction(threadState);
    }
};
var CountdownEventWait = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "Wait"));
    this.tooltip = "Atomic. Blocks until the CountdownEvent's countdown timer reaches zero.";
    this.isBlocking = function(threadState, globalState) {
        var mres = globalState[name];
        if (mres.value == 0) {
            return false;
        }
        return "Waiting until <code>" + LanguageDependentIdentifierCapitalisation(name) + "</code> counts down to zero.";
    };
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    }
};

var BarrierSignalAndWait = function(name) {
    this.code = instructionCode(instanceMethodExpressionCode(name, "SignalAndWait"));
    this.tooltip = "Atomic! Blocks until all threads in arrive at the barrier, then enters a new phase - its counter is reset back to the initial number of participants.";
    this.isBlocking = function(threadState, globalState) {
        var barrier = globalState[name];
        return barrier.hasArrived && barrier.hasArrived[threadState.id];
        // TODO (sooth, elsewhere): a level attempting to implement a multiphase barrier without barrier
    };
    this.execute = function(threadState, globalState) {
        var barrier = globalState[name];
        barrier.value--;
        barrier.hasArrived[threadState.id] = true;
        if (barrier.value == 0) {
            for (var threadId in gameState.threadState) {
                var thread = gameState.threadState[threadId];
                if (barrier.hasArrived[threadId]) {
                    moveToNextInstruction(thread);
                    barrier.hasArrived[threadId] = false;
                }
            }
            barrier.phase++;
            barrier.value = barrier.numberOfParticipants;
        }
        else if (barrier.value < 0) {
            console.log("THIS MUST NEVER HAPPEN.");
        }
    }
};
