const LOGGER = require('util.log');

var roleHauler = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(droppedEnergy) {
                if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say('🛒');
                }
            }
        } else {
            // ZIEL-PRIORISIERUNG
            // 1. Strukturen (Spawn/Extensions)
            var structureTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if(structureTarget) {
                if(creep.transfer(structureTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.say('🏦');
                }
            }
            // 2. Wenn Strukturen voll: Belieferung von arbeitenden Creeps (Upgrader/Builder)
            else {
                var workerTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (c) => (c.memory.role == 'upgrader' || c.memory.role == 'builder')
                        && c.store.getFreeCapacity(RESOURCE_ENERGY) > (c.store.getCapacity() * 0.5)
                });

                if(workerTarget) {
                    if(creep.transfer(workerTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(workerTarget, {visualizePathStyle: {stroke: '#00ff00'}});
                        creep.say('🚚 ' + workerTarget.name);
                    } else {
                        LOGGER.debug(creep.name + " liefert Energie an " + workerTarget.name);
                    }
                } else {
                    creep.say('😴');
                    // Parken am Spawn, um nicht im Weg zu stehen
                    var spawn = Game.spawns['HQ'] || Object.values(Game.spawns)[0];
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#555555'}});
                }
            }
        }
    }
};

module.exports = roleHauler;