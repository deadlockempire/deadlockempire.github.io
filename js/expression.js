var LiteralExpression = function(value) {
    this.evaluate = function() { return value; };
    this.code = value.toString();
};
var VariableExpression = function(name) {
    this.evaluate = function(threadState, globalState) { return globalState[name].value; };
    this.code = name;
};
var AdditionExpression = function(left, right) {
    this.evaluate = function(threadState, globalState) { return left.evaluate(threadState, globalState) +
            right.evaluate(threadState, globalState); }
    this.code = left.code + " + " + right.code;
};
var SubtractionExpression = function(left, right) {
    this.evaluate = function(threadState, globalState) { return left.evaluate(threadState, globalState) -
        right.evaluate(threadState, globalState); }
    this.code = left.code + " - " + right.code;
};
var EqualityExpression =
    function (left, right) {
        this.evaluate = function(threadState, globalState)  {
            return left.evaluate(threadState, globalState) == right.evaluate(threadState, globalState);
        };
        this.code = left.code + " == " + right.code;

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
