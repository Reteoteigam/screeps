var LOGGER = require('util.log')
const cleaner = require('util.cleaner');

var roleSpawn = {

    /** @param {Creep} creep **/
    run: function(spawn,role ,roleMax, design) {
        LOGGER.debug("roleSpawn run");
    
        if(!spawn.spawning){
            cleaner.clean(); 
        }   
         
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        
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