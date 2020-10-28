/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managermap = require('manager.map');

const INDEX_INIT 				=0;    
const INDEX_SOURCE_INUSEID 		=1;
const INDEX_SOURCE_INUSEFROM 	=2;
const INDEX_SOURCE_INUSEDELIVER =3;


var managerharvest = {
     // memory  
    init : function(mainBaseName){
		//init=false;
		var memoryObject = Game.spawns[mainBaseName];
		if(!memoryObject.memory.managerharvest || !memoryObject.memory.managerharvest[INDEX_INIT]){
			LOGGER.debug("managerharvest Init with "+memoryObject);
			//init datamodel
			memoryObject.memory.managerharvest = new Array();
			//INDEX_INIT
			memoryObject.memory.managerharvest.push(false);
			//INDEX_SOURCE_INUSEID
			memoryObject.memory.managerharvest.push(new Array(0));
			//INDEX_SOURCE_INUSEFROM
			memoryObject.memory.managerharvest.push(new Array(0));
			//INDEX_SOURCE_INUSEDELIVER
			memoryObject.memory.managerharvest.push(new Array(0));
			memoryObject.memory.managerharvest[INDEX_INIT] = true;
        }
    },
    
    registerAsHarvester : function (spawn,creep){
        if(!spawn.memory.managerharvest || !spawn.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest registerAsHarvester No init for " + spawn);
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
					spawn.memory.managerharvest[INDEX_SOURCE_INUSEFROM].push(creep.name);
					creep.memory.target = currentID;
					creep.memory.targetRoom =currentRoom;
					LOGGER.debug("managerharvest Register as harvester "+creep.name+" at "+creep.memory.target+" in "+creep.memory.targetRoom);
				return currentID;
				}
			}	
		}
		LOGGER.info("managerharvest registerAsHarvester no free spot");
    },
	
	cleanupLists: function (spawn){
        if(!spawn.memory.managerharvest || !spawn.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest cleanupLists No init for " + spawn);
            return;
        }		
		
		inUseIDs = spawn.memory.managerharvest[INDEX_SOURCE_INUSEID];
		inUseFroms = spawn.memory.managerharvest[INDEX_SOURCE_INUSEFROM];

		for( var i = 0; i < inUseFroms.length; i++){
			var currentTarget = inUseFroms[i];
			
			if(!Game.creeps[currentTarget]) {
				inUseIDs.splice(i,1);
				inUseFroms.splice(i,1);
				LOGGER.debug("managerharvest cleanupLists removed: " + currentTarget);


			}				
		}
	},
	
	calculateMaxHarvester: function (spawn){
		if(!spawn.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest calculateMaxHarvester No init");
            return;
        }
		
		var sourceIDsCount = managermap.getAllSourceIDs(spawn).length;
		return sourceIDsCount;
	}
};
module.exports = managerharvest;