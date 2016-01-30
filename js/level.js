var Level = function(id, name, short, long, victoryText, threads, variables) {
	this.id = id;
	this.shortDescription = short;
	this.longDescription = long;
	this.name = name;
	this.victoryText = victoryText;
	this.threads = threads;
	this.variables = variables;
};

var findNextLevelInCampaign = function(levelId) {
	for (var i = 0; i < campaign.length; i++) {
		var quest = campaign[i];
		var levels = quest.levels;
		var found = false;
		//console.log(levels);
		for (var j = 0; j < levels.length; j++) {
			if (levelId == levels[j]) {
			//	console.log('found as ', j);
				found = true;
				break;
			}
		}

		if (found) {
			if (j == levels.length - 1) {
				//console.log('next campaign');
				if (i < campaign.length - 1) {
					return campaign[i + 1][0];
				} else {
					// TODO: game over, finished
					return null;
				}
			} else {
				return campaign[i].levels[j + 1];
			}
		}
	}
	console.log("level not in campaign!");
};
