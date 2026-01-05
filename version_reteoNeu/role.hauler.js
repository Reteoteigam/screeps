const LOGGER = require('util.log');

var roleHauler = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(droppedEnergy) {
                if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // LOGGER.debug(creep.name + ": Keine freie Energie am Boden gefunden.");
            }
        } else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) 
                                && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                LOGGER.debug(creep.name + ": Alle Energiespeicher voll - warte...");
            }
        }
    }
};
module.exports = roleHauler;