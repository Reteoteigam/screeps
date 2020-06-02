var LOGGER = require('util.log');



var delegator = require('delegator');
var delegatorSpawn = require('delegator.spawn')




LOGGER.debug("INIT");

module.exports.loop = function () {
LOGGER.debug("TICK");    

    delegatorSpawn.run();

    delegator.run();
    LOGGER.debug("START TICK LOOP Game.cpu.tickLimit: " + Game.cpu.tickLimit +" Game.cpu.bucket: "+Game.cpu.bucket + " Game.cpu.getUsed: " +Math.ceil(Game.cpu.getUsed()))
}