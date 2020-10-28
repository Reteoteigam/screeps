const LOGGER = require('util.log');
const managerHarvest = require('manager.harvest');
var utilCleaner = {

    /** @param {message} the message **/
    clean: function() {
        LOGGER.debug("cleanfunction runs");
		LOGGER.error("cleanfunction runs");
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                LOGGER.info("utilCleaner clean non-existing creep memory: " + name);
		
            }
        }
		for (var id in Game.spawns) {
		managerHarvest.cleanupLists(Game.spawns[id]);
		}
    }
};

module.exports = utilCleaner;