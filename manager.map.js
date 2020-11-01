/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

var LOGGER = require('util.log')

const INDEX_INIT 		=0
const INDEX_INVALID     =1;
const INDEX_UNDISCOVERED=2;
const INDEX_DISCOVERED  =3;
const INDEX_DISCOVERING =4;
const INDEX_SOURCE      =5;
const INDEX_SOURCE_ID   =0;
const INDEX_SOURCE_ROOM =1;
const INDEX_DANGER      =6;


var managermap = {
	restart: function (memoryObject){
				memoryObject.memory.managermap = new Array();
				//INDEX_INIT
				memoryObject.memory.managermap.push(false);
				return true;
	},
    // memory  
    init : function(memoryObject){
		//init=false;
		
if(!memoryObject.memory.managermap || !memoryObject.memory.managermap[INDEX_INIT]){
			LOGGER.debug("managermap Init with "+memoryObject);
			//init datamodel
			memoryObject.memory.managermap = new Array();
			//INDEX_INIT
			memoryObject.memory.managermap.push(false);
			//INDEX_INVALID 1
			memoryObject.memory.managermap.push(new Array(0));
			//INDEX_UNDISCOVERED 2
			memoryObject.memory.managermap.push(new Array(0));
			//INDEX_DISCOVERED 3
			memoryObject.memory.managermap.push(new Array(0));
			//INDEX_DISCOVERING 4
			memoryObject.memory.managermap.push(new Array(0)); 			
			
			//INDEX_SOURCE 5
			memoryObject.memory.managermap.push(new Array(0));
			//INDEX_SOURCE_ID 5 1
			memoryObject.memory.managermap[INDEX_SOURCE].push(new Array(0));
			//INDEX_SOURCE_ROOM 5 2
			memoryObject.memory.managermap[INDEX_SOURCE].push(new Array(0));
   
			//INDEX_DANGER 6
			memoryObject.memory.managermap.push(new Array(0));
			// starting point
			memoryObject.memory.managermap[INDEX_UNDISCOVERED].push(memoryObject.room.name);

            memoryObject.memory.managermap[INDEX_INIT] = true;
        }
    },
	
	cleanupLists: function (memoryObject){
        if(!memoryObject.memory.managermap || !memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managerharvest cleanupLists No init for " + memoryObject);
            return;
        }		
		
		// clean invalids into undiscovered
		while(memoryObject.memory.managermap[INDEX_INVALID].length >0){
			var next = memoryObject.memory.managermap[INDEX_INVALID].shift();
			if(next){
			memoryObject.memory.managermap[INDEX_UNDISCOVERED].push(next);
			return
			}
		}
		// clean invalids into undiscovered
		while(memoryObject.memory.managermap[INDEX_INVALID].length >0){
			var next = memoryObject.memory.managermap[INDEX_INVALID].shift();
			if(next){
			memoryObject.memory.managermap[INDEX_UNDISCOVERED].push(next);
			return;
			}
		}
		
		while(memoryObject.memory.managermap[INDEX_DISCOVERING].length >0){
			var next = memoryObject.memory.managermap[INDEX_DISCOVERING].shift();
			if(next){
			memoryObject.memory.managermap[INDEX_UNDISCOVERED].push(next);
			return;
			}
		}

		return;
	},
    
    nextUndiscovered : function (memoryObject){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap nextUndiscovered No init");
            return;
        }
		if(memoryObject.memory.managermap[INDEX_UNDISCOVERED].length <=0){
			return;
		}
        var next = memoryObject.memory.managermap[INDEX_UNDISCOVERED].shift();
        if(next){
        memoryObject.memory.managermap[INDEX_DISCOVERING].push(next);
        return next;
		}
        return;
    },
    
    addUndiscovered : function (memoryObject, newUndiscovered){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap addUndiscovered No init");
            return;
        }
        
        var undiscovered = memoryObject.memory.managermap[INDEX_UNDISCOVERED];			
		if(undiscovered.includes(newUndiscovered)){
		    LOGGER.debug("managermap Room was undiscovered before: "+newUndiscovered);
		}else{
		    undiscovered.push(newUndiscovered);
		    LOGGER.debug("managermap Room is undiscovered: "+newUndiscovered);
		}
    },
    
    newDanger : function (memoryObject, newDanger){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap newDanger No init");
            return;
        }
        
        var dangerList = memoryObject.memory.managermap[INDEX_DANGER];	
		if(dangerList.includes(newDanger)){
		    LOGGER.debug("managermap Room was danger before: "+newDanger);
		}else{
		    dangerList.push(newDanger);
		    LOGGER.debug("managermap Room is danger: "+newDanger);
		}
    },
	
    newInvalid : function (memoryObject, newInvalid){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap newInvalid No init");
            return;
        }
				
        var invalidList = memoryObject.memory.managermap[INDEX_INVALID];			
		if(invalidList.includes(newInvalid)){
		    LOGGER.debug("managermap Room was invalid before: "+newInvalid);
		}else{
		    invalidList.push(newInvalid);
		    LOGGER.debug("managermap Room is invalid: "+newInvalid);
		}
    },
    
    stopDiscovering : function(memoryObject,stopDiscovering){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap stopDiscovering No init");
            return;
        }
        // remove current target and remove it from InProgress
        var discoveringList = memoryObject.memory.managermap[INDEX_DISCOVERING];	
        for( var i = 0; i < discoveringList.length; i++){
        	if ( discoveringList[i] == stopDiscovering) {
                discoveringList.splice(i, 1);
        		return;
        	}
        }
    	LOGGER.debug("managermap Stop discovering at: "+stopDiscovering);
    },
    
    newSourceLocation : function(memoryObject,newSourceID,newSourceRoom){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap newSourceLocation No init");
            return;
        }
		
        var sourceLocationList = memoryObject.memory.managermap[INDEX_SOURCE];
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
	
	getAllSourceIDs : function (memoryObject){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap getAllSourceIDs No init");
            return;
        }
		
        var sourceLocationList = memoryObject.memory.managermap[INDEX_SOURCE];
        var sourceLocationIDs = sourceLocationList[INDEX_SOURCE_ID];
		return sourceLocationIDs; 
		
    },
    
    newExit : function (memoryObject, newExit){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap newExit No init");
            return;
        }

        var discovered = memoryObject.memory.managermap[INDEX_DISCOVERED];
        var unDiscovered = memoryObject.memory.managermap[INDEX_UNDISCOVERED];
    	if(discovered.includes(newExit)){
		    LOGGER.debug("managermap Room was discovered before: "+newExit);    
	    }else if(unDiscovered.includes(newExit,0)){
	        LOGGER.debug("managermap Exit was discovered before: "+newExit);  
		}else{
			LOGGER.debug("managermap Undiscovered exit to Room: "+ newExit);
		    unDiscovered.push(newExit);
		}
    },
    
    newDiscovered : function (memoryObject, newDiscovered){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap newDiscovered No init!");
            return;
        }
        
        var discoveredList = memoryObject.memory.managermap[INDEX_DISCOVERED]			
        if(discoveredList.includes(newDiscovered)){
            LOGGER.debug("managermap Room was danger before: "+newDiscovered);
        }else{
            discoveredList.push(newDiscovered);
            LOGGER.debug("managermap Room is danger: "+newDiscovered);
        }
    },
	
	getAllSourceRooms : function(memoryObject){
        if(!memoryObject.memory.managermap[INDEX_INIT]){
            LOGGER.error("managermap getAllSourceRooms No init");
            return;
        }
		
        var sourceLocationList = memoryObject.memory.managermap[INDEX_SOURCE];
        var sourceLocationRooms = sourceLocationList[INDEX_SOURCE_ROOM];
		return sourceLocationRooms; 
		
    }
    
};
module.exports = managermap;