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

// We can leave this in the open. No disadvantage and more usable for me.
Mousetrap.bind('shift+w', function() {
    win("You have used the Shift+W debugging keyboard shortcut to win.");
});
Mousetrap.bind(['u', 'up'], function() {
    if (undoHistory.length > 0) {
        undo();
    }
});

var sendEvent = function(category, action, label) {
    if (ga) {
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label
        });
    }
};

var spanTag = function(span, content) {
    return "<span class='" + span + "'>" + content + "</span>";
};
