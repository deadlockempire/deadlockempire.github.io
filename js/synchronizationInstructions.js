var MonitorEnterInstruction = function(monitorName) {
    this.code = "Monitor.Enter(" + monitorName + ");";
    this.tooltip = "Atomic. Acquires a lock. If this thread already owns this lock, the lock counter is incremented. If another thread currently owns this lock, this call blocks until the lock is released.";
    this.execute = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread == null &&
            monitor.lastLockedByThread != threadState.id)
        {
            showMessage("Blocked", "This thread is blocked. Another thread owns the lock.");
        }
        else {
            monitor.lastLockedByThread = threadState.id;
            monitor.lockCount++;
        }
        moveToNextInstruction(threadState);

        // global variables
        // keyed by variable name
        // value is {
        //	'type': (typ),
        //	'name': (jmeno),
        //	'value': (value, JS primitive),
        //	'lastLockedByThread': (ID of last thread that locked the
        //		variable, or null),
        //	'lockCount': (lock count, 0 if none)
        // }
    }
};
var MonitorExitInstruction = function(monitorName) {
    this.code = "Monitor.Exit(" + monitorName + ");";
    this.tooltip = "Atomic. Releases a lock. If this thread had this locked multiple times, decrements the timer only. If this thread does not own this lock, an exception is thrown (and you win the level).";
    this.execute = function(threadState, globalState) {
        var monitor = globalState[monitorName];
        if (monitor.lastLockedByThread == threadState.id)
        {
            monitor.lockCount--;
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
var SemaphoreWaitInstruction = function(semaphoreName) {
    this.code = semaphoreName + ".Wait();";
    this.tooltip = "Atomic. Attempts to decrease the semaphore counter by one. If the semaphore is already at 0, this call blocks until another thread increases the counter by calling Release().";
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

