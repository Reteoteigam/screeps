const LOGGER = require('util.log');
const managerharvest = require('manager.harvest');
const managertransport = require('manager.transport');


let roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {


		LOGGER.debug("roleHarvester run: "+creep);
        creep.say("❗ " +creep.ticksToLive);

        let homespawn = Game.getObjectById(creep.memory.home);
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
			source= Game.getObjectById(creep.memory.target);
			let error = OK;
				error = creep.harvest(source);
            switch (error) {
                case OK:
                    // calculate the from target
                    let look = creep.pos.look();
                    look.forEach(function(lookObject) {
                      if(lookObject.type == LOOK_STRUCTURES && lookObject.structureType == STRUCTURE_CONTAINER && lookObject.store[RESOURCE_ENERGY] > 50){
                          managertransport.orderFrom(homespawn,lookObject);
                          return;
                      }
                      if(lookObject.type == LOOK_RESOURCES && lookObject.amount >=50) {
                          managertransport.orderFrom(homespawn,lookObject);
                          return;
                      }
                  });

                    break;

                case ERR_NOT_IN_RANGE:
                    creep.moveTo(source,{range: 1, reusePath: 25});
            		LOGGER.debug("roleHarvester go harvest: " + source.pos);
            		break;

                default:
                    LOGGER.error("roleHarvester harvest unknown error"+error);
            }
        }
        LOGGER.debug("roleHarvester done: "+creep);
	}
};

module.exports = roleHarvester;
