var LOGGER = require('util.log')
const cleaner = require('util.cleaner');



var roleSpawn = {
    /** @param {Creep} creep **/
    run: function(spawn,role ,roleMax, design) {
        LOGGER.debug("roleSpawn run");
    
            //FIX ME FREIGABE BIT zum cleanen aller 1000 zyklen
        
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(!spawn.spawning && Game.time % 1000 == 0){
            cleaner.clean();
        }
  
        if(!spawn.spawning){
  
            var isNearDead ;
            for(var i in Game.creeps) {
                var element = Game.creeps[i];
                if(element.memory.role == role && element.ticksToLive <60 && creeps.length <= roleMax) {
                    isNearDead = element;
                }
            }
		    if(isNearDead ||  creeps.length < roleMax){
		
                var testIfCanSpawn;
                while(!spawn.spawning){
                    testIfCanSpawn = spawn.spawnCreep(design, 
                        'DryRun', { dryRun: true });
                    if (testIfCanSpawn!=0 && design.length >3) {
                        design = design.slice(1);
                    }else{
                        break;
                    }
            
                }
                
                
                
                var newName = role + Game.time;
                LOGGER.debug('Spawning new ' + role);
                
                spawn.spawnCreep(design, newName,{
                    memory: {
    				"role": role ,
    				"home": spawn.id
    				}
                    
                });
            }
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
     
        
	},
	renew: function(me){
	    LOGGER.debug(me +me +me +me +me +me +me +me +me +me +me +me +me +me +me +me +me );
	}
};

module.exports = roleSpawn;