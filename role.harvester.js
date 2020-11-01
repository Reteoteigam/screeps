const LOGGER = require('util.log');
const managerharvest = require('manager.harvest');


var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		
		
		LOGGER.debug("roleHarvester run: "+creep);
        creep.say("❗ " +creep.ticksToLive);

        var homespawn = Game.getObjectById(creep.memory.home);
		if(!creep.memory.target){
			managerharvest.registerAsHarvester(homespawn,creep);
		}

		if(creep.memory.targetRoom != creep.room.name){
			//move to new room
            exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
			exit = creep.pos.findClosestByRange(exitDir);
			creep.moveTo(exit, {reusePath: 25});
		}else{
			//harvest
			sources= Game.getObjectById(creep.memory.target);
			if(sources != null && creep.harvest(sources) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources,{range: 1, reusePath: 25});
				LOGGER.debug("roleHarvester go harvest: " + sources.pos);
			}
		}
        LOGGER.debug("roleHarvester done: "+creep);
	}
};

module.exports = roleHarvester;