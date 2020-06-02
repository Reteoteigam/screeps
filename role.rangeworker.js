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

var homeControl = home.room.find(FIND_MY_STRUCTURES);

var farSource = far.room.find(FIND_SOURCES_ACTIVE);

         LOGGER.debug("rangeworker run: "+creep);
        
  	    if(creep.memory.collecting && creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.collecting = false;
			// creep.say('🔄 harvest');
	    }
	    if(!creep.memory.collecting && creep.store.getFreeCapacity() >= 0) {
	        creep.memory.collecting = true;
			// creep.say('🚧 build');
		}
   
	  
	  
	  
	  
	  
	   var WTF =  "";
	    if(creep.memory.collecting) {
              WTF = creep.moveTo(farSource, {visualizePathStyle: {stroke: '#ffff00'}});
            if(farSource != null && creep.harvest(farSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(farSource, {visualizePathStyle: {stroke: '#ffff00'}});
                LOGGER.debug("go harvest: " + farSource.pos);
            }
      
      
      
      
      
	    }else{
	    }
	    
	    

	        
	    
	    
        var message ="go harvest: " + creep.harvest(farSource)+"";
        //go Home
      
        home.room.visual.text(
            // "123456789_123456789_123456789_123456789_123456789_123456789_123456789_",
            "::::"+message,
            home.pos.x + 1, 
            home.pos.y, 
            {align: 'left', opacity: 0.8});
            
        far.room.visual.text(
            // "123456789_123456789_123456789_123456789_123456789_123456789_123456789_",
            "::::"+message+"creep.memory.collecting"+creep.memory.collecting,
            far.pos.x + 1, 
            far.pos.y, 
            {align: 'left', opacity: 0.8});    
  
        LOGGER.debug("rangeworker done: "+creep);
            
    }
}

module.exports = rangeworker;