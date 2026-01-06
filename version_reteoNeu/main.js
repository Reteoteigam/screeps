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
    // Zentrales Logging über util.log
    LOGGER.debug("Tick: " + Game.time);

    // 1. Memory Cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            LOGGER.debug('Speicher bereinigt: ' + name);
        }
    }

    var spawn = Game.spawns['HQ'] || Object.values(Game.spawns)[0];
    if(!spawn) return;

    // 2. Tower Management aufrufen
    manageTowers(spawn.room);

    var creeps = _.values(Game.creeps);
    var sources = spawn.room.find(FIND_SOURCES);

    // 3. Spawning Logik
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

    // 4. Rollen ausführen
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

    // Funktion zur Steuerung der Türme (kann später in eigenes Modul)
    function manageTowers(room) {
        var towers = room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER
        });

        for(let tower of towers) {
            // 1. Priorität: Angreifen
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                continue; // Wenn angegriffen wird, nicht reparieren
            }

            // 2. Priorität: Reparieren (nur wenn Energie > 50% vorhanden ist)
            if(tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * 0.5) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
