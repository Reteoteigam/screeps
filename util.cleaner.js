const LOGGER = require('util.log');
const managerMap = require('manager.map');
const managerHarvest = require('manager.harvest');
const managerTransport = require('manager.transport');



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
		managerMap.cleanupLists(Game.spawns[id]);
		managerHarvest.cleanupLists(Game.spawns[id]);
		managerTransport.cleanupLists(Game.spawns[id]);
		}
    },
	
	restart:function(){
		
		for (var id in Game.spawns) {
			managerMap.restart(Game.spawns[id]);
			managerHarvest.restart(Game.spawns[id]);
			managerTransport.restart(Game.spawns[id]);

		}
		return true;
		
	}
};

module.exports = utilCleaner;