const LOGGER = require('util.log');
const managerMap = require('manager.map');
const managerMineEnergy = require('manager.mine.energy');
const managerTransport = require('manager.transport');



let utilCleaner = {

    /** @param {message} the message **/
    clean: function() {
        LOGGER.debug("cleanfunction runs");
        for(let name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                LOGGER.info("utilCleaner clean non-existing creep memory: " + name);

            }
        }
		for (let id in Game.spawns) {
		managerMap.cleanupLists(Game.spawns[id]);
		managerMineEnergy.cleanupLists(Game.spawns[id]);
		managerTransport.cleanupLists(Game.spawns[id]);
		}
    },

	restart:function(){

		for (let id in Game.spawns) {
			managerMap.restart(Game.spawns[id]);
			managerMineEnergy.restart(Game.spawns[id]);
			managerTransport.restart(Game.spawns[id]);

		}
		return true;

	}
};

module.exports = utilCleaner;
