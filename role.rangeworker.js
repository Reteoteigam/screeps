/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.rangeworker');
 * mod.thing == 'a thing'; // true
 */
const home = Game.flags["Home"];

const far = Game.flags["Flag1"];

const LOGGER = require('util.log')

var rangeworker = {
    
    run: function(creep){

		LOGGER.debug("rangeworker run: "+creep);
	
        var freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY) >0 ;
        LOGGER.info("rangeworker freeCapacity " +freeCapacity);
        if (!creep.memory.moving &&  freeCapacity) {
            var homeSpawn = Game.getObjectById(creep.memory.home);
            for (var sourceIterator in  homeSpawn.memory.roomSources) {
                var sourceCurrent =  homeSpawn.memory.roomSources[sourceIterator];
                LOGGER.info("sourceCurrent.pos" + Game.getObjectById(sourceCurrent))
            }
        creep.memory.moving= true;
        }else{
            creep.memory.moving = false;
            
            
            
            
            
        }
        LOGGER.debug("rangeworker done: "+creep);
    }
}

module.exports = rangeworker;