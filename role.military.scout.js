
let LOGGER = require('util.log')
let anotherRoomName = "W09W59";
let inspector = require('util.inspector');

let scout = {


    /** @param {Creep} creep **/
    run: function(creep) {
        LOGGER.debug("roleScout run: "+creep);
        
        let activeWeapons = creep.getActiveBodyparts(ATTACK) >0 
            LOGGER.debug("can attack" + activeWeapons);
        activeWeapons = activeWeapons || creep.getActiveBodyparts(RANGED_ATTACK) >0;
            LOGGER.debug("can attackranged " + activeWeapons);
        if(!activeWeapons ){
            LOGGER.debug("cannot attack");
			return                ;
        }
     
     

     
        //attack something?
        if(activeWeapons ){
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            
            
            if(target) {
                
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target,{visualizePathStyle: {stroke: '#ff0000'}});
                }else{
                    
                }
            }
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target,{visualizePathStyle: {stroke: '#ff0000'}});
                }
        }
        
    }
};

module.exports = scout;