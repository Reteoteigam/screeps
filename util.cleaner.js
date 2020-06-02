var LOGGER = require('util.log')
var utilCleaner = {

    /** @param {message} the message **/
    clean: function() {
        LOGGER.debug("cleanfunction runs");
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
};

module.exports = utilCleaner;