var MonitorEnterInstruction = function(monitorName) {
    this.code = "<span class='static'>Monitor</span>.Enter(" + monitorName + ");";
    this.tooltip = "Atomic. Acquires a lock. If this thread already owns this lock, the lock counter is incremented. If another thread currently owns this lock, this call blocks until the lock is released.";
    this.isBlocking = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread != null &&
            monitor.lastLockedByThread != threadState.id) {
            return true;
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
    this.code = "<span class='static'>Monitor</span>.TryEnter(" + monitorName + ")";
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
}
var MonitorExitInstruction = function(monitorName) {
    this.code = "<span class='static'>Monitor</span>.Exit(" + monitorName + ");";
    this.tooltip = "Atomic. Releases a lock. If this thread had this locked multiple times, decrements the timer only. If this thread does not own this lock, an exception is thrown (and you win the level).";
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
            declareVictory("The SynchronizationLockException was thrown because a thread attempted to release a lock it did not have.");
        }
        moveToNextInstruction(threadState);
    }
};
var SemaphoreTryWaitExpression = function(semaphoreName) {
    this.code = semaphoreName + ".TryWait(500)";
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
    this.code = semaphoreName + ".Wait();";
    this.tooltip = "Atomic. Attempts to decrease the semaphore counter by one. If the semaphore is already at 0, this call blocks until another thread increases the counter by calling Release().";
    this.isBlocking = function (threadState, globalState) {
        if (globalState[semaphoreName].value > 0) {
            return false;
        } else {
            return true;
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
    this.code = semaphoreName + ".Release();";
    this.tooltip = "Atomic. Increments the semaphore counter by one.";
    this.execute = function(threadState, globalState) {
        globalState[semaphoreName].value ++;
        moveToNextInstruction(threadState);
    }
};

