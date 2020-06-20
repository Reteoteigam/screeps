/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

var LOGGER = require('util.log')
const managermap = require('manager.map');
var init = false;
    
const INDEX_SOURCE_INUSEID =0;
const INDEX_SOURCE_INUSEFROM =1;
const INDEX_SOURCE_INUSEDELIVER =2;


var managerharvest = {
     // memory  
    init : function(mainBaseName){
		LOGGER.debug("init: "+init);
		//init=false;
        if(!init){
			
		    var memoryObject = Game.spawns[mainBaseName];
			if(!memoryObject.memory.managerharvest){
				//init datamodel
				memoryObject.memory.managerharvest = new Array();
				memoryObject.memory.managerharvest.push(new Array(0));
				memoryObject.memory.managerharvest.push(new Array(0));
				memoryObject.memory.managerharvest.push(new Array(0));
				
        	}
		init = true;
        }
		
    },
    
    registerAsHarvester : function (spawn,creep){
        if(!init){
            LOGGER.error("managerharvest No init");
            return;
        }
			
		var sourceIDs = managermap.getAllSourceIDs(spawn);
		var sourceRooms = managermap.getAllSourceRooms(spawn);
		if(sourceIDs && sourceIDs.length >0){
			for( var i = 0; i < sourceIDs.length; i++){
				var currentID = sourceIDs[i];
				var currentRoom = sourceRooms[i];
				if(!spawn.memory.managerharvest[INDEX_SOURCE_INUSEID].includes(currentID)){
				spawn.memory.managerharvest[INDEX_SOURCE_INUSEID].push(currentID);
				spawn.memory.managerharvest[INDEX_SOURCE_INUSEFROM].push(creep.id);
				creep.memory.target = currentID;
				creep.memory.targetRoom =currentRoom;
				LOGGER.debug("managerharvest Register as harvester "+creep.name+" at "+creep.memory.target+" in "+creep.memory.targetRoom);
				return currentID;
				}
			}		
		}
    },
	
	calculateMaxHarvester: function (spawn){
        if(!init){
            LOGGER.error("managerharvest No init");
            return;
        }
		
		var sourceIDsCount = managermap.getAllSourceIDs(spawn).length;
		return sourceIDsCount;
	}
};
module.exports = managerharvest;