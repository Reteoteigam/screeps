const LOGGER = require('util.log');

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Statuswechsel: Wenn leer, sammle Energie. Wenn voll, upgrade Controller.
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            LOGGER.debug(creep.name + ': Sammle Energie');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            LOGGER.debug(creep.name + ': Upgrade Controller');
        }

        if(creep.memory.upgrading) {
            // Versuche den Controller zu upgraden
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
        else {
            // Energie beschaffen:
            // 1. Priorität: Liegende Energie am Boden (vom Miner)
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(dropped && dropped.amount > 20) {
                if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } 
            // 2. Priorität: Aus dem Spawn ziehen, aber nur wenn dieser fast voll ist (> 200 Energie)
            // Das verhindert, dass der Upgrader dem Spawn die Energie klaut, die für neue Creeps gebraucht wird.
            else {
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

module.exports = roleUpgrader;