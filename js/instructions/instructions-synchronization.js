var staticCode = function(identifier) {
    return spanTag("static", identifier);
};

var staticMethodExpressionCode = function(className, methodName, parameters) {
    return dereferenceMemberCode(staticCode(className), methodName) + ParenthesisedExpressionCode(parameters);
};

var staticMonitorMethodExpressionCode = function(methodName, monitorName) {
    return staticMethodExpressionCode("Monitor", methodName, LanguageDependentIdentifierCapitalisation(monitorName));
};

var MonitorEnterInstruction = function(monitorName) {
    this.code = instructionCode(staticMonitorMethodExpressionCode("Enter", monitorName));
    this.tooltip = "Atomic. Acquires a lock. If this thread already owns this lock, the lock counter is incremented. If another thread currently owns this lock, this call blocks until the lock is released.";
    this.isBlocking = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread != null &&
            monitor.lastLockedByThread != threadState.id) {
            return "Waiting for " + gameState.getLevel().getThreadName(monitor.lastLockedByThread) + " to unlock <code>" + LanguageDependentIdentifierCapitalisation(monitorName) + "</code>.";
        } else {
            return false;
        }
    };
    this.execute = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread != null &&
            monitor.lastLockedByThread != threadState.id)
        {
            showMessage("Blocked", "This thread is blocked. Another thread owns the lock.");
        }
        else {
            monitor.lastLockedByThread = threadState.id;
            if (monitor.lockCount >= 0) {
                monitor.lockCount++;
            }
            else {
                monitor.lockCount = 1;
            }
            moveToNextInstruction(threadState);
        }
    }
};
var MonitorTryEnterExpression = function (monitorName) {
    this.code = staticMonitorMethodExpressionCode("TryEnter", monitorName);
    this.tooltip = "Atomic. Checks whether the current thread can lock the specified object. If yes, it locks the object and returns true. If no, returns false.";
    this.evaluate = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread != null &&
            monitor.lastLockedByThread != threadState.id)
        {
            return false;
        }
        else {
            monitor.lastLockedByThread = threadState.id;
            if (monitor.lockCount >= 0) {
                monitor.lockCount++;
            }
            else {
                monitor.lockCount = 1;
            }
            return true;
        }
    }
};
var MonitorExitInstruction = function(monitorName) {
    this.code = instructionCode(staticMonitorMethodExpressionCode("Exit", monitorName));
    this.tooltip = "Atomic. Releases a lock. If this thread had this locked multiple times, decrements the counter once  only. If this thread does not own this lock, an exception is thrown (and you win the level).";
    this.execute = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread == threadState.id)
        {
            monitor.lockCount--;
            console.log("released to " + monitor.lockCount);
            if (monitor.lockCount <= 0) {
                monitor.lastLockedByThread = null;
            }
        }
        else
        {
            win("A SynchronizationLockException was thrown.<br>(thread attempted to release a lock it did not have)");
        }
        moveToNextInstruction(threadState);
    }
};
var SemaphoreTryWaitExpression = function(semaphoreName) {
    this.code = instanceMethodExpressionCode(semaphoreName, "Wait", 500);
    this.tooltip = "Blocks the thread until the semaphore has a positive value or the specified timeout elapses. In the first case, it decrements the semaphore and returns true. In the second case, it returns false.<br><br>In this game, you can always step through this expression. What happens will be determined by whether the semaphore currently has a positive value.";
    this.evaluate = function(threadState, globalState) {
        if (globalState[semaphoreName].value > 0) {
            globalState[semaphoreName].value --;
            return true;
        }
        else {
            return false;
        }
    }
};
var SemaphoreWaitInstruction = function(semaphoreName) {
    this.code = instructionCode(instanceMethodExpressionCode(semaphoreName, "Wait"));
    this.tooltip = "Atomic. Attempts to decrease the semaphore counter by one. If the semaphore is already at 0, this call blocks until another thread increases the counter by calling Release().";
    this.isBlocking = function (threadState, globalState) {
        if (globalState[semaphoreName].value > 0) {
            return false;
        } else {
            return "Waiting for another thread to call <code>" + LanguageDependentIdentifierCapitalisation(semaphoreName) + ".Release()</code>.";
        }
    };
    this.execute = function(threadState, globalState) {
        if (globalState[semaphoreName].value > 0) {
            globalState[semaphoreName].value --;
            moveToNextInstruction(threadState);
        }
        else {
            showMessage("Blocked", "This thread is blocked. The semaphore counter is zero.");
        }
    }
};

var SemaphoreReleaseInstruction = function(semaphoreName) {
    this.code = instructionCode(instanceMethodExpressionCode(semaphoreName, "Release"));
    this.tooltip = "Atomic. Increments the semaphore counter by one.";
    this.execute = function(threadState, globalState) {
        globalState[semaphoreName].value ++;
        moveToNextInstruction(threadState);
    }
};

