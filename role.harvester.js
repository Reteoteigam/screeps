var LOGGER = require('util.log')

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
 LOGGER.debug("roleHarvester run: "+creep);
                // creep.say("❗ " +creep.ticksToLive);
            
            
            
                //harvest
                if(!creep.memory.target){
                creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES).id;
                }
                sources= Game.getObjectById(creep.memory.target);
                if(sources != null && !creep.memory.busy && creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {
                        visualizePathStyle: {stroke: '#ffff00'},
                        reusePath: 50
                    });
                    LOGGER.debug("go harvest: " + sources.pos);
                }
        LOGGER.debug("roleHarvester done: "+creep);
	}
};

module.exports = roleHarvester;