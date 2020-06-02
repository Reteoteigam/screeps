var LOGGER = require('util.log')

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
 LOGGER.debug("roleHarvester run: "+creep);
                creep.say("❗ " +creep.ticksToLive);
            
            
            
                
                //harvest
                var sources = creep.pos.findClosestByRange(FIND_SOURCES);
                if(sources != null && !creep.memory.busy && creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}});
                    LOGGER.debug("go harvest: " + sources.pos);
                //GEHT!     Game.spawns["HQ"].memory.NEWTEST = "BLUBBER";
                }
        LOGGER.debug("roleHarvester done: "+creep);
	}
};

module.exports = roleHarvester;