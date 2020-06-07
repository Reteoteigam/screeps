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
var isInit = false;

var discoverer = {
    
    run: function(creep){
		LOGGER.debug("discoverer run: "+creep);
	    //firstRun? create memory buckets
        var homespawn = Game.getObjectById(creep.memory.home);
        if(!isInit){
	        if(!homespawn.memory.roomSources){
 		        homespawn.memory.roomSources = new Array();
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
 		    if(!homespawn.memory.roomOtherPlayer){
 		        homespawn.memory.roomOtherPlayer = new Array();
 		    }
 		    isInit = true;
        }
		//startRoom?    
		if(!creep.memory.targetRoom){
		    creep.memory.targetRoom = homespawn.memory.roomUndiscovered.pop();
		    if(!creep.memory.targetRoom){
		        LOGGER.info("discoverer Nothing to do, dead in: " + creep.ticksToLive +" ticks.");
		        return;
		    }
		}

		LOGGER.info("discoverer targetRoom " +creep.memory.targetRoom);
		LOGGER.info("discoverer currentRoom " +creep.room.name);      


		if(creep.memory.targetRoom == creep.room.name){
		    //are there sources?
		    var sources = creep.room.find(FIND_SOURCES);
			LOGGER.info("discoverer sources here?: "+sources.length ); 

			if(sources.length>0){
				for (var name in sources) {
					var sourceID = sources[name].id;
					if(homespawn.memory.roomSources.includes(sourceID)){
					    LOGGER.info("discoverer Source was discovered before: "+sources[name].pos);
					}else{
					    homespawn.memory.roomSources.push(sourceID);
					    LOGGER.info("discoverer Source is discovered: "+ sources[name].pos);
					}
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
return;
		}else{
		    var newPosition= new RoomPosition(25,25,creep.memory.targetRoom);
		    LOGGER.info("discoverer Move to: "+newPosition);
			var error = creep.moveTo(newPosition);
			
		    switch (error) {
		        case 'OK':
		        case 'ERR_NOT_OWNER':
		        case 'ERR_BUSY':
		        case 'ERR_TIRED':
		            break;
		        case 'ERR_NO_PATH':
		        case 'ERR_NOT_FOUND':
		        case 'ERR_INVALID_TARGET':
		            
		            creep.memory.targetRoom = false;
		            homespawn.memory.roomInvalid.set(creep.memory.targetRoom,error);
                    break;
		        default:
		            LOGGER.error('!!!!!!!!!!!!!!!!!!! unexpected status !!!!!!!!!!!!!!!!'+error);
		            creep.memory.targetRoom = false;
		            homespawn.memory.roomInvalid.set(creep.memory.targetRoom,error);
		    }
	
        }
        LOGGER.debug("discoverer done: "+creep);
    }
}

module.exports = discoverer;