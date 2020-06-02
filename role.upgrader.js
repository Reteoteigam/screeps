var LOGGER = require('util.log')
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        LOGGER.debug("roleUpgrader run: "+creep);

        creep.upgradeController(creep.room.controller)
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});

        LOGGER.debug("roleUpgrader done");
        return creep.memory.upgrading;
        
	}
};

module.exports = roleUpgrader;