/**
 * Debug mode enables access to the debug menu and debug levels.
 * Enable it by appending ?debug=1 to the URL.
 */
var debugMode = false;

var getQueryString = function ( field, url ) {
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
};

$(function() {
	debugMode = (getQueryString('debug') != null);
	if (!debugMode) {
		$('#debug-toolbar').remove();
	}
});

/**
 * Called when something that shouldn't happen happens, like level errors.
 */
var fail = function() {
	console.warn.apply(console, arguments);
	if (debugMode) {
		alert("FAIL");
	}
};
