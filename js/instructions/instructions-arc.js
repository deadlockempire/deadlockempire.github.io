var ArcAutoreleasePoolInstruction = function () {
	this.evaluate = function(threadState, globalState) {
		threadState.arcAutoreleasePools.push(new ArcAutoreleasePool());
	};
	this.code = "@autorelease {";
}

var EndArcAutoreleasePoolInstruction = function () {
	this.evaluate = function(threadState, globalState) {
		threadState.arcAutoreleasePools.pop().drain(threadState, globalState);
	};
	this.code = "}";
}

var ArcAllocateExpression = function (type) {
	this.evaluate = function(threadState, globalState) {
		return new RefCountObject(nextObjectName(type));
	};
	this.code = "[[" + type + " alloc] init]";
}

var ArcTemporaryExpression = function (name) {
	this.evaluate = function(threadState, globalState) {
		var tempVar = threadState.localVariables[name];
		return tempVar ? tempVar.value : null;
	};
	this.code = name;
}

var ArcAssignInstruction = function (left, expression) {
	var minorInstructions = [
		new ArcAssignmentToTemp("temp", expression),
		new ArcRetainInstruction(new ArcTemporaryExpression("temp")),
		new ArcAssignmentToTemp("lvalue", new VariableExpression(left)),
		new ArcPrimitiveAssignment(left, new ArcTemporaryExpression("temp")),
		new ArcReleaseInstruction(new ArcTemporaryExpression("lvalue"))
	];
	var v = new ExpandableInstruction(left + " = " + expression.code + ";", minorInstructions);
	v.tooltip = "[Expandable] Assigns the value of the right-side expression to the variable on the left using automatic reference counting. This operation is non-atomic.";
	return v;
};

var ArcPrimitiveAssignment = function (left, expression) {
	this.code = left + " = " + expression.code + ";";
	this.tooltip = "Assigns the value of the right-side expression to the variable on the left. This operation is atomic.";
	this.execute = function(threadState, globalState) {
		globalState[left].value = expression.evaluate(threadState, globalState);
		moveToNextInstruction(threadState);
	};
};

var ArcAssignmentToTemp = function (name, expression) {
	this.code = name + " = " + expression.code + ";";
	this.tooltip = "Assigns the value of the right-side expression to the thread-local temporary variable on the left.";
	this.execute = function(threadState, globalState) {
		var value = expression.evaluate(threadState, globalState);
		if (value instanceof RefCountObject) {
			var tempVar = new RefCountVariable(name);
			tempVar.value = value;
			threadState.localVariables[name] = tempVar;
			console.log("Assigning " + value.name + " to " + name);
		} else if (name in threadState.localVariables) {
			delete threadState.localVariables[name];
		}
		moveToNextInstruction(threadState);
	};
};

var ArcRetainInstruction = function (expression) {
	this.code = "objc_retain(" + expression.code + ");";
	this.tooltip = "Increases the retain count of the specified object.";
	this.execute = function(threadState, globalState) {
		var object = expression.evaluate(threadState, globalState);
		if (object && !object.deallocating) {
			object.refCount += 1;
		}
		moveToNextInstruction(threadState);
	};
};

var ObjcRetainInstruction = function (expression) {
	this.code = "[" + expression.code + " retain];";
	this.tooltip = "Increases the retain count of the specified object.";
	this.execute = function(threadState, globalState) {
		var object = expression.evaluate(threadState, globalState);
		if (object && !object.deallocating) {
			object.refCount += 1;
		}
		moveToNextInstruction(threadState);
	};
}

var ArcReleaseInstruction = function (expression) {
	this.code = "objc_release(" + expression.code + ");";
	this.tooltip = "Decreases the retain count of the specified object.";
	this.execute = function(threadState, globalState) {
		var object = expression.evaluate(threadState, globalState);
		if (object) {
			if (object.deallocating) {
				win("Attempt to release a deallocated object.");
			}
			else {
				object.refCount -= 1;
				if (object.refCount == 0) {
					object.deallocating = true;
				}
			}
		}
		moveToNextInstruction(threadState);
	};
}

var ObjcReleaseInstruction = function (expression) {
	this.code = "[" + expression.code + " release];";
	this.tooltip = "Decreases the retain count of the specified object.";
	this.execute = function(threadState, globalState) {
		var object = expression.evaluate(threadState, globalState);
		if (object) {
			if (object.deallocating) {
				win("Attempt to release a deallocated object.");
			}
			else {
				object.refCount -= 1;
				if (object.refCount == 0) {
					object.deallocating = true;
				}
			}
		}
		moveToNextInstruction(threadState);
	};
}
