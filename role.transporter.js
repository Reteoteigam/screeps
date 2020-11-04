const LOGGER = require('util.log');
const managertransport = require('manager.transport');

const d = new Date();
let renewTicks = d.getSeconds();


let roleTransporter = {
    /** @param {Creep} creep **/
    run: function(creep) {
  
        LOGGER.debug("rolePickuprun: "+creep);
		
		//registerTransport
        let homespawn = Game.getObjectById(creep.memory.home);
		if(!creep.memory.orderDoing){
			managertransport.registerAsTransporter(homespawn,creep);			
			creep.memory.orderDoing=true;
		}

		
//run order
		if(creep.memory.orderDoing){
			//prefer 90% storage
			if((creep.store.getUsedCapacity()/creep.store.getCapacity()) <= 0.8){
				let target = Game.getObjectById(creep.memory.from);
				if(target){
					let error =this.pickupOrWithdraw(creep,target);
					LOGGER.error("##########pickupOrWithdraw: "+creep+error);
				}else{
					creep.memory.orderDoing = false;
				}
				
				

				
			}
			
			
		}	

		// DEFAULT:
        //improved to 30 -70% work
        if(creep.memory.filling || (creep.store.getUsedCapacity()/creep.store.getCapacity()) <= 0.3) {
        creep.memory.filling=true;	
            //pickup
            let sources = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                        filter: (tombstone) => {
                            return tombstone.creep.store.energy >10
                        }
                });

            if(sources != null && creep.withdraw(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}, reusePath: 25});
                creep.say("🔄: T" + sources.pos.x +" " + sources.pos.y);
                LOGGER.debug("go pickup: " + sources.pos);
                
            }
            if(!sources){
    	        let sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (droptedSource) => {
                                return droptedSource.energy > 10
                            }
                    });
    
                this.pickupFromDropped(creep, sources);   
            }
            if(!sources){
            // CONTAINER GRABBING nicht gehen
                sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
                        }
                });

				this.withdrawFromContainer(creep, sources);

            }
        }
        if(!creep.memory.filling || creep.store.getUsedCapacity()/creep.store.getCapacity() >= 0.7) {
        creep.memory.filling=false;
            //deliver
   
            
            let target = Game.getObjectById(creep.memory.target);
            if(!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                
                
                // renewTicks = d.getMilliseconds();
                target= null;
                creep.memory.target=false;
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN || 
                                    structure.structureType == STRUCTURE_TOWER || 
                                    structure.structureType == STRUCTURE_CONTAINER) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                targets.sort((a,b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY) + (a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos))*2);
                if (targets.length>=1) {
                creep.memory.target=targets[0].id;
                }else{
                    let targets = creep.room.find(FIND_MY_CREEPS, {
						filter: (creep) => {
							return (creep.memory.role == 'ROLE_BUILDER') &&
							creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					});
					targets.sort((a,b) => a.store.getUsedCapacity(RESOURCE_ENERGY)- 10 - b.store.getUsedCapacity(RESOURCE_ENERGY)-10 /*+ a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos)*/);
					if (targets.length>=1) {
                        creep.memory.target=targets[0].id;
                    }else{
                        creep.memory.target= false;

                    }
                }
            }
            target = Game.getObjectById(creep.memory.target);
            if(target){
            	if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 25});
						LOGGER.debug("go transfering: " + target.pos);
            	}else{
					if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 25});
						LOGGER.debug("go transfering: " + target.pos);
					}
				}
            }   
        }

	},
	
	pickupOrWithdraw: function(creep,target){
		let error = this.pickupFromDropped(creep,target);
		if(error != OK){
			error = this.withdrawFromContainer(creep,target);
		}
		return error;
	},
	
	
	pickupFromDropped: function(creep, sources){
		let error = creep.pickup(sources);
		if(error == ERR_NOT_IN_RANGE) {
			error = creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}, reusePath: 25});
			creep.say("🔄: R" + sources.pos.x +" " + sources.pos.y);
			LOGGER.debug("go pickup: " + sources.pos);
		}
		return error;
		
	},
	
	withdrawFromContainer: function(creep, sources){
		let error = creep.withdraw(sources, RESOURCE_ENERGY);
		if(sources != null && creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			error = creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffff00'}, reusePath: 25});
			creep.say("🔄: C" + sources.pos.x +" " + sources.pos.y);
		}
		return error;
	}
};
 
module.exports = roleTransporter;