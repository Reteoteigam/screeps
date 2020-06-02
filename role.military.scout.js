
var LOGGER = require('util.log')
var anotherRoomName = "W09W59";
var inspector = require('util.inspector');

var scout = {


    /** @param {Creep} creep **/
    run: function(creep) {
        LOGGER.debug("roleScout run: "+creep);
        
        var activeWeapons = creep.getActiveBodyparts(ATTACK) >0 
            LOGGER.debug("can attack" + activeWeapons);
        activeWeapons = activeWeapons || creep.getActiveBodyparts(RANGED_ATTACK) >0;
            LOGGER.debug("can attackranged " + activeWeapons);
        if(!activeWeapons ){
            LOGGER.debug("cannot attack");
			return                ;
        }
     
     

     
        //attack something?
        if(activeWeapons ){
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }else{
                    
                }
            }
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        }
        
    }
};

module.exports = scout;