var LiteralExpression = function(value) {
    this.evaluate = function() {
        return value;
    };
    this.code = LanguageDependentLiteralExpression(value);
};
var VariableExpression = function(name) {
    this.evaluate = function(threadState, globalState) {
        return globalState[name].value;
    };
    this.code = LanguageDependentIdentifierCapitalisation(name);
};
var AdditionExpression = function(left, right, separator) {
    this.evaluate = function(threadState, globalState) {
        return left.evaluate(threadState, globalState) + right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, "+", separator);
};
var ModuloExpression = function (left, right, separator) {
    this.evaluate = function (threadState, globalState) {
        return left.evaluate(threadState, globalState) %  right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, LanguageDependentIntegerModulusOperator(), separator);
};
var SubtractionExpression = function(left, right, separator) {
    this.evaluate = function(threadState, globalState) {
        return left.evaluate(threadState, globalState) - right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, "-", separator);
};
var EqualityExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) == right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, LanguageDependentValueEqualityOperator(), separator);
};
var LessThanExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) < right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, "<", separator);
};
var AndExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) && right.evaluate(threadState, globalState);
    };
    this.code = LanguageDependentAndOperatorCode(left.code, right.code, separator);
};
var OrExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) || right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, LanguageDependentBooleanOrOperator(), separator);
};
var InequalityExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) != right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, LanguageDependentValueInequalityOperator(), separator);
};
var GreaterThanExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) > right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, ">", separator);
};
var GreaterOrEqualExpression = function (left, right, separator) {
    this.evaluate = function(threadState, globalState)  {
        return left.evaluate(threadState, globalState) >= right.evaluate(threadState, globalState);
    };
    this.code = BinaryOperatorCode(left.code, right.code, ">=", separator);
};
