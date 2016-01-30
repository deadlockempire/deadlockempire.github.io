var moveToNextInstruction = function (threadState) {
    threadState.programCounter++;
};

var Instruction = function(code) {
	this.code = code;
	this.execute = function(threadState, globalState) {
		threadState.programCounter++;
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

var AssignInstruction = function(code, variable, value) {
	this.code = code;
	this.variable = variable;
	this.execute = function(threadState, globalState) {
		globalState[variable] = value;
		threadState.programCounter++;
	};
};

var IfInstruction = function(code, test, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState, globalState, threadProgram) {
		if (test(threadState, globalState)) {
			threadState.programCounter++;  // goto true branch
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
			threadState.programCounter = i;
		}
	};
};

var ElseInstruction = function(code, name) {
	this.code = code;
	this.name = name;
	this.execute = function(threadState) { threadState.programCounter++; };
};