var MinorWaitIntro = function(mutexName) {

    this.execute = function(threadState, globalState) {
        var mutex = globalState[mutexName];
        if (mutex.lockCount == 0 || mutex.lastLockedByThread != threadState.id) {
            win("A SynchronizationLockException was thrown.<br>(thread called Wait while not having the lock)");
            return;
        }
        threadState.asleep = true;
        if (!mutex.waiting) mutex.waiting = [];
        mutex.waiting.push(threadState.id);
        mutex.lockCount--;
        if (mutex.lockCount <= 0) {
            mutex.lastLockedByThread = null;
        }
        moveToNextInstruction(threadState);
    };
    this.code = "release the lock, then sleep";
    this.tooltip = "Atomic. The lock is released, the thread is put into the waiting queue of the mutex and then goes to the Asleep mode.";

};

var MinorAwaitWakeUp = function(mutex) {
    this.code = "wait until woken up";
    this.execute = function(threadState) { moveToNextInstruction(threadState); };
    this.isBlocking = function(threadState) {
        if (!threadState.asleep) {
            return false;
        } else {
            return "Waiting for pulse on <code>" + LanguageDependentIdentifierCapitalisation(mutex) + "</code>.";
        }
    };
    this.tooltip = "This thread won't receive priority until it is woken up by a pulse. When the pulse arrives, you may step forwards as normal.";
};
var MinorInternalMonitorEnter = function(mutex) {
    this.isBlocking = function(threadState, globalState) {
        var monitor = globalState[mutex];
        if (monitor.lastLockedByThread != null &&
            monitor.lastLockedByThread != threadState.id) {
            return "Waiting for " + gameState.getLevel().getThreadName(monitor.lastLockedByThread) + " to unlock <code>" + LanguageDependentIdentifierCapitalisation(mutex) + "</code>.";
        } else {
            return false;
        }
    };
    this.execute = function(threadState, globalState) {
        var monitor = globalState[mutex];
        monitor.lastLockedByThread = threadState.id;
        monitor.lockCount = 1;
        moveToNextInstruction(threadState);
    };
    this.code = instructionCode(staticMonitorMethodExpressionCode("Enter", mutex));
    this.tooltip = "This thread won't receive priority until it can reacquire the lock.";
};
var createMonitorWait = function(mutex) {
    var minorInstructions = [
        new MinorWaitIntro(mutex),
        new MinorAwaitWakeUp(mutex),
        new MinorInternalMonitorEnter(mutex)
    ];
    var v = new ExpandableInstruction(staticMonitorMethodExpressionCode("Wait", mutex), minorInstructions);
    v.tooltip = "[Expandable] Releases the lock and puts the thread to sleep until it is woken up by a pulse.";
    return v;
};
var MonitorPulse = function(mutex) {
    this.code = instructionCode(staticMonitorMethodExpressionCode("Pulse", mutex));
    this.tooltip = "Sends a wake-up signal to a random thread waiting on the specified mutex, if any.";
    this.execute = function (threadState, globalState) {
        var monitor = globalState[mutex];
        if (monitor.lockCount == 0 || monitor.lastLockedByThread != threadState.id) {
            win("A SynchronizationLockException was thrown.<br>(thread called Pulse while not having the lock)");
            return;
        }
        if (!monitor.waiting) {
            monitor.waiting = [];
        }
        if (monitor.waiting.length == 0) {
            // Do nothing.
        } else {
            var sleeperId = monitor.waiting.shift();
            var sleeper = gameState.threadState[sleeperId];
            sleeper.asleep = false;
        }
        moveToNextInstruction(threadState);
    };
};
var MonitorPulseAll = function(mutex) {
    this.code = instructionCode(staticMonitorMethodExpressionCode("PulseAll", mutex));
    this.tooltip = "Sends a wake-up signal to all threads waiting on the specified mutex, if any.";
    this.execute = function (threadState, globalState) {
        var monitor = globalState[mutex];
        if (monitor.lockCount == 0 || monitor.lastLockedByThread != threadState.id) {
            win("A SynchronizationLockException was thrown.<br>(thread called PulseAll while not having the lock)");
            return;
        }
        if (!monitor.waiting) {
            monitor.waiting = [];
        }
        while (monitor.waiting.length > 0) {
            var sleeperId = monitor.waiting.shift();
            var sleeper = gameState.threadState[sleeperId];
            sleeper.asleep = false;
        }
        moveToNextInstruction(threadState);
    };
};
var InterlockedIncrement = function(name) {
    var expression = LanguageDependentInterlockedIncrement(name);
    this.code = instructionCode(expression);


    this.tooltip = "Atomic. Atomically increments the variable by 1.";
    this.execute = function (threadState, globalState) {
        globalState[name].value++;
        moveToNextInstruction(threadState);
    }
};
