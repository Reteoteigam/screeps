const LOGGER = require('util.log');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader'); // NEU
var roleHarvester = require('role.harvester');

module.exports.loop = function () {
    LOGGER.debug("--- Tick: " + Game.time + " ---");

    // 1. Memory Cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            LOGGER.debug('Speicher bereinigt: ' + name);
        }
    }

    var spawn = Game.spawns['HQ'] || Object.values(Game.spawns)[0];
    if(!spawn) return;

    var creeps = _.values(Game.creeps);
    var sources = spawn.room.find(FIND_SOURCES);

    // 2. Erweitertes Spawning
    if(creeps.length === 0) {
        LOGGER.debug("NOTFALL: Spawne Emergency Harvester.");
        spawn.spawnCreep([WORK, CARRY, MOVE], 'Emergency' + Game.time, {memory: {role: 'harvester'}});
    }
    else if(!spawn.spawning) {
        // Erst Miner und Hauler sicherstellen
        let spawnBusier = false;

        for (let i = 0; i < sources.length; i++) {
            let miners = _.filter(creeps, (c) => c.memory.role == 'miner' && c.memory.sourceId == sources[i].id);
            let haulers = _.filter(creeps, (c) => c.memory.role == 'hauler' && c.memory.sourceId == sources[i].id);

            if(miners.length < 1) {
                spawn.spawnCreep([WORK, WORK, MOVE], 'Miner' + i, {memory: {role: 'miner', sourceId: sources[i].id}});
                spawnBusier = true;
                break;
            } else if(haulers.length < 1) {
                spawn.spawnCreep([CARRY, MOVE, MOVE], 'Hauler' + i, {memory: {role: 'hauler', sourceId: sources[i].id}});
                spawnBusier = true;
                break;
            }
        }

        // Wenn Miner/Hauler da sind, Upgrader bauen
        if(!spawnBusier) {
            var upgraders = _.filter(creeps, (c) => c.memory.role == 'upgrader');
            if(upgraders.length < 2) {
                spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, {memory: {role: 'upgrader'}});
            }
        }
    }

    // 3. Rollen ausführen
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') roleMiner.run(creep);
        if(creep.memory.role == 'hauler') roleHauler.run(creep);
        if(creep.memory.role == 'upgrader') roleUpgrader.run(creep); // NEU
        if(creep.memory.role == 'harvester') roleHarvester.run(creep);
    }
}