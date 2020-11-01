var LOGGER = require('util.log')
var renewCreeps = require('util.renew');


var roleDiscoverer = require('role.discoverer');
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
		    //if(!renewCreeps.renewTicks(creep)){
		    if(true){
            var role = creep.memory.role;
            switch (role) {
				case "ROLE_SCOUT":
				case "ROLE_HEAL":
				case "ROLE_TANK":
					LOGGER.debug("MILITARY.GROUP");
					militaryGroup.group(creep); 
				break;
				
				case "ROLE_BUILDER":
				case "ROLE_TRANSPORTER":
					LOGGER.debug("CIVIL_GROUP");
					civilGroup.run(creep);  
				break;
				
				case "ROLE_HARVESTER":
					LOGGER.debug("ROLE_HARVESTER");
					roleHarvester.run(creep);
            	break;
				
				case "ROLE_DISCOVERER":
					LOGGER.debug("ROLE_DISCOVERER");
					roleDiscoverer.run(creep);    			
				break;
				
			  default:
				LOGGER.debug("UNKNOWN ROLE"+ role);
				break;
			}    
		    }
		
        }
	}
};

module.exports = delegator;