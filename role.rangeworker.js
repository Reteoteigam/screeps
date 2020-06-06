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
		creep.moveTo(Game.getObjectById(creep.memory.home));
		 return;
				  LOGGER.debug("rangeworker run: "+creep);
	
	
		if(!creep.memory.roomSources){
					creep.memory.roomSources = new Array(0);
		}
		if(!creep.memory.roomNoSource){
					creep.memory.roomNoSource = new Array(0);
		}
		if(!creep.memory.roomInvalid){
					creep.memory.roomInvalid = new Array(0);
		}
					
		
		
		
		//where we are?    
		var homeRoom  = Game.getObjectById(creep.memory.home).room.name;
		LOGGER.info("rangeworker startRoom " +homeRoom);   
		 
		var currentRoom =creep.room.name;
		LOGGER.info("rangeworker currentRoom " +currentRoom);      
		
		if(homeRoom == currentRoom){
			LOGGER.info("rangeworker look for exit");   
			var positionToGo;
			if(!creep.memory.roomUndiscovered){
				creep.memory.roomUndiscovered = new Array(0);
	
			//find exits
			var exits = Game.map.describeExits(homeRoom);
				for (var name in exits) {
					LOGGER.info("rangeworker exits? "+ exits[name]);
					if(exits[name]){
						creep.memory.roomUndiscovered.push(exits[name]);
					}
				}
			}
			//move to first room
			if(!creep.memory.targetRoom  && creep.memory.roomUndiscovered.length>0){
				creep.memory.targetRoom = creep.memory.roomUndiscovered.pop();
			}
		
		
		}else{
			
			var reached =    currentRoom == creep.memory.targetRoom;
			if(reached){
			}
			LOGGER.info("rangeworker do Outside Things");   
			var sources = creep.room.find(FIND_SOURCES);
			LOGGER.info("rangeworker do Outside Things"+sources.length ); 
			if(creep.memory.targetRoom != null){
				if(sources.length>0){
					for (var name in sources) {
						var source = sources[name].id;
						creep.memory.roomNoSource.push(source);
						creep.memory.targetRoom= null;
					}
				}else{
					creep.memory.roomNoSource.push(creep.memory.targetRoom);
					creep.memory.targetRoom= null;
				}
			}    

		}    
		if(creep.memory.targetRoom){
				var reached =    currentRoom == creep.memory.targetRoom;
				LOGGER.info("rangeworker reached " +reached);      
			if(reached){
					error = creep.moveTo(new RoomPosition(25,25,creep.memory.targetRoom));
					LOGGER.info("rangeworker move to targetRoom 22222" +error);
					creep.memory.targetRoom=null;
			}else{
				var error = creep.moveTo(new RoomPosition(25,25,creep.memory.targetRoom));
				
				LOGGER.info("rangeworker move to targetRoom 11111 " +error +" bei "+ creep.memory.targetRoom);
				if(error != OK){
					
					creep.memory.roomInvalid.push(creep.memory.targetRoom);
					creep.memory.targetRoom = null;
				}
			}
				   
        }
        
        //discover phase ends
		if(creep.memory.roomUndiscovered.length <=0 &&  creep.memory.targetRoom == null){
		    
		    var homespawn = Game.getObjectById(creep.memory.home);
		    
		    
		    homespawn.roomSources
		    homespawn.roomNoSource
		    homespawn.roomInvalid
		    homespawn.roomUndiscovered
		    homespawn.roomOtherPlayer
		    
			LOGGER.info("NÜSCHT!!!!!!!!!!!!!!!!!!!!!!!!!");
			creep.memory.
			creep.memory.roomUndiscovered = false;
		}
        var freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY) >0 ;
        LOGGER.info("rangeworker freeCapacity " +freeCapacity);
        LOGGER.debug("rangeworker done: "+creep);
    }
}

module.exports = rangeworker;