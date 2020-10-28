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
    
    printError: function(error){	
		result = "";
		switch (error) {
		    case OK:
				result = "OK";
				break;
		    case ERR_NOT_OWNER:
				result = "ERR_NOT_OWNER";
				break;
			case ERR_BUSY:
				result = "ERR_BUSY";
				break;
			case ERR_TIRED:
				result = "ERR_TIRED";
				break;
			case ERR_NO_PATH:
				result = "ERR_NO_PATH";
				break;
			case ERR_NOT_FOUND:
				result = "ERR_NOT_FOUND";
				break;
			case ERR_INVALID_TARGET:
				result = "ERR_INVALID_TARGET";
				break;
			default:
				result = "unknown:"+error;
				break;
		}
		return result+"("+error+")";
	},
	
	discovererMoveTo: function(creep,target){
		error = creep.moveTo(target,{visualizePathStyle: {stroke: '#999999'}});
		switch (error) {
			case OK:
			case ERR_NOT_OWNER:
			case ERR_BUSY:
			case ERR_TIRED:
				LOGGER.debug("discoverer moved correct to "+ target +" error was "+ this.printError(error));
				break;
			case ERR_NO_PATH:
			case ERR_NOT_FOUND:
			case ERR_INVALID_TARGET:
				//FIXME: geht nicht richtig bei raum wechsel, macht -2 trotz das der creep hätte durchgehen können
				LOGGER.error("discoverer move failed "+ target +" error " + this.printError(error));
				var homespawn = Game.getObjectById(creep.memory.home);
				managerMap.newInvalid(homespawn,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);			
				creep.memory.targetRoom =false;
				break;
			default:
				LOGGER.error("discoverer move failed"+ target +" UNEXPECTED error " + this.printError(error));
				var homespawn = Game.getObjectById(creep.memory.home);
				managerMap.newInvalid(newInvalid,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);			
				creep.memory.targetRoom =false;
				break;
		}
	},
	
    run: function(creep){
		LOGGER.debug("discoverer run: "+creep);
        var homespawn = Game.getObjectById(creep.memory.home);
	    //was attacked
	    if(creep.memory.wasAttackedin){
			this.move(creep, homespawn);
            return;
        }
	    
		//startRoom?  
		if(!creep.memory.targetRoom){
		    creep.memory.targetRoom = managerMap.nextUndiscovered(homespawn);

		LOGGER.debug("discoverer "+creep.memory.targetRoom);			
		    if(!creep.memory.targetRoom){
		        LOGGER.debug("discoverer Nothing to do, dead in: " + creep.ticksToLive +" ticks.");
		        this.discovererMoveTo(creep, homespawn);
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
			
			LOGGER.error("discoverer look for exits in targetRoom "+creep.room.name);   
			//find exits
			var exits = Game.map.describeExits(creep.room.name);
			for (var name in exits) {
			    var aNewRoom = exits[name];
			    LOGGER.error("discoverer Find exit: "+aNewRoom);
				managerMap.newExit(homespawn,aNewRoom);
			}
			managerMap.newDiscovered(homespawn,creep.room.name);
			managerMap.stopDiscovering(homespawn,creep.room.name);
			creep.memory.targetRoom=false;
		}else{
		    var newPosition= new RoomPosition(25,25,creep.memory.targetRoom);
		    LOGGER.debug("discoverer Move to: "+newPosition);
			this.discovererMoveTo(creep, newPosition);
        }
        if(creep.ticksToLive < 5){
            homespawn.memory.roomUndiscovered.push(creep.memory.targetRoom);
            creep.suicide();
        }
        LOGGER.debug("discoverer done: "+creep);
    }
}

module.exports = discoverer;