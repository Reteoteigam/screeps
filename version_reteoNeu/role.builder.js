const LOGGER = require('util.log');

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Zustandswechsel
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 Sammeln');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 Bauen');
        }

        if(creep.memory.building) {
            // 1. Priorität: Baustellen (Construction Sites)
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            // 2. Priorität: Wenn nichts zu bauen ist -> Upgraden
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            // Energie holen (wie der Upgrader)
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(dropped && dropped.amount > 20) {
                if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if(spawn && spawn.store[RESOURCE_ENERGY] > 200) {
                    if(creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;