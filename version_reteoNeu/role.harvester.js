const LOGGER = require('util.log');

var roleHarvester = {
    run: function(creep) {
        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.delivering = false;
            LOGGER.debug(creep.name + " wechselt auf: ERNTEN");
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() === 0) {
            creep.memory.delivering = true;
            LOGGER.debug(creep.name + " wechselt auf: LIEFERN");
        }

        if(creep.memory.delivering) {
            // ZIELSUCHE: Finde die nächste Struktur, die Energie braucht
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Falls alles voll ist, parke am Spawn oder bewege dich aus dem Weg
                creep.moveTo(Game.spawns['HQ'] || Game.spawns[Object.keys(Game.spawns)[0]]);
            }
        }
        else {
            // QUELLEN-VERTEILUNG
            var sources = creep.room.find(FIND_SOURCES);
            
            // Einfacher Trick: Creeps mit geraden Namenslängen gehen zur Quelle 0, ungerade zur Quelle 1
            // Das verteilt die Last am Anfang ganz gut ohne komplexes Pathfinding.
            var sourceIndex = creep.name.length % sources.length;
            
            if(creep.harvest(sources[sourceIndex]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvester;