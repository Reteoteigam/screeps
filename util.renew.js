/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.renew');
 * mod.thing == 'a thing'; // true
 */


var LOGGER = require('util.log')

const home = Game.spawns['HQ'];
var renewCreeps = {

    /** @param {message} the message **/
    run: function(creep) {
        LOGGER.debug("renewCreeps run");
        
        // LOGGER.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+creep.id+" T "+creep.ticksToLive);
        
        
        LOGGER.debug("renewCreeps done");
    }
};

module.exports = renewCreeps;