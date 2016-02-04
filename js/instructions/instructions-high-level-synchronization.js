var ManualResetEventSet = function(name) {
    this.code = name + ".Set();";
    this.tooltip = "Atomic. Sets the state of the ManualResetEventSlim to \"signaled\" which causes its Wait() method to no longer be blocking.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        mres.value = true;
        moveToNextInstruction(threadState);
    }
};
var ManualResetEventReset = function(name) {
    this.code = name + ".Reset();";
    this.tooltip = "Atomic. Sets the state of the ManualResetEventSlim to \"nonsignaled\" which causes its Wait() method to become blocking.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        mres.value = false;
        moveToNextInstruction(threadState);
    }
};
// TODO (sooth, elsewhere): improve the UI display of global state for complex types
var ManualResetEventWait = function(name) {
    this.code = name + ".Wait();";
    this.tooltip = "Atomic. Blocks until the ManualResetEventSlim's state is set to 'signaled'.";
    this.isBlocking = function(threadState, globalState) {
        var mres = globalState[name];
	if (!mres.value) {
		return false;
	}
	return "Waiting for signal (<code>" + name + ".Set()</code>)";
    };
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    }
};
var CountdownEventSignal = function(name) {
    this.code = name + ".Signal();";
    this.tooltip = "Atomic. Decrements the CountdownEvent's countdown timer by one. Throws an exception if the timer is already at zero.";
    this.execute = function(threadState, globalState) {
        var mres = globalState[name];
        if (mres.value == 0) {
            win("An InvalidOperationException was thrown because you attempted to decrement a countdown timer below zero.");
            return;
        }
        mres.value--;
        moveToNextInstruction(threadState);
    }
};
var CountdownEventWait = function(name) {
    this.code = name + ".Wait();";
    this.tooltip = "Atomic. Blocks until the CountdownEvent's countdown timer reaches zero.";
    this.isBlocking = function(threadState, globalState) {
        var mres = globalState[name];
	if (mres.value == 0) {
		return false;
	}
	return "Waiting until <code>" + name + "</code> counts down to zero.";
    };
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    }
};
