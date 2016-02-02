/**
 * Called when something that shouldn't happen happens, like level errors.
 */
var fail = function() {
	console.warn(arguments);
	alert("FAIL");
};
