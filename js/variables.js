var IntegerVariable = function (name, defaultValue) {
    this.name = name;
    this.type = "System.Int32";
    this.value = defaultValue;
};
var CountdownEventVariable = function (name, count) {
    this.name = name;
    this.type = "System.Threading.CountdownEvent";
    this.value = count;
};
var ManualResetEventVariable = function (name, value) {
    this.name = name;
    this.type = "System.Threading.ManualResetEventSlim";
    this.value = value;
};
var BarrierVariable = function (name, participantCount) {
    this.name = name;
    this.type = "System.Threading.Barrier";
    this.value = participantCount;
    this.numberOfParticipants = participantCount;
    this.hasArrived = [];
    this.phase = 0;
};
var SemaphoreVariable = function(name, value) {
    this.name = name;
    this.type = 'System.Threading.SemaphoreSlim';
    this.value = value;
};
var QueueVariable = function(name, innerType, value) {
    this.name = name;
    this.type = 'System.Collections.Generic.Queue<' + innerType + '>';
    this.value = value;
};
var ObjectVariable = function(name) {
    this.name = name;
    this.type = 'System.Object';
};
var RefCountVariable = function(name) {
	this.name = name;
	this.type = 'ArcObject'
	this.value = null;
};
var RefCountObject = function(name) {
	this.name = name;
	this.refCount = 1;
	this.deallocating = false;
};
RefCountObject.nameCounts = {};
var ArcAutoreleasePool = function() {
	this.objects = [];
	this.add = function(object) {
		if (object !== null) {
			this.objects.push(object);
		}
	}
	this.drain = function(threadState, globalState) {
		for (var object in objects) {
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
		this.objects = [];
	};
};
/**
 * Returns the variable value in human-readable form.
 * @param variable A variable.
 * @returns string Its value in human form.
 */
var ToString = function(variable) {
    var type = variable.type;
    var value = variable.value;
    switch (type) {
        case "System.Threading.CountdownEvent":
            return value == 0 ? "[event set]" : (value == 1 ? "[waits for one more signal]" : "[waits for " + value + " more signals]");
        case "System.Threading.ManualResetEventSlim":
            return "[" + (value ? "signaled" : "nonsignaled" ) + "]";
        case "System.Threading.Barrier":
            return "[phase " + variable.phase + ", waiting for " + value + " threads]";
        case "System.Object":
            return "";
        case "System.Threading.SemaphoreSlim":
            return "[counter: " + value + "]";
		case "ArcObject":
			return value === null ? "[null]" : (value.deallocating ? "[deallocating]" : "[object refcount: " + value.refCount + "]");

    }
    if (type.indexOf('System.Collections.Generic.Queue') == 0) {
        return "[number of enqueued items: " + value + "]";
    }
    return null;
};