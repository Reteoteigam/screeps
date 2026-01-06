const LOGGER = require('util.log');

var roleUpgrader = {
    run: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('⚡ Hunger');
            LOGGER.debug(creep.name + ": Brauche Energie");
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('🏗️ Upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            // Der Upgrader wartet jetzt primär beim Controller auf den Hauler
            creep.moveTo(creep.room.controller);

            // Fallback: Wenn Energie auf dem Boden liegt, trotzdem aufheben
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(dropped && creep.pos.isNearTo(dropped)) {
                creep.pickup(dropped);
            }
        }
    }
};

module.exports = roleUpgrader;