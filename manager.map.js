/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

var LOGGER = require('util.log')
var init = false;

    
const INDEX_INVALID     =0;
const INDEX_UNDISCOVERED=1;
const INDEX_DISCOVERED  =2;
const INDEX_DISCOVERING =3;
const INDEX_SOURCE      =4;
const INDEX_SOURCE_ID   =0;
const INDEX_SOURCE_ROOM =1;
const INDEX_DANGER      =5;


var managermap = {
    // memory  
    init : function(mainBaseName){
		LOGGER.debug("init: "+init);
		//init=false;
        if(!init){
			
			var memoryObject = Game.spawns[mainBaseName];
			if(!memoryObject.memory.managermap){
				LOGGER.debug("managermap Init with "+memoryObject);
				//init datamodel
				memoryObject.memory.managermap = new Array();
				memoryObject.memory.managermap.push(new Array(0));
				memoryObject.memory.managermap.push(new Array(0));
				memoryObject.memory.managermap.push(new Array(0));
				memoryObject.memory.managermap.push(new Array(0));                
				
				//sourcetable
				memoryObject.memory.managermap.push(new Array(0));
				memoryObject.memory.managermap[INDEX_SOURCE].push(new Array(0));
				memoryObject.memory.managermap[INDEX_SOURCE].push(new Array(0));
	   
				memoryObject.memory.managermap.push(new Array(0));
				memoryObject.memory.managermap.push(new Array(0));
				// starting point
				memoryObject.memory.managermap[INDEX_UNDISCOVERED].push(memoryObject.room.name);
			}
		init= true;
        }
    },
    
    nextUndiscovered : function (spawn){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
		if(spawn.memory.managermap[INDEX_UNDISCOVERED].length <=0){
			return;
		}
        var next = spawn.memory.managermap[INDEX_UNDISCOVERED].shift();
        if(next){
        spawn.memory.managermap[INDEX_DISCOVERING].push(next);
        return next;
		}
        return;
    },
    
    addUndiscovered : function (spawn, newUndiscovered){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
        
        var undiscovered = spawn.memory.managermap[INDEX_UNDISCOVERED]			
		if(undiscovered.includes(newUndiscovered)){
		    LOGGER.debug("managermap Room was undiscovered before: "+newUndiscovered);
		}else{
		    undiscovered.push(newUndiscovered);
		    LOGGER.debug("managermap Room is undiscovered: "+newUndiscovered);
		}
    },
    
    newDanger : function (spawn, newDanger){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
        
        var dangerList = spawn.memory.managermap[INDEX_DANGER]			
		if(dangerList.includes(newDanger)){
		    LOGGER.debug("managermap Room was danger before: "+newDanger);
		}else{
		    dangerList.push(newDanger);
		    LOGGER.debug("managermap Room is danger: "+newDanger);
		}
    },
    
    stopDiscovering : function(spawn,stopDiscovering){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
        // remove current target and remove it from InProgress
        var discoveringList = spawn.memory.managermap[INDEX_DISCOVERING];	
        for( var i = 0; i < discoveringList.length; i++){
        	if ( discoveringList[i] == stopDiscovering) {
                discoveringList.splice(i, 1);
        		return;
        	}
        }
    	LOGGER.debug("managermap Stop discovering at: "+stopDiscovering);
    },
    
    newSourceLocation : function(spawn,newSourceID,newSourceRoom){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
		
        var sourceLocationList = spawn.memory.managermap[INDEX_SOURCE];
        var sourceLocationID = sourceLocationList[INDEX_SOURCE_ID];
        var sourceLocationRoom = sourceLocationList[INDEX_SOURCE_ROOM];
		LOGGER.debug(sourceLocationList);
        if(sourceLocationID.includes(newSourceID)){
        	LOGGER.debug("managermap Source was discovered before: "+newSourceID + " in room "+newSourceRoom);
        }else{
            sourceLocationID.push(newSourceID);
            sourceLocationRoom.push(newSourceRoom);
            LOGGER.debug("managermap Source is discovered: "+newSourceID + " in room "+newSourceRoom);
        }
    },
	
	getAllSourceIDs : function(spawn){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
		
        var sourceLocationList = spawn.memory.managermap[INDEX_SOURCE];
        var sourceLocationIDs = sourceLocationList[INDEX_SOURCE_ID];
		return sourceLocationIDs; 
		
    },
    
    newExit : function (spawn, newExit){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }

        var discovered = spawn.memory.managermap[INDEX_DISCOVERED];
        var unDiscovered = spawn.memory.managermap[INDEX_UNDISCOVERED];
    	if(discovered.includes(newExit)){
		    LOGGER.debug("managermap Room was discovered before: "+newExit);    
	    }else if(unDiscovered.includes(newExit,0)){
	        LOGGER.debug("managermap Exit was discovered before: "+newExit);  
		}else{
			LOGGER.debug("managermap Undiscovered exit to Room: "+ newExit);
		    unDiscovered.push(newExit);
		}
    },
    
    newDiscovered : function (spawn, newDiscovered){
        if(!init){
            LOGGER.error("managermap newDiscovered No init!");
            return;
        }
        
        var discoveredList = spawn.memory.managermap[INDEX_DISCOVERED]			
        if(discoveredList.includes(newDiscovered)){
            LOGGER.debug("managermap Room was danger before: "+newDiscovered);
        }else{
            discoveredList.push(newDiscovered);
            LOGGER.debug("managermap Room is danger: "+newDiscovered);
        }
    },
	
	getAllSourceRooms : function(spawn){
        if(!init){
            LOGGER.error("managermap No init");
            return;
        }
		
        var sourceLocationList = spawn.memory.managermap[INDEX_SOURCE];
        var sourceLocationRooms = sourceLocationList[INDEX_SOURCE_ROOM];
		return sourceLocationRooms; 
		
    }
    
};
module.exports = managermap;