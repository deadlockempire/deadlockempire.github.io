function showMessage(caption, text) {
    $('#alertCaption').html(caption);
    $('#alertText').html(text);
    $('#alert').show();
}

var updateProgramCounters = function() {
    $('.instruction').each(function() {
        $(this).removeClass('current-instruction');
    });
    $('.expansion').each(function() {
        $(this).css({display: "none"});
    });
    // update program counters
    for (var i = 0; i < gameState.getThreadCount(); i++) {
        var threadState = gameState.threadState[i];
        var pc = threadState.programCounter[0];
        var program = gameState.getProgramOfThread(i);

        if (pc < program.length) {
            $('#instruction-' + i + '-' + pc).addClass('current-instruction');
        }

        if (program[pc] instanceof ExpandableInstruction) {
            $('#instruction-' + i + '-' + pc + '-expansion').css({display: (threadState.expanded ? 'block' : 'none')});

            if (threadState.expanded) {
                $('#instruction-' + i + '-' + pc + '-sub' + threadState.programCounter[1]).addClass('current-instruction');
            }
        }
    }
};

var updateGlobalVariables = function() {
    var area = $('.global-state');
    area.html("<hr>");
    for (var key in gameState.globalState) {
        var variable = gameState.globalState[key];
        var type = variable.type;
        var variableString = ToString(variable);
        var variableValue = variable.value;
        var representation = $('<div class="variable"></div>');
        representation.append($('<a href="https://msdn.microsoft.com/en-us/library/' + type.relativeUrl + '" class="type"></a>').text(type.displayName));
        representation.append($('<span class="name"></span>').text(variable.displayName));

        if (variableValue == "unimportant") {
            // intentionally left blank
        } else if (variableString != null) {
            if (variableString != "") {
                representation.append(" ");
                representation.append($('<span class="value"></span>').text(variableString));
            }
        } else {
            representation.append($('<span class="equalSign"></span>').text('='));
            var typeName = type.name;

            if (typeName == "System.Boolean") {
                var booleanExpression = new LiteralExpression(variableValue);
                representation.append(booleanExpression.code); // it already has the 'span class="keyword"'
            } else {
                var valueRepr;
                if (typeName == "System.String") {
                    valueRepr = '"' + variableValue + '"';
                }
                else if (typeName.indexOf("Semaphore") != -1) {
                    valueRepr = 'SemaphoreSlim [count: ' + variableValue + ']';
                }
                else if (typeName.indexOf("Queue") != -1) {
                    valueRepr = 'Queue [element count: ' + variableValue + ']';
                }
                else {
                    valueRepr = variableValue.toString();
                }

                representation.append($('<span class="value"></span>').text(valueRepr));
            }
        }

        representation.append(";");
        if (variable.lastLockedByThread != null) {
            if (variable.lockCount == 1) {
                representation.append(" (locked by thread " + variable.lastLockedByThread + ")");
            } else {
                representation.append(" (locked by thread " + variable.lastLockedByThread + ", " + variable.lockCount + " times)");
            }
        }

        area.append(representation);
    }

    updateMSDNLinks();
};

var redraw = function() {
    updateProgramCounters();
    updateGlobalVariables();

    var undoEnabled = (undoHistory.length > 0);
    undoButton.attr('disabled', !undoEnabled);
    undoButton.removeClass('btn-info');
    undoButton.removeClass('btn-default');
    undoButton.addClass(undoEnabled ? 'btn-info' : 'btn-default');

    if (levelWasCleared) {
        nextChallengeButton.show();
        wonBanner.show();
    } else {
        nextChallengeButton.hide();
        wonBanner.hide();
    }

    for (var i = 0; i < gameState.getThreadCount(); i++) {
        var program = gameState.getProgramOfThread(i);
        var threadState = gameState.threadState[i];
        var currentInstruction = program[threadState.programCounter[0]];

        var buttons = threadButtons[i];
        var stepButton = buttons.step;
        if (isThreadFinished(i)) {
            stepButton.attr('disabled', true);
            stepButton.attr('title', 'This thread is finished.');
            stepButton.tooltip();
            buttons.blockReason.html('');
        } else if (isThreadBlocked(i)) {
            stepButton.attr('disabled', true);
            stepButton.attr('title', 'This thread is blocked.');
            stepButton.tooltip();

            var reason = isThreadBlocked(i);
            if (reason === true) {
                // (Default filler.)
                reason = "This thread is blocked.";
            }
            buttons.blockReason.html('<span class="glyphicon glyphicon-time"></span>&nbsp;' + reason);
        } else {
            stepButton.attr('disabled', false);
            stepButton.attr('title', '');
            stepButton.tooltip('destroy');
            buttons.blockReason.html('');
        }

        var isExpandable = (currentInstruction instanceof ExpandableInstruction);
        buttons.expand.attr('disabled', !(isExpandable && !threadState.expanded));
    }
};

var updateMSDNLinks = function() {
    $('a').each(function(i) {
        if (!$(this).hasClass("msdn-link")) {
            if (this.href.indexOf("msdn.microsoft.com") !== -1) {
                $(this).addClass("msdn-link");
                $(this).attr('target', '_blank');
            }
        }
        if (!$(this).hasClass("wikipedia-link")) {
            if (this.href.indexOf("en.wikipedia.org") !== -1) {
                $(this).addClass("wikipedia-link");
                $(this).attr('target', '_blank');
            }
        }
    });
};

$(updateMSDNLinks);
