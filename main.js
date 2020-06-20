var LOGGER = require('util.log');
LOGGER.debug("INIT");

const managermap = require('manager.map');
const managerharvest = require('manager.harvest');

var delegator = require('delegator');
var delegatorSpawn = require('delegator.spawn')


const startBaseName = "HQ";


module.exports.loop = function () {
LOGGER.debug("TICK");    

    managermap.init(startBaseName);
    managerharvest.init(startBaseName);

    delegatorSpawn.run();
    
    delegator.run();
    LOGGER.debug("START TICK LOOP Game.cpu.tickLimit: " + Game.cpu.tickLimit +" Game.cpu.bucket: "+Game.cpu.bucket + " Game.cpu.getUsed: " +Math.ceil(Game.cpu.getUsed()))
}