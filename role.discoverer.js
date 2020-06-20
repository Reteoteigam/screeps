/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.rangeworker');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managerMap = require('manager.map');
var discoverer = {
    
    run: function(creep){
        
		LOGGER.debug("discoverer run: "+creep);
        var homespawn = Game.getObjectById(creep.memory.home);
	    //was attacked
	    if(creep.memory.wasAttackedin){
            creep.moveTo(homespawn);
            return;
        }
	    
		//startRoom?  
		if(!creep.memory.targetRoom){
		    creep.memory.targetRoom = managerMap.nextUndiscovered(homespawn);

		LOGGER.debug("discoverer "+creep.memory.targetRoom);			
		    if(!creep.memory.targetRoom){
		        LOGGER.debug("discoverer Nothing to do, dead in: " + creep.ticksToLive +" ticks.");
		        creep.moveTo(homespawn);
		        return;
		    }
		}

		//was Attacked
		var eventLog = creep.room.getEventLog();
		var attackEvents = _.filter(eventLog, {event: EVENT_ATTACK});
		
		attackEvents.forEach(event => {
			var target = Game.getObjectById(event.data.targetId);
			if(target && target.my) {
				managerMap.newDanger(homespawn,creep.room.name);
				managerMap.addUndiscovered(homespawn,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);
				creep.memory.targetRoom = false;
                creep.memory.wasAttackedin = creep.room.name;
				LOGGER.debug("discoverer creep.memory.wasAttackedin "+creep.memory.wasAttackedin);	
			    return;	
			}
		});
		//is dangerous -> hostile entity?
		var hostileCreep= creep.room.find(FIND_HOSTILE_CREEPS);
		var hostilePowerCreep= creep.room.find(FIND_HOSTILE_POWER_CREEPS);
		var hostileStructureTower= creep.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: (structure) =>  
                    ((structure.structureType == STRUCTURE_TOWER)||(structure.structureType == STRUCTURE_KEEPER_LAIR))

            });
		var hostile = hostileCreep.concat(hostilePowerCreep).concat(hostileStructureTower);
		if(hostile && hostile.length >= 1) {
				managerMap.newDanger(homespawn,creep.room.name);
				managerMap.newDiscovered(homespawn,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);              
				LOGGER.debug("discoverer hostiles in "+creep.memory.targetRoom);	
				creep.memory.targetRoom= homespawn.room.name;
				LOGGER.debug("discoverer Go home");

		}
		
		

		LOGGER.debug("discoverer targetRoom " +creep.memory.targetRoom);
		LOGGER.debug("discoverer currentRoom " +creep.room.name);      
		if(creep.memory.targetRoom == creep.room.name){
		    //are there sources?
		    var sources = creep.room.find(FIND_SOURCES);
			LOGGER.debug("discoverer sources here?: "+sources.length ); 
			for( var i = 0; i < sources.length; i++){
				managerMap.newSourceLocation(homespawn,sources[i].id,creep.room.name);
			}
			
			LOGGER.debug("discoverer look for exits in targetRoom "+creep.room.name);   
			//find exits
			var exits = Game.map.describeExits(creep.room.name);
			for (var name in exits) {
			    var aNewRoom = exits[name];
			    LOGGER.debug("discoverer Find exit: "+aNewRoom);
				managerMap.newExit(homespawn,aNewRoom);
			}
			managerMap.newDiscovered(homespawn,creep.room.name);
			managerMap.stopDiscovering(homespawn,creep.room.name);
			creep.memory.targetRoom=false;
		}else{
		    var newPosition= new RoomPosition(25,25,creep.memory.targetRoom);
		    LOGGER.debug("discoverer Move to: "+newPosition);
			var error = creep.moveTo(newPosition);
			
		    switch (error) {
		        case OK:
		        case ERR_NOT_OWNER:
		        case ERR_BUSY:
		        case ERR_TIRED:
		            LOGGER.error('discoverer moved correct error was'+error);
		            break;
		        case ERR_NO_PATH:
		        case ERR_NOT_FOUND:
		        case ERR_INVALID_TARGET:
		            //FIXME: geht nicht richtig bei roaum wechsel, macht -2 tortz das der creep hätte durchgehen können
		            LOGGER.debug("discoverer move failed"+ newPosition +" error "+error);
					if(homespawn.memory.roomInvalid.includes(creep.memory.targetRoom)){
					    LOGGER.debug("discoverer Room was invalid before: "+creep.memory.targetRoom);
					}else{
					    homespawn.memory.roomInvalid.push(creep.memory.targetRoom);
					    LOGGER.debug("discoverer Room was invalid before: "+creep.memory.targetRoom);
					}
					// remove current target and remove it from InProgress
					for( var i = 0; i < homespawn.memory.roomInProgress.length; i++){
						if ( homespawn.memory.roomInProgress[i] == creep.memory.targetRoom) {
							homespawn.memory.roomInProgress.splice(i, 1);
							creep.
							return;
						}
					}
					creep.memory.targetRoom =false;
                    break;
		        default:
		            LOGGER.error("discoverer move failed"+ newPosition +" UNEXPECTED error "+error);
					if(homespawn.memory.roomInvalid.includes(creep.memory.targetRoom)){
					    LOGGER.debug("discoverer Room was invalid before: "+creep.memory.targetRoom);
					    creep.memory.targetRoom =false;
					}else{
					    homespawn.memory.roomInvalid.push(creep.memory.targetRoom);
					    LOGGER.debug("discoverer Room is invalid: "+creep.memory.targetRoom);
					    creep.memory.targetRoom =false;
					}
					// remove current target and remove it from InProgress
					for( var i = 0; i < homespawn.memory.roomInProgress.length; i++){
						if ( homespawn.memory.roomInProgress[i] == creep.memory.targetRoom) {
							homespawn.memory.roomInProgress.splice(i, 1);
							creep.
							return;
						}
					}
					creep.memory.targetRoom =false;
                    break;
		    }
	
        }
        if(creep.ticksToLive < 5){
            homespawn.memory.roomUndiscovered.push(creep.memory.targetRoom);
            creep.suicide();
        }
        LOGGER.debug("discoverer done: "+creep);
    }
}

module.exports = discoverer;