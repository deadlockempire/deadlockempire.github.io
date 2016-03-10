/**
 * Describes the execution state of a level.
 */

var GameState = function() {
	// thread state:
	// {
	//	programCounter: [(number of current instruction), (number of current subinstruction)],
	//	expanded: (boolean: is current major instruction expanded),
	//  localVariables: (array of temporary local variables),
	//  arcAutoreleasePools: (array of ArcAutoreleasePools)
	// }
	this.threadState = null;

	// global variables
	// keyed by variable name
	// value is {
	//	'type': (typ),
	//	'name': (jmeno),
	//	'value': (value, JS primitive),
	//	'lastLockedByThread': (ID of last thread that locked the
	//		variable, or null),
	//	'lockCount': (lock count, 0 if none)
	// }
	this.globalState = null;

	// object counts by type name, used to generate unique names
	this.objectCounts = {};

	/** Level */
	this.level = null;
};

/**
 * @param {Level} level
 */
GameState.prototype.resetForLevel = function(level) {
	this.level = level;

	this.threadState = [];
	for (var i = 0; i < this.getThreadCount(); i++) {
		this.threadState[i] = {
			programCounter: [0, 0],
			id: i,
			expanded: false,
			localVariables: [],
			arcAutoreleasePools: [new ArcAutoreleasePool()]
		};
	}
	this.globalState = level.createFreshGlobalState();
	this.objectCounts = {};
};

GameState.prototype.getLevel = function() {
	return this.level;
};

GameState.prototype.getLevelId = function() {
	return this.level.id;
};

GameState.prototype.getProgramOfThread = function(threadId) {
	return this.getLevel().threads[threadId].instructions;
};

GameState.prototype.getThreadCount = function() {
	return this.getLevel().threads.length;
};

// Global singleton game state.
var gameState = new GameState();
