var LOGGER = require('util.log')
const cleaner = require('util.cleaner');



var roleSpawn = {

    /** @param {Creep} creep **/
    run: function(spawn,role ,roleMax, design) {
        LOGGER.debug("roleSpawn run");
    
        
        
    
        if(!spawn.spawning ){ //FIX ME FREIGABE BIT zum cleanen aller 1000 zyklen
            cleaner.clean(); 
        }   
         
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(!spawn.spawning && Game.time % 1000 == 1 ){
            cleaner.clean();
        }
        
        
        if(!spawn.spawning && creeps.length < roleMax) {
            var newName = role + Game.time;
            LOGGER.debug('Spawning new ' + role);
            
            spawn.spawnCreep(design, newName,{
                memory: {
				"role": role ,
				"home": spawn.id
				}
                
            });
  
        }
    
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }

     
     
     
     
     

        LOGGER.debug("roleSpawn done");
     
        
	}
};

module.exports = roleSpawn;