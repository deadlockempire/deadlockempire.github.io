var NullExpression = function(name) {
    this.evaluate = function() { return null; };
    this.code = "<span class='keyword'>" + name + "</span>";
};
var LiteralExpression = function(value) {
    this.evaluate = function() { return value; };
    if ((value === false) || (value === true)) {
	    this.code = "<span class='keyword'>" + value.toString() + "</span>";
    } else {
	    this.code = value.toString();
    }
};
var VariableExpression = function(name) {
    this.evaluate = function(threadState, globalState) { return globalState[name].value; };
    this.code = name;
};
var AdditionExpression = function(left, right) {
    this.evaluate = function(threadState, globalState) { return left.evaluate(threadState, globalState) +
            right.evaluate(threadState, globalState); };
    this.code = left.code + " + " + right.code;
};
var ModuloExpression = function (left, right) {
    this.evaluate = function (threadState, globalState) {
        return left.evaluate(threadState, globalState) %
            right.evaluate(threadState, globalState);
    };
    this.code = left.code + " % " + right.code;
};
var SubtractionExpression = function(left, right) {
    this.evaluate = function(threadState, globalState) { return left.evaluate(threadState, globalState) -
        right.evaluate(threadState, globalState); };
    this.code = left.code + " - " + right.code;
};
var EqualityExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) == right.evaluate(threadState, globalState);
        };
        this.code = left.code + " == " + right.code;

    };
var LessThanExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) < right.evaluate(threadState, globalState);
        };
        this.code = left.code + " < " + right.code;

    };
var AndExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) && right.evaluate(threadState, globalState);
        };
        this.code = left.code + " && " + right.code;
    };
var OrExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) || right.evaluate(threadState, globalState);
        };
        this.code = left.code + " || " + right.code;
    };
var InequalityExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) != right.evaluate(threadState, globalState);
        };
        this.code = left.code + " != " + right.code;

    };
var GreaterThanExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) > right.evaluate(threadState, globalState);
        };
        this.code = left.code + " > " + right.code;
    };
var GreaterOrEqualExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) >= right.evaluate(threadState, globalState);
        };
        this.code = left.code + " >= " + right.code;

    };
