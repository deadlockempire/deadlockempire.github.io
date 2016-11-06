var dereferenceMemberCode = function(instanceOrClassCode, memberName) {
    var capitalisedMemberName = LanguageDependentIdentifierCapitalisation(memberName);
    if (instanceOrClassCode) {
        return instanceOrClassCode + "." + capitalisedMemberName;
    } else {
        return capitalisedMemberName;
    }
}

var instanceMemberExpressionCode = function(instanceName, memberName) {
    var capitalisedMemberName = LanguageDependentIdentifierCapitalisation(memberName);
    if (instanceName) {
        return dereferenceMemberCode(LanguageDependentIdentifierCapitalisation(instanceName), capitalisedMemberName)
    } else {
        return dereferenceMemberCode(instanceName, capitalisedMemberName)
    }
};

var instanceMethodExpressionCode = function(instanceName, methodName, parameter, spanTagName) {
    var parameterValue;
    // falsify exccept values we're interested in: false, 0
    if ((parameter) || (parameter === false) || (parameter === 0)) {
        var expression = new LiteralExpression(parameter);
        parameterValue = expression.code;
    }
    else {
        parameterValue = "";
    }
    var expression = instanceMemberExpressionCode(instanceName, methodName);
    if (spanTagName) {
        expression = spanTag(spanTagName, expression);
    }
    return expression + ParenthesisedExpressionCode(parameterValue);
};

var instructionCode = function(expression) {
    return expression + ";";
};

