const PROTOTYPES = require('prototypes');
const LOGGER = require('util.log');
LOGGER.debug("INIT");

const managermap = require('manager.map');
const managerMineEnergy = require('manager.mine.energy');
const managertransport = require('manager.transport');
const cleaner = require('util.cleaner');

let delegator = require('delegator');
let delegatorSpawn = require('delegator.spawn')


const startBaseName = "Spawn1";


module.exports.loop = function () {
LOGGER.debug("TICK");



//	cleaner.restart();
//	return;

	if(true||Game.time%10==Math.floor(Math.random()*10+1)){
        cleaner.clean();
	}

	let memoryObject = Game.spawns[startBaseName];
    managermap.init(memoryObject);
    managerMineEnergy.init(memoryObject);
    managertransport.init(memoryObject);


    delegatorSpawn.run();

    delegator.run();
    LOGGER.debug("START TICK LOOP Game.cpu.tickLimit: " + Game.cpu.tickLimit +" Game.cpu.bucket: "+Game.cpu.bucket + " Game.cpu.getUsed: " +Math.ceil(Game.cpu.getUsed()))
}
