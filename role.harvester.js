const LOGGER = require('util.log')
const managerharvest = require('manager.harvest');


var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
 LOGGER.debug("roleHarvester run: "+creep);
                // creep.say("❗ " +creep.ticksToLive);
            

        var homespawn = Game.getObjectById(creep.memory.home);
          
		if(!creep.memory.target){
			managerharvest.registerAsHarvester(homespawn,creep);
		}

		  
			
		LOGGER.debug("harvester targetRoom " +creep.memory.targetRoom);
		LOGGER.debug("harvester currentRoom " +creep.room.name);      
		if(creep.memory.targetRoom != creep.room.name){
			var newPosition= new RoomPosition(25,25,creep.memory.targetRoom);
		    LOGGER.debug("discoverer Move to: "+newPosition);
			var error = creep.moveTo(newPosition);
			LOGGER.debug("discoverer Move to error: "+error);
		}else{
			//harvest
			sources= Game.getObjectById(creep.memory.target);
			if(sources != null && creep.harvest(sources) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources, {
					visualizePathStyle: {stroke: '#ffff00'},
					reusePath: 50
				});
				LOGGER.debug("go harvest: " + sources.pos);
			}
			
		}
                
        LOGGER.debug("roleHarvester done: "+creep);
	}
};

module.exports = roleHarvester;