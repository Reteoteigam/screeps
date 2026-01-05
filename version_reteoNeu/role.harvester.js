const LOGGER = require('util.log');

var roleHarvester = {
    run: function(creep) {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
            LOGGER.debug(creep.name + " wechselt auf: ERNTEN");
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
            creep.memory.delivering = true;
            LOGGER.debug(creep.name + " wechselt auf: LIEFERN");
        }

        // ... (Rest der Logik wie zuvor)
    }
};
module.exports = roleHarvester;