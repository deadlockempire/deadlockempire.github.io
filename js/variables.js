var BooleanType = function() {
    this.name = "System.Boolean";
    this.displayName = "bool";
    this.relativeUrl = this.name;
};
var BooleanVariable = function (name, defaultValue) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new BooleanType();
    this.value = defaultValue;
};

var IntegerType = function() {
    this.name = "System.Int32";
    this.displayName = "int";
    this.relativeUrl = this.name;
};
var IntegerVariable = function (name, defaultValue) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new IntegerType();
    this.value = defaultValue;
};

var CountdownEventType = function() {
    this.name = "System.Threading.CountdownEvent";
    this.displayName = this.name;
    this.relativeUrl = this.name;
};
var CountdownEventVariable = function (name, count) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new CountdownEventType();
    this.value = count;
};

var ManualResetEventType = function() {
    this.name = "System.Threading.ManualResetEventSlim";
    this.displayName = this.name;
    this.relativeUrl = this.name;
};
var ManualResetEventVariable = function (name, value) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new ManualResetEventType();
    this.value = value;
};

var BarrierVariableType = function() {
    this.name = "System.Threading.Barrier";
    this.displayName = this.name;
    this.relativeUrl = this.name;
};
var BarrierVariable = function (name, participantCount) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new BarrierVariableType();
    this.value = participantCount;
    this.numberOfParticipants = participantCount;
    this.hasArrived = [];
    this.phase = 0;
};

var SemaphoreType = function() {
    this.name = "System.Threading.SemaphoreSlim";
    this.displayName = this.name;
    this.relativeUrl = this.name;
};
var SemaphoreVariable = function(name, value) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new SemaphoreType();
    this.value = value;
};

var QueueType = function(innerType) {
    this.name = "System.Collections.Generic.Queue" + "<" + innerType.name + ">";
    this.displayName = "System.Collections.Generic.Queue" + "<" + innerType.displayName + ">";
    this.relativeUrl = "7977ey2c";
};
var QueueVariable = function(name, innerType, value) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new QueueType(innerType);
    this.value = value;
};

var ObjectType = function(name) {
    this.name = "System.Object";
    this.relativeUrl = this.name;
    if (name != null) {
        this.name = name;
        this.displayName = LanguageDependentClassName(name);
    } else {
        this.displayName = "object";
    }
}
var ObjectVariable = function(name) {
    this.name = name;
    this.displayName = LanguageDependentIdentifierCapitalisation(name);
    this.type = new ObjectType();
};

/**
 * Returns the variable value in human-readable form.
 * @param variable A variable.
 * @returns string Its value in human form.
 */
var ToString = function(variable) {
    var typeName = variable.type.name;
    var value = variable.value;
    switch (typeName) {
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
    if (typeName.indexOf("System.Collections.Generic.Queue") == 0) {
        return "[number of enqueued items: " + value + "]";
    }
    return null;
};
