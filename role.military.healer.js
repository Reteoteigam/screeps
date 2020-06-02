
var LOGGER = require('util.log')
var anotherRoomName = "W09W59";
var inspector = require('util.inspector');


PathFinder.use(true);
var healer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        LOGGER.debug("healer run: "+inspector.stringMe(creep));


        var activeWeapons = creep.getActiveBodyparts(HEAL)<0;
        if(activeWeapons ){
            LOGGER.debug("cannot heal");
            return;
        }
            
        var target = creep.pos.findClosestByRange(
            FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            }
        );
        
        if(target) {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
            }
        }
        

    }
};

module.exports = healer;