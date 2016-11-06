// language dependent things: try to abstract as much of language specifics here

var BinaryOperatorCode = function(left, right, operator, separator) {
    // TODO: find a better way than separator to split large expressions
    var separator;
    if (!separator) {
        separator = " "
    }
    return left + " " + operator + separator + right;
};

var keywordCode = function(keyword) {
    return spanTag("keyword", keyword);
};

function snakeCaseToCamelCase(string){
    return string.replace(/\_\w/g, // convert underscore followed by word-characters through the function
        function(match) {
            return match.charAt(1).toUpperCase(); // match[0] is the underscore
        }
    );
}

var capitaliseFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function snakeCaseToPascalCase(s) {
    return capitaliseFirstLetter(snakeCaseToCamelCase(s));
}

var ParenthesisedExpressionCode = function(expressionCode) {
    return "(" + expressionCode + ")";
};

var LanguageDependentIdentifierCapitalisation = function(identifier) {
    return identifier; // C#
}

var LanguageDependentRefParameter = function(parameterName) {
    return keywordCode("ref") + " " + parameterName; // C#
}

var LanguageDependentIntegerDivisionOperator = function () {
    return "/"; // C#
}

var LanguageDependentIntegerModulusOperator = function () {
    return "%"; // C#
}

var LanguageDependentAssignmentOperator = function () {
    return "="; // C#
}

var LanguageDependentBooleanAndOperator = function () {
    return "&&"; // C#
}

var LanguageDependentBooleanOrOperator = function () {
    return "||"; // C#
}

var LanguageDependentValueEqualityOperator = function () {
    return "=="; // C#
}

var LanguageDependentValueInequalityOperator = function () {
    return "!="; // C#
}

var LanguageDependentClassName = function(className) {
    return className; // C#
}

var LanguageDependentInterfaceName = function(className) {
    return "I" + LanguageDependentIdentifierCapitalisation(className); // C# or Delphi
}

var LanguageDependentConstruction = function(className) {
    return keywordCode("new") + " " + className + "()"; // C#
}

var LanguageDependentBegin = function() {
    return "{"; // C#
}

var LanguageDependentDo = function() {
    return keywordCode("do"); // C# or Delphi
}

var LanguageDependentDoBegin = function() {
    return LanguageDependentDo() + " " + LanguageDependentBegin(); // Delphi or C#
}

var LanguageDependentDoBeginInWhileLoop = function() {
    return LanguageDependentBegin(); // C#
}

var LanguageDependentElse = function() {
    return keywordCode("else"); // C# or Delphi
}

var LanguageDependentEnd = function() {
    return "}"; // C#
}

var LanguageDependentEndInstruction = function() {
    return LanguageDependentEnd(); // C#
}

var LanguageDependentEndElseBegin = function() {
    return LanguageDependentEnd() + " " + LanguageDependentElse() + " " + LanguageDependentBegin(); // C# or Delphi
}

var LanguageDependentIf = function() {
    return keywordCode("if"); // C# or Delphi
}

var LanguageDependentIfWhileDoExpression = function(expressionCode) {
    var resultExpression = ParenthesisedExpressionCode(expressionCode); // C#
    return " " + resultExpression + " ";
};

var LanguageDependentIncrement = function(name) {
    var capitalisedName = LanguageDependentIdentifierCapitalisation(name);
    return capitalisedName + "++"; // C#
}

var LanguageDependentInterlockedIncrement = function(name) {
    var capitalised = LanguageDependentRefParameter(name);
    return staticMethodExpressionCode("Interlocked", "Increment", capitalised); // C#
}

var LanguageDependentThen = function() {
    return keywordCode("then"); // Delphi
}

var LanguageDependentThenBegin = function() {
    return LanguageDependentBegin(); // C#
}

var LanguageDependentWhile = function() {
    return keywordCode("while"); // C# or Delphi
}

var LanguageDependentLiteralExpression = function(value) {
    if ((value === false) || (value === true)) {
        var capitalised = LanguageDependentIdentifierCapitalisation(value.toString());
        return keywordCode(capitalised); // C#
    } else {
        return value.toString();
    }
};

var LanguageDependentDebugInstanceName = function() {
    return debugInstanceName = "Debug"; // C#
}

var LanguageDependentAndOperatorCode = function(left, right, separator) {
    // because of Delphi operator precedence: `and` has less precedence than comparison operators
    return BinaryOperatorCode(left, right, LanguageDependentBooleanAndOperator(), separator); // C#
};
