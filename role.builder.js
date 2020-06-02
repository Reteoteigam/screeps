var LOGGER = require('util.log')
const MAPPING_STRUCTURETYPE= require('util.mapping.structureType');


var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        LOGGER.debug("roleBuilder run: "+creep);

        



  	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store[RESOURCE_ENERGY] >= 0) {
	        creep.memory.building = true;
	       // creep.say('🚧 build');
	    }
        var doneSomething= false;
	    if(creep.memory.building) {
	        //repair
	        var tower = creep.room.find(STRUCTURE_TOWER);
	        if(!tower && tower[0]){
	            
    	        var repairSites = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                 
                // prio low hp + range;
                repairSites.sort((a,b) => a.hits - b.hits+ a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos));
                LOGGER.debug( "REPAIR NEED? :"+repairSites );
                if(repairSites[0]) {
                    if(creep.repair(repairSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairSites[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                    doneSomething = true;
	            }
            }else{
    
    	        //build
    	        var toBuilds = creep.room.find(FIND_CONSTRUCTION_SITES);
                // prio low hp + range;
                toBuilds.sort((a,b) => MAPPING_STRUCTURETYPE.valueOf(a.structureType) - MAPPING_STRUCTURETYPE.valueOf(b.structureType) +  a.pos.getRangeTo(creep.pos)-b.pos.getRangeTo(creep.pos));
                LOGGER.debug( "BUILD NEED? :"+toBuilds );
                if(toBuilds[0]) {
                    if(creep.build(toBuilds[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(toBuilds[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                    doneSomething=true
                }

            }
	    }

        if (!doneSomething) {
            creep.memory.building = false;
        }
	    
	    LOGGER.debug("roleBuilder done: "+creep);
        return  creep.memory.building;
	}
};

module.exports = roleBuilder;