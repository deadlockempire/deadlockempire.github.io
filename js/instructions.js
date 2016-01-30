var moveToNextInstruction = function(threadState) {
	if (threadState.expanded) {
		threadState.programCounter[1]++;

		if (threadState.programCounter[1] >= threadState.program[threadState.programCounter[0]].minorInstructions.length) {
			threadState.expanded = false;
			threadState.programCounter[0]++;
			threadState.programCounter[1] = 0;
		}
	} else {
		threadState.expanded = false;
		threadState.programCounter[0]++;
		threadState.programCounter[1] = 0;
	}
};

var goToInstruction = function(threadState, line) {
	threadState.programCounter = [line, 0];
};

var Instruction = function(code) {
	this.code = code;
	this.execute = function(threadState, globalState) {
		moveToNextInstruction(threadState);
	};
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

var FlavorInstruction = function(flavorText) {
	this.code = "<i>" + flavorText + "</i>;";
	this.tooltip = "This instruction does nothing and merely fills up space.";
	this.execute = function(threadState, globalState) {
		moveToNextInstruction(threadState);
	};
};

var FailureInstruction = function() {
    this.code = "<i>failure-statement</i>;";
    this.tooltip = "If you execute this statement, you will win this level.";
    this.execute = function(threadState, globalState) {
        showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"!"');
		localStorage.setItem('level_' + window.level.id, "solved");
    };
};

var CriticalSectionInstruction = function() {
    this.isCriticalSection = true;
    this.code = "<b>critical_section</b>();";
    this.tooltip = "If two threads are about to execute a Critical Section Instruction at the same time, you win the level.";
    this.execute = function (threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};

var WinningInstruction = function(code) {
	this.code = code;
	this.execute = function(threadState, globalState) {
        showMessage('Level completed!', 'The congratulatory victory message is this: "' + window.level.victoryText + '"!"');
		localStorage.setItem('level_' + window.level.id, "solved");
	};
};

var AssignInstruction = function(code, variable, type, value) {
	this.code = code;
	this.variable = variable;
	this.execute = function(threadState, globalState) {
		assign(variable, type, value);
		moveToNextInstruction(threadState);
	};
};

var IfInstruction = function(code, test, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState, globalState, threadProgram) {
		if (test(threadState, globalState)) {
			moveToNextInstruction(threadState);  // goto true branch
		} else {
			// false -> find matching Else
			var i;
			for (i = 0; i < threadProgram.length; i++) {
				var instruction = threadProgram[i];
				console.log(instruction);
				if ((instruction instanceof ElseInstruction) && instruction.name == name) {
					break;
				}
			}
			console.assert(i < threadProgram.length);
			goToInstruction(threadState, i);
		}
	};
};

var ElseInstruction = function(code, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState) {
		moveToNextInstruction(threadState);
	};
};

var ExpandableInstruction = function(code, minorInstructions) {
	this.code = code;
	this.minorInstructions = minorInstructions;
	this.execute = function(threadState, globalState, threadProgram) {
		for (var i = 0; i < minorInstructions.length; i++) {
			minorInstructions[i].execute(threadState, globalState, threadProgram);
		}
	};
};

var WhileInstruction = function(expressionString, test, name) {
	this.code = "while (" + expressionString + ") {";
	this.name = name;
	this.execute = function(threadState, globalState, threadProgram) {
		if (test(threadState, globalState)) {
			threadState.programCounter++;  // goto true branch
		} else {
			// false -> find matching Else
			var i;
			for (i = 0; i < threadProgram.length; i++) {
				var instruction = threadProgram[i];
				if ((instruction instanceof EndWhileInstruction) && instruction.name == name) {
					break;
				}
			}
			threadState.programCounter = i + 1;
		}
	};
};

var EndWhileInstruction = function( name) {
	this.code = "}";
	this.name = name;
	this.execute = function(threadState, globalState, threadProgram) {
		for (i = 0; i < threadProgram.length; i++) {
			var instruction = threadProgram[i];
			if ((instruction instanceof WhileInstruction) && instruction.name == name) {
				break;
			}
		}
		threadState.programCounter = i;
	};
};
