var BooleanVariable = function (name, defaultValue) {
    this.name = name;
    this.relativeUrl = "System.Boolean";
    this.type = this.relativeUrl;
    this.value = defaultValue;
};
var IntegerVariable = function (name, defaultValue) {
    this.name = name;
    this.relativeUrl = "System.Int32";
    this.type = this.relativeUrl;
    this.value = defaultValue;
};
var CountdownEventVariable = function (name, count) {
    this.name = name;
    this.relativeUrl = "System.Threading.CountdownEvent";
    this.type = this.relativeUrl;
    this.value = count;
};
var ManualResetEventVariable = function (name, value) {
    this.name = name;
    this.relativeUrl = "System.Threading.ManualResetEventSlim";
    this.type = this.relativeUrl;
    this.value = value;
};
var BarrierVariable = function (name, participantCount) {
    this.name = name;
    this.relativeUrl = "System.Threading.Barrier";
    this.type = this.relativeUrl;
    this.value = participantCount;
    this.numberOfParticipants = participantCount;
    this.hasArrived = [];
    this.phase = 0;
};
var SemaphoreVariable = function(name, value) {
    this.name = name;
    this.relativeUrl = "System.Threading.SemaphoreSlim";
    this.type = this.relativeUrl;
    this.value = value;
};
var QueueVariable = function(name, innerType, value) {
    this.name = name;
    this.relativeUrl = "7977ey2c";
    this.type = "System.Collections.Generic.Queue" + "<" + innerType + ">";
    this.value = value;
};
var ObjectVariable = function(name) {
    this.name = name;
    this.relativeUrl = "System.Object";
    this.type = this.relativeUrl;
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

    }
    if (type.indexOf("System.Collections.Generic.Queue") == 0) {
        return "[number of enqueued items: " + value + "]";
    }
    return null;
};
