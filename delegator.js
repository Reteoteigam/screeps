var LOGGER = require('util.log')
var renewCreeps = require('util.renew');

var roleRangeWorker = require('role.rangeworker');
var roleHarvester = require('role.harvester');
var tower =  require('tower');

var militaryGroup = require('role.military.group');
var civilGroup = require('role.civil.group');

var delegator = {
    
    /** @param {Creep} creep **/
    run: function() {

  
        tower.run();
    
	  
	    for(var name in Game.creeps) {
			var creep = Game.creeps[name];
            var role = creep.memory.role;
		    if(!renewCreeps.run(creep)){
                switch (role) {
    				case "ROLE_SCOUT":
    				case "ROLE_HEAL":
    				case "ROLE_TANK":
    					LOGGER.debug("MILITARY.GROUP");
    					militaryGroup.group(creep); 
    				break;
    				
    				case "ROLE_BUILDER":
    				case "ROLE_DELIVERER":
    					LOGGER.debug("CIVIL_GROUP");
    					civilGroup.run(creep);  
    				break;
    				
    				case "ROLE_HARVESTER":
    					LOGGER.debug("ROLE_HARVESTER");
    					roleHarvester.run(creep);
                	break;
    				
    				case "ROLE_RANGEWORKER":
    					LOGGER.debug("ROLE_RANGEWORKER");
    					roleRangeWorker.run(creep);
    				
    			  default:
    				LOGGER.debug("UNKNOWN ROLE"+ role);
    				break;
    			}    
		    }
		
        }
	}
};

module.exports = delegator;