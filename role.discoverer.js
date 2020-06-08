/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.rangeworker');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log')
var isInit = false;

var discoverer = {
    
    run: function(creep){
		LOGGER.debug("discoverer run: "+creep);
	    //firstRun? create memory buckets
	    
        var homespawn = Game.getObjectById(creep.memory.home);
	    //was attacked
	    if(creep.memory.wasAttackedin){
            creep.moveTo(homespawn);
            return;
        }
	    
		//initi
        if(!isInit){
	        if(!homespawn.memory.roomHasSource){
 		        homespawn.memory.roomHasSource = new Array();
 		    }
 		    if(!homespawn.memory.roomNoSource){
 		        homespawn.memory.roomNoSource = new Array();
 		    }
 		    if(!homespawn.memory.roomInvalid){
 		        homespawn.memory.roomInvalid = new Array();
 		    }
 		    if(!homespawn.memory.roomUndiscovered){
 		        homespawn.memory.roomUndiscovered = new Array();
 		        homespawn.memory.roomUndiscovered.push(Game.getObjectById(creep.memory.home).room.name);
 		    }
 		    if(!homespawn.memory.roomDiscovered){
 		        homespawn.memory.roomDiscovered = new Array();
 		    }
			if(!homespawn.memory.roomInProgress){
 		        homespawn.memory.roomInProgress = new Array();
 		    }
 		    if(!homespawn.memory.roomDanger){
 		        homespawn.memory.roomDanger = new Array();
 		    }
 		    isInit = true;
        }

		//startRoom?    
		if(!creep.memory.targetRoom){
		    creep.memory.targetRoom = homespawn.memory.roomUndiscovered.shift();
			
		    if(!creep.memory.targetRoom){
		        LOGGER.info("discoverer Nothing to do, dead in: " + creep.ticksToLive +" ticks.");
		        creep.moveTo(homespawn);
		        return;
		    }else{
				homespawn.memory.roomInProgress.push(creep.memory.targetRoom);
			}
		}

		//was Attacked
		var danger = false;
		let eventLog = creep.room.getEventLog();
		let attackEvents = _.filter(eventLog, {event: EVENT_ATTACK});
		attackEvents.forEach(event => {
			let target = Game.getObjectById(event.data.targetId);
			if(target && target.my) {
				danger = true;
				if(homespawn.memory.roomDanger.includes(creep.room.name)){
				    LOGGER.info("discoverer Room was danger before: "+creep.room.name);
				}else{
				    homespawn.memory.roomDanger.push(creep.room.name);
				    LOGGER.info("discoverer Room is danger: "+creep.room.name);
				}
				homespawn.memory.roomUndiscovered.push(creep.memory.targetRoom);
				// remove current target and remove it from InProgress
				for( var i = 0; i < homespawn.memory.roomInProgress.length; i++){
					if ( homespawn.memory.roomInProgress[i] == creep.memory.targetRoom) {
                        homespawn.memory.roomInProgress.splice(i, 1);
					    homespawn.memory.roomUndiscovered.push(creep.memory.targetRoom);
                        creep.memory.targetRoom = false
                        creep.memory.wasAttackedin = creep.room.name
						return;
					}
				}
			    return;	
			}
		});

		LOGGER.info("discoverer targetRoom " +creep.memory.targetRoom);
		LOGGER.info("discoverer currentRoom " +creep.room.name);      


		if(creep.memory.targetRoom == creep.room.name){
		    //are there sources?
		    var sources = creep.room.find(FIND_SOURCES);
			LOGGER.info("discoverer sources here?: "+sources.length ); 

			if(sources.length>0){
				
				if(homespawn.memory.roomHasSource.includes(creep.memory.targetRoom)){
					LOGGER.info("discoverer Source was discovered before: "+creep.memory.targetRoom);
				}else{
					homespawn.memory.roomHasSource.push(creep.memory.targetRoom);
					LOGGER.info("discoverer Source is discovered: "+ creep.memory.targetRoom);
				}
			}
			
			LOGGER.info("discoverer look for exits in targetRoom "+creep.room.name);   
			//find exits
			var exits = Game.map.describeExits(creep.room.name);
			for (var name in exits) {
			    var aNewRoom = exits[name];
			    LOGGER.info("discoverer Find exit: "+aNewRoom);
			    if(homespawn.memory.roomDiscovered.includes(aNewRoom)){
				    LOGGER.info("discoverer Room was discovered before: "+aNewRoom);    
			    }else if(homespawn.memory.roomUndiscovered.includes(aNewRoom,0)){
			        LOGGER.info("discoverer Exit was discovered before: "+aNewRoom);  
				}else{
					LOGGER.info("discoverer Undiscovered exit to Room: "+ aNewRoom);
				    homespawn.memory.roomUndiscovered.push(aNewRoom);
				}
			}
			homespawn.memory.roomDiscovered.push(creep.memory.targetRoom);
			// remove current target and remove it from InProgress
			for( var i = 0; i < homespawn.memory.roomInProgress.length; i++){
				if ( homespawn.memory.roomInProgress[i] === creep.memory.targetRoom) {
					homespawn.memory.roomInProgress.splice(i, 1);
					return;
				}
			}
			creep.memory.targetRoom=false;
		}else{
		    var newPosition= new RoomPosition(25,25,creep.memory.targetRoom);
		    LOGGER.info("discoverer Move to: "+newPosition);
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
		            LOGGER.info("discoverer move failed"+ newPosition +" error "+error);
					if(homespawn.memory.roomInvalid.includes(creep.memory.targetRoom)){
					    LOGGER.info("discoverer Room was invalid before: "+creep.memory.targetRoom);
					}else{
					    homespawn.memory.roomInvalid.push(creep.memory.targetRoom);
					    LOGGER.info("discoverer Room was invalid before: "+creep.memory.targetRoom);
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
					    LOGGER.info("discoverer Room was invalid before: "+creep.memory.targetRoom);
					    creep.memory.targetRoom =false;
					}else{
					    homespawn.memory.roomInvalid.push(creep.memory.targetRoom);
					    LOGGER.info("discoverer Room is invalid: "+creep.memory.targetRoom);
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