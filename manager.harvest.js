/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managermap = require('manager.map');

const INDEX_INIT 				=0;
const INDEX_SOURCE_INUSEID 		=1;
const INDEX_SOURCE_INUSEFROM 	=2;


function Mine(){
	this.harvester= null;
	this.source= null;
}

let managerharvest = {
	restart: function (memoryObject){
			memoryObject.memory.managerharvest = new Array();
			//INDEX_INIT
			memoryObject.memory.managerharvest.push(false);
			return true;
	},
     // memory
    init : function(memoryObject){
		//init=false;
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
			memoryObject.memory.managerharvest[INDEX_INIT] = true;
        }
    },


    registerAsHarvester : function (memoryObject,creep){
        if(!memoryObject.memory.managerharvest || !memoryObject.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest registerAsHarvester No init for " + memoryObject);
            return;
        }

		let sourceIDs = managermap.getAllSourceIDs(memoryObject);
		let sourceRooms = managermap.getAllSourceRooms(memoryObject);
		if(sourceIDs && sourceIDs.length >0){
			for( let i = 0; i < sourceIDs.length; i++){
				let currentID = sourceIDs[i];
				let currentRoom = sourceRooms[i];

				if(!memoryObject.memory.managerharvest[INDEX_SOURCE_INUSEID].includes(currentID)){
					memoryObject.memory.managerharvest[INDEX_SOURCE_INUSEID].push(currentID);
					memoryObject.memory.managerharvest[INDEX_SOURCE_INUSEFROM].push(creep.name);
					creep.memory.target = currentID;
					creep.memory.targetRoom =currentRoom;
					LOGGER.debug("managerharvest Register as harvester "+creep.name+" at "+creep.memory.target+" in "+creep.memory.targetRoom);
				return currentID;
				}
			}
		}
		LOGGER.info("managerharvest registerAsHarvester no free spot");
    },

	cleanupLists: function (memoryObject){
        if(!memoryObject.memory.managerharvest || !memoryObject.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest cleanupLists No init for " + memoryObject);
            return;
        }

		inUseIDs = memoryObject.memory.managerharvest[INDEX_SOURCE_INUSEID];
		inUseFroms = memoryObject.memory.managerharvest[INDEX_SOURCE_INUSEFROM];

		for( let i = 0; i < inUseFroms.length; i++){
			let currentTarget = inUseFroms[i];

			if(!Game.creeps[currentTarget]) {
				inUseIDs.splice(i,1);
				inUseFroms.splice(i,1);
				LOGGER.debug("managerharvest cleanupLists removed: " + currentTarget);


			}
		}
	},

	calculateMaxHarvester: function (memoryObject){
		if(!memoryObject.memory.managerharvest[INDEX_INIT]){
            LOGGER.error("managerharvest calculateMaxHarvester No init");
            return;
        }

		let sourceIDsCount = managermap.getAllSourceIDs(memoryObject).length;
		return sourceIDsCount;
	}
};
module.exports = managerharvest;
