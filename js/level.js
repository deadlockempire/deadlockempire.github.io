var Level = function(id, name, short, long, victoryText, threads, variables) {
	console.assert(arguments.length == 7);
	this.id = id;
	this.name = name;
	this.shortDescription = short;
	this.longDescription = long;
	this.victoryText = victoryText;
	this.threads = threads;
	this.variables = variables;
};

Level.prototype.createFreshGlobalState = function() {
	if (this.variables) {
		// HAX
		return JSON.parse(JSON.stringify(this.variables));
	}
	return {};
};

/**
 * @param {string} levelId
 * @return {Level}
 */
var findNextLevelInCampaign = function(levelId) {
	for (var i = 0; i < campaign.length; i++) {
		var quest = campaign[i];
		for (var j = 0; j < quest.levels.length; j++) {
			if (quest.levels[j] == levelId) {
				if (j == quest.levels.length - 1) {
					if (i < campaign.length - 1) {
						// Start next quest.
						return campaign[i + 1].levels[0];
					} else {
						// This was the last level.
						return null;
					}
				} else {
					// Go to next level of quest.
					return campaign[i].levels[j + 1];
				}
			}
		}
	}
	fail("level not in campaign:", levelId);
};
