const LOGGER = require('util.log');

var roleMiner = {
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);

        // 1. Suche einen Container direkt neben der Quelle
        var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        })[0];

        // 2. Positionierung: Wenn ein Container da ist, stell dich drauf
        if(container) {
            if(!creep.pos.isEqualTo(container.pos)) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('🚶 Basis');
            }
        } else {
            // Falls kein Container da ist, geh einfach zur Quelle
            if(!creep.pos.isNearTo(source)) {
                creep.moveTo(source);
            }
        }

        // 3. Ernten (Energie fällt automatisch in den Container, wenn man draufsteht)
        if(creep.harvest(source) === OK) {
            // Wir loggen nur alle 50 Ticks, um das Log nicht zu fluten
            if(Game.time % 50 === 0) LOGGER.debug(creep.name + " erntet fleißig.");
        }
    }
};

module.exports = roleMiner;