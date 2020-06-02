/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

var tower = {
  run: function(){
    
    var tower = Game.getObjectById('5ed4cba3a4cff4f0498745d9');
if(!tower){
    return;
}
	   // for(var name in Game.structures) {
    //     var structure = Game.structures[name];
	        
    //         if (structure.structureType == STRUCTURE_TOWER){
                Game.flags['Home'].room.visual.text(
            // "123456789_123456789_123456789_123456789_123456789_123456789_123456789_",
            "HI",
            Game.flags['Home'].pos.x + 1, 
            Game.flags['Home'].pos.y, 
            {align: 'left', opacity: 0.8}); 
    //         }
        
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            
            
              
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure)
            }
        
	   // }
        
      
  }
};

module.exports = tower