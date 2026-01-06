const LOGGER = require('util.log');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');

const creepsConfig = {
    upgrader: 2,
    builder: 1
};

module.exports.loop = function () {
    // Nur alle 10 Ticks ein Status-Update im Log
    if(Game.time % 10 === 0) LOGGER.debug("Tick: " + Game.time + " | CPU Bucket: " + Game.cpu.bucket);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            LOGGER.debug('Grabstein für: ' + name);
        }
    }

    var spawn = Game.spawns['HQ'] || Object.values(Game.spawns)[0];
    if(!spawn) return;

    var creeps = _.values(Game.creeps);
    var sources = spawn.room.find(FIND_SOURCES);

    if(creeps.length === 0) {
        spawn.spawnCreep([WORK, CARRY, MOVE], 'Emergency', {memory: {role: 'harvester'}});
    }
    else if(!spawn.spawning) {
        let spawned = false;
        for (let i = 0; i < sources.length; i++) {
            let miners = _.filter(creeps, (c) => c.memory.role === 'miner' && c.memory.sourceId === sources[i].id);
            let haulers = _.filter(creeps, (c) => c.memory.role === 'hauler' && c.memory.sourceId === sources[i].id);

            if(miners.length < 1) {
                spawn.spawnCreep([WORK, WORK, MOVE], 'Miner' + i, {memory: {role: 'miner', sourceId: sources[i].id}});
                spawned = true; break;
            }
            if(haulers.length < 1) {
                spawn.spawnCreep([CARRY, MOVE, MOVE], 'Hauler' + i, {memory: {role: 'hauler', sourceId: sources[i].id}});
                spawned = true; break;
            }
        }

        if(!spawned) {
            for(let role in creepsConfig) {
                let count = _.filter(creeps, (c) => c.memory.role === role).length;
                if(count < creepsConfig[role]) {
                    spawn.spawnCreep([WORK, CARRY, MOVE], role.charAt(0).toUpperCase() + Game.time, {memory: {role: role}});
                    break;
                }
            }
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'miner': roleMiner.run(creep); break;
            case 'hauler': roleHauler.run(creep); break;
            case 'upgrader': roleUpgrader.run(creep); break;
            case 'builder': roleBuilder.run(creep); break;
            case 'harvester': roleHarvester.run(creep); break;
        }
    }
}