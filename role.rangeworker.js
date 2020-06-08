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


var rangeworker = {
    
    run: function(creep){

		LOGGER.info("rangeworker run: "+creep);
	isInit = false;
        
        //init
        var homeSpawn = Game.getObjectById(creep.memory.home);
        if(!isInit){
            if(!homeSpawn.memory.sourceInUse){
                homeSpawn.memory.sourceInUse= new Array();
            }
            if(!homeSpawn.memory.sourceInvalid){
                homeSpawn.memory.sourceInvalid= new Array();
            }
            isInit= true;
        }
        
        
        
        var freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY) >0 ;
        LOGGER.info("rangeworker freeCapacity " +freeCapacity);
        if(freeCapacity){
                if (!creep.memory.targetRoom) {
                    for (var sourceIterator in  homeSpawn.memory.roomHasSource) {
                        var currentRoom =  homeSpawn.memory.roomHasSource[sourceIterator];
                        if(homeSpawn.room.name != currentRoom){
                            creep.memory.target = currentRoom
                            if(!homeSpawn.memory.sourceInUse.includes(currentRoom) && !homeSpawn.memory.sourceInvalid.includes(currentRoom) ){
                                homeSpawn.memory.sourceInUse.push(currentRoom);wwww
                                creep.memory.targetRoom = currentRoom
                            break;
                            }
                        }
                    }
                        
                }
                
                
                if(creep.memory.targetRoom == creep.room.name){
                    var sources = creep.room.find(FIND_SOURCES);
        			LOGGER.info("rangeworker sources here?: "+sources.length ); 
        			if(sources.length>0){
        				
            			if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00'},reusePath: 50});
                            LOGGER.debug("go harvest: " + sources[0].pos);
                        }
        			}
                }else{
        			LOGGER.info("rangeworker Move to room: : "+creep.memory.targetRoom ); 
        			if(creep.memory.targetRoom){
                    var error = creep.moveTo(new RoomPosition(25,25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ffff00'},reusePath: 50});
                    LOGGER.info("!!!!!!!!!!!!!!!"+ error);
        			}else{
        			   homeSpawn.memory.sourceInvalid = creep.memory.targetRoom;
        			   creep.memory.targetRoom=false;
        			}
        			if(!creep.memory.targetRoom){
                        creep.memory.targetRoom = "W9S59"; 
        			}
                }
                
                
                
        }else{
            if(homeSpawn.room.name == creep.room.name ){
                LOGGER.info("rangeworker Move to spawn : "+homeSpawn); 
                var error = creep.moveTo(homeSpawn, {visualizePathStyle: {stroke: '#ffff00'},reusePath: 50});
                LOGGER.info("rangeworker Move to spawn : "+error); 
                if(creep.ticksToLive >= 1400){
                    creep.drop(RESOURCE_ENERGY);
                }else{
                    LOGGER.info("rangeworker Wait for Repair");
                }
                
            }else{
            	LOGGER.info("rangeworker Move to room: : "+homeSpawn.room.name ); 
                creep.moveTo(new RoomPosition(25,25, homeSpawn.room.name), {visualizePathStyle: {stroke: '#ffff00'},reusePath: 50});
            }
        }
            
            
            
            
            
        
        LOGGER.debug("rangeworker done: "+creep);
    }
}

module.exports = rangeworker;