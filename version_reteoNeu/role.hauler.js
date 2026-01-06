const LOGGER = require('util.log');

var roleHauler = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            // 1. Energiequelle suchen: Erst Container, dann Boden
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });

            if(container) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say('📦 Cont');
                }
            } else {
                // Fallback: Energie am Boden
                var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(dropped) {
                    if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropped);
                        creep.say('🛒 Boden');
                    }
                }
            }
        } else {
            // LIEFERLOGIK (bleibt gleich wie vorher: Spawn -> Worker)
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.say('🏦');
                }
            } else {
                // Belieferung von Upgradern/Buildern
                var worker = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (c) => (c.memory.role == 'upgrader' || c.memory.role == 'builder')
                        && c.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                if(worker) {
                    if(creep.transfer(worker, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(worker);
                        creep.say('🚚');
                    }
                }
            }
        }
    }
};

module.exports = roleHauler;