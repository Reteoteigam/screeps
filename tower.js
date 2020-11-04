/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

let LOGGER = require("util.log");


let tower = {
  run: function(){
    
    let tower = Game.getObjectById('5ed4cba3a4cff4f0498745d9');
if(!tower){
    return;
}
	   // for(let name in Game.structures) {
    //     let structure = Game.structures[name];
	        
            // if (structure.structureType == STRUCTURE_TOWER){
            //     Game.flags['Home'].room.visual.text(
            // // "123456789_123456789_123456789_123456789_123456789_123456789_123456789_",
            // "HI",
            // Game.flags['Home'].pos.x + 1, 
            // Game.flags['Home'].pos.y, 
            // {align: 'left', opacity: 0.8}); 
            // }
        
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            
            
              
            let closestDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) =>  
                    ((structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART ) && structure.hits < structure.hitsMax)
                    || ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART ) && structure.hits < 5000)

            });
            closestDamagedStructure.sort((a,b) => a.hits - b.hits);
            if (closestDamagedStructure && closestDamagedStructure.length > 0) {
                LOGGER.debug("[tower] repair"+ closestDamagedStructure[0].pos);
                tower.repair(closestDamagedStructure[0])
            }
        
	   // }
        
      
  }
};

module.exports = tower