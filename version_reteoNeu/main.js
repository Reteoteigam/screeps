const LOGGER = require('util.log');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
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

    // 2. Spawning mit Logging
    if(creeps.length === 0) {
        LOGGER.debug("NOTFALL: Keine Creeps vorhanden! Spawne Emergency Harvester.");
        spawn.spawnCreep([WORK, CARRY, MOVE], 'Emergency' + Game.time, {memory: {role: 'harvester'}});
    } 
    else if(!spawn.spawning) {
        sources.forEach((source, index) => {
            var miners = _.filter(creeps, (c) => c.memory.role == 'miner' && c.memory.sourceId == source.id);
            var haulers = _.filter(creeps, (c) => c.memory.role == 'hauler' && c.memory.sourceId == source.id);

            if(miners.length < 1) {
                let res = spawn.spawnCreep([WORK, WORK, MOVE], 'Miner' + index, {memory: {role: 'miner', sourceId: source.id}});
                if(res == OK) LOGGER.debug("Spawne Miner für Source " + index);
            } 
            else if(haulers.length < 1) {
                let res = spawn.spawnCreep([CARRY, MOVE, MOVE], 'Hauler' + index, {memory: {role: 'hauler', sourceId: source.id}});
                if(res == OK) LOGGER.debug("Spawne Hauler für Source " + index);
            }
        });
    }

    // 3. Rollen ausführen
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') roleMiner.run(creep);
        if(creep.memory.role == 'hauler') roleHauler.run(creep);
        if(creep.memory.role == 'harvester') roleHarvester.run(creep);
    }
}