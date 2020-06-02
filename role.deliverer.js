var LOGGER = require('util.log')




const d = new Date();
var renewTicks = d.getSeconds() ;


var roleDeliverer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        LOGGER.debug("rolePickuprun: "+creep);
        // var roadPossible = creep.pos.lookFor(LOOK_STRUCTURES).length <1;
        // roadPossible = roadPossible && creep.pos.lookFor(LOOK_CONSTRUCTION_SITES).length <1;
        // if(roadPossible){
        //     creep.say('🚧 construct');
        //  creep.pos.createConstructionSite(STRUCTURE_ROAD);
        // }

        //get source
        //capacity?
        
        
        
        
        //improved to 30 -70% work
        if(creep.memory.filling || (creep.store.getUsedCapacity()/creep.store.getCapacity()) <= 0.3) {
        creep.memory.filling=true;
            //pickup
	        var sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (droptedSource) => {
                            return droptedSource.energy > 10
                        }
                });

            if(sources != null && creep.pickup(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}});
                creep.say("🔄: R" + sources.pos.x +" " + sources.pos.y);
                LOGGER.debug("go pickup: " + sources.pos);
                
            }
            if(!sources){
            // CONTAINER GRABBING nicht gehen
                sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
                        }
                });

                if(sources != null && creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}});
                creep.say("🔄: C" + sources.pos.x +" " + sources.pos.y);
                }

            }
			if(!sources){
				//harvest
				sources = creep.pos.findClosestByRange(FIND_SOURCES);
				if(sources != null && !creep.memory.busy && creep.harvest(sources) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}});
					LOGGER.debug("go harvest: " + sources.pos);
					creep.say("🔄: S" + sources.pos.x +" " + sources.pos.y);
				}
			}
        }
        if(!creep.memory.filling || creep.store.getUsedCapacity()/creep.store.getCapacity() >= 0.7) {
        creep.memory.filling=false;
            //deliver
   
            
            var target = Game.getObjectById(creep.memory.currentTarget);
            if(!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                creep.memory.debug = null;//creep.memory.debug + 1;
                creep.memory.debugCurrent = null;//creep.memory.debug;
                // renewTicks = d.getMilliseconds();
                target= null;
                creep.memory.currentTarget=null;
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN || 
                                    structure.structureType == STRUCTURE_TOWER || 
                                    structure.structureType == STRUCTURE_CONTAINER) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                targets.sort((a,b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY) + a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos));
                if (targets.length>=1) {
                creep.memory.currentTarget=targets[0].id;
                }else{
                    var targets = creep.room.find(FIND_MY_CREEPS, {
						filter: (creep) => {
							return (creep.memory.role == 'ROLE_BUILDER') &&
							creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					});
					targets.sort((a,b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY) + a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos));
					if (targets.length>=1) {
                        creep.memory.currentTarget=targets[0].id;
                    }else{
                        creep.memory.currentTarget= null;

                    }
                }
            }
            var target = Game.getObjectById(creep.memory.currentTarget);
            if(target){
            	if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
						LOGGER.debug("go transfering: " + target.pos);
            	}else{
					if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
						LOGGER.debug("go transfering: " + target.pos);
					}
				}
            }   
        }

	}
};
 
module.exports = roleDeliverer;