var moveToNextInstruction = function(threadState) {
    if (threadState.expanded) {
        threadState.programCounter[1]++;

        var program = gameState.getProgramOfThread(threadState.id);
        if (threadState.programCounter[1] >= program[threadState.programCounter[0]].minorInstructions.length) {
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
    this.tooltip = "This statement does nothing and merely fills up space.";
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};

/**
 * Instructions may define a isBlocking method. If there is no such method
 * or if it returns false, the instruction can be executed. If the method
 * returns a string, it is blocking the thread and the string is the reason for
 * the block. 'True' means 'we are blocking, but give no reason'.
 *
 * TODO(prvak): Figure out some nicer way to share code between instructions.
 */

var FlavorInstruction = function(flavorText) {
    this.code = "<i>" + LanguageDependentIdentifierCapitalisation(flavorText) + "</i>;";
    this.tooltip = "This statement does nothing. It is part of the business logic and does not affect parallelism. You may consider it thread-safe.";
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};
var GameOverInstruction = function() {
//    this.code = instructionCode(spanTag("game-over-instruction", instanceMethodExpressionCode("Environment", "Exit", 0))); // semicolon would be outside span
    this.code = spanTag("game-over-instruction", instructionCode(instanceMethodExpressionCode("Environment", "Exit", 0))); // semicolon inside span
    this.tooltip = "If the program reaches this statement, then it's considered to have succeeded and you, as the player, lose this level, and will need to undo or reset.";
    this.execute = function (threadState) {
        lose("The program finished successfully by reaching <code>Environment.Exit(0)</code>. To conquer this challenge, don't let it happen.");
    };
    this.isBlocking = function() {
        if (levelWasCleared) {
            return "Program successfully exited.";
        }
        return false;
    };
};
var FailureInstruction = function() {
//    this.code = instructionCode(instanceMethodExpressionCode(LanguageDependentDebugInstanceName(), "Assert", false, "failure-statement")); // parenthesis and parameter would be outside the span
    this.code = instructionCode(spanTag("failure-statement", instanceMethodExpressionCode(LanguageDependentDebugInstanceName(), "Assert", false))); // everything but semicolon inside span
    this.tooltip = "If you execute this statement, you will win this level.";
    this.execute = function(threadState, globalState) {
        win("You executed a failure instruction.");
    };
    this.isBlocking = function() {
        if (levelWasCleared) {
            return "Execution failed.";
        }
        return false;
    };
};

var CriticalSectionInstruction = function() {
    this.isCriticalSection = true;
    this.code = instructionCode(instanceMethodExpressionCode("", "critical_section", null, "critical-section"));
    this.tooltip = "If two threads are about to execute a Critical Section Instruction at the same time, you win the level.";
    this.execute = function (threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};

var findMatchingInstructionIndex = function(program, name, type) {
    for (var i = 0; i < program.length; i++) {
        var instruction = program[i];
        if ((instruction instanceof type) && instruction.name == name) {
            return i;
        }
    }
    fail("Failed to find matching instruction", program, name, type);
    return 0;
};

var IfInstruction = function(expression, name) {
    this.code = LanguageDependentIf() + LanguageDependentIfWhileDoExpression(expression.code) + LanguageDependentThenBegin();
    this.name = name;
    this.tooltip = "The \"if\" statement evaluates an expression. If it's true, the specified statements are executed. Otherwise, they are skipped.";
    if (expression.tooltip) {
        this.tooltip += "<br><br><b>Expression:</b><br>" + expression.tooltip;
    }
    this.isBlocking = function(threadState, globalState) {
        return (expression.isBlocking && expression.isBlocking(threadState, globalState));
    };
    this.execute = function(threadState, globalState, threadProgram) {
        if (expression.evaluate(threadState, globalState)) {
            moveToNextInstruction(threadState);  // goto true branch
        } else {
            // Condition is false, jump to matching EndIf.
            var matchingEndIf = findMatchingInstructionIndex(threadProgram, name, EndIfInstruction);
            goToInstruction(threadState, matchingEndIf);
        }
    };
};

var EndIfInstruction = function(name) {
    this.code = LanguageDependentEndInstruction();
    this.tooltip = "This is the end of a simple \"if\" statement.";
    this.name = name;
    this.execute = function(threadState) {
        moveToNextInstruction(threadState);
    };
};

var IfLongInstruction = function(expression, name) {
    this.code = LanguageDependentIf() + LanguageDependentIfWhileDoExpression(expression.code) + LanguageDependentThenBegin();
    this.name = name;
    this.tooltip = "The \"if\" statement evaluates an expression. If it's true, the specified statements are executed. Otherwise, the \"else\" statements are executed.";
    if (expression.tooltip) {
        this.tooltip += "<br><br><b>Expression:</b><br>" + expression.tooltip;
    }
    this.isBlocking = function(threadState, globalState) {
        return (expression.isBlocking && expression.isBlocking(threadState, globalState));
    };
    this.execute = function(threadState, globalState, threadProgram) {
        if (expression.evaluate(threadState, globalState)) {
            moveToNextInstruction(threadState);  // goto true branch
        } else {
            // false -> move 1 instruction after matching 'else'
            var matchingElse = findMatchingInstructionIndex(threadProgram, name, ElseInstruction);
            goToInstruction(threadState, matchingElse + 1);
        }
    };
};

var ElseInstruction = function(name) {
    this.code = LanguageDependentEndElseBegin();
    this.name = name;
    this.tooltip = "This is part of an \"if/else\" statement.";
    this.execute = function(threadState, globalState, threadProgram) {
        var matchingEndIfLong = findMatchingInstructionIndex(threadProgram, name, EndIfLongInstruction);
        goToInstruction(threadState, matchingEndIfLong);
    };
};

var EndIfLongInstruction = function(name) {
    this.code = LanguageDependentEndInstruction();
    this.tooltip = "This is the end of a complex \"if\" statement.";
    this.name = name;
    this.execute = function(threadState) {
        moveToNextInstruction(threadState);
    };
};

var ExpandableInstruction = function(expressionCode, minorInstructions) {
    this.code = instructionCode(expressionCode);
    this.minorInstructions = minorInstructions;
    this.tooltip = "This statement is not atomic and can be expanded into several minor statements that are atomic.";
    this.execute = function(threadState, globalState, threadProgram) {
        console.assert(!threadState.expanded);
        threadState.expanded = true;
        for (var i = 0; i < minorInstructions.length; i++) {
            if (minorInstructions[i].isBlocking && minorInstructions[i].isBlocking(threadState, globalState)) {
                // Cannot execute this subinstruction. Break.
                break;
            }
            minorInstructions[i].execute(threadState, globalState, threadProgram);
        }
    };
};

var AssignmentExpressionCode = function (left, right, separator) {
    return BinaryOperatorCode(LanguageDependentIdentifierCapitalisation(left), LanguageDependentIdentifierCapitalisation(right), LanguageDependentAssignmentOperator(), separator);
};

var AtomicAssignmentToTemp = function (expression) {
    this.code = instructionCode(AssignmentExpressionCode("temp", expression.code));
    this.tooltip = "Evaluates the expression to the right and assigns it to the thread-local temporary variable on the left.";
    this.execute = function(threadState, globalState) {
        threadState.temporaryVariableValue = expression.evaluate(threadState, globalState);
        moveToNextInstruction(threadState);
    };
};
var AtomicAssignmentFromTemp = function (name) {
    this.code = instructionCode(AssignmentExpressionCode(name, "temp"));
    this.tooltip = "Moves the value from the thread-local temporary variable into the specified global variable.";
    this.execute = function(threadState, globalState) {
        globalState[name].value = threadState.temporaryVariableValue;
        moveToNextInstruction(threadState);
    };
};

var createAssignment = function(name, expression) {
    var minorInstructions = [
        new AtomicAssignmentToTemp(expression),
        new AtomicAssignmentFromTemp(name)
    ];
    var v = new ExpandableInstruction(AssignmentExpressionCode(name, expression.code), minorInstructions);
    v.tooltip = "[Expandable] Assigns the value of the right-side expression to the variable on the left. This operation is non-atomic.";
    return v;
};

var createIncrement = function(name) {
    var minorInstructions = [
        new AtomicAssignmentToTemp(new AdditionExpression(new VariableExpression(name), new LiteralExpression(1))),
        new AtomicAssignmentFromTemp(name)
    ];
    var v = new ExpandableInstruction(LanguageDependentIncrement(name), minorInstructions);
    v.tooltip = "[Expandable] Increments the value of the variable by one. This operation is non-atomic. However, the function Interlocked.Increment is atomic.";
    return v;
};

var EmptyStatement = function() {
    this.code = ";";
    this.tooltip = "This statement does nothing.";
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};

var CommentInstruction = function(comment) {
    this.code = spanTag("comment", "// " + comment);
    this.tooltip = "This is a comment. It does nothing.";
    this.execute = function(threadState, globalState) {
        moveToNextInstruction(threadState);
    };
};

var WhileInstruction = function(expression, name) {
    this.code = (LanguageDependentWhile() + LanguageDependentIfWhileDoExpression(expression.code) + LanguageDependentDoBeginInWhileLoop());
    this.name = name;
    this.tooltip = "Executes the statements in the loop body until the specified condition ceases to be true.";
    if (expression.tooltip) {
        this.tooltip += "<br><br><b>Expression:</b><br>" + expression.tooltip;
    }
    this.execute = function(threadState, globalState, threadProgram) {
        if (expression.evaluate(threadState, globalState)) {
            moveToNextInstruction(threadState);
        } else {
            // false -> move 1 instruction after matching EndWhile
            var matchingEndWhile = findMatchingInstructionIndex(threadProgram, name, EndWhileInstruction);
            goToInstruction(threadState, matchingEndWhile + 1);
        }
    };
};

var createOuterWhile = function() {
    return new WhileInstruction(new LiteralExpression(true), "__outerWhile");
};
var createOuterWhileEnd = function() {
    return new EndWhileInstruction("__outerWhile");
};

var EndWhileInstruction = function( name) {
    this.code = LanguageDependentEndInstruction();
    this.tooltip = "Marks the end of a while loop.";
    this.name = name;
    this.execute = function(threadState, globalState, threadProgram) {
        // Jump back to start of matching 'while'.
        var matchingWhile = findMatchingInstructionIndex(threadProgram, name, WhileInstruction);
        goToInstruction(threadState, matchingWhile);
    };
};
