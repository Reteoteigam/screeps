const LOGGER = require('util.log');

var managerConstruction = {
    run: function(room) {
        // 1. Initialisierung des Speichers, falls nicht vorhanden
        if (!room.memory.layout) {
            room.memory.layout = {
                extensionSpots: [],
                plannedLevel: 0
            };
        }

        // 2. PLANUNG: Nur wenn sich das Level erhöht hat oder noch nie geplant wurde
        if (room.memory.layout.plannedLevel !== room.controller.level) {
            this.planRoom(room);
        }

        // 3. BAU-AUSFÜHRUNG: Alle 100 Ticks prüfen, ob Baustellen gesetzt werden müssen
        if (Game.time % 100 === 0) {
            this.buildFromLayout(room);
        }
    },

    planRoom: function(room) {
        LOGGER.debug("Starte Raumplanung für: " + room.name);
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn) return;

        let spots = [];
        // Wir suchen genug Plätze für das maximale Level (60 Extensions)
        for (let dist = 2; dist < 15 && spots.length < 60; dist++) {
            for (let x = spawn.pos.x - dist; x <= spawn.pos.x + dist; x++) {
                for (let y = spawn.pos.y - dist; y <= spawn.pos.y + dist; y++) {

                    // Schachbrett-Logik
                    if ((x + y) % 2 === 0) {
                        let terrain = room.getTerrain().get(x, y);
                        // Prüfen ob Land (0) und kein Gebäude im Weg (vereinfacht)
                        if (terrain === 0) {
                            spots.push({x: x, y: y});
                        }
                    }
                }
            }
        }

        room.memory.layout.extensionSpots = spots;
        room.memory.layout.plannedLevel = room.controller.level;
        LOGGER.debug(spots.length + " Extension-Plätze im Speicher abgelegt.");
    },

    buildFromLayout: function(room) {
        const extensionQuota = { 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 };
        let maxExtensions = extensionQuota[room.controller.level] || 0;

        let existing = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        }).length;

        let sites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        }).length;

        if (existing + sites < maxExtensions) {
            let spots = room.memory.layout.extensionSpots;
            for (let spot of spots) {
                let res = room.createConstructionSite(spot.x, spot.y, STRUCTURE_EXTENSION);
                if (res === OK) {
                    LOGGER.debug(`Baustelle aus Cache gesetzt: ${spot.x},${spot.y}`);
                    // Wir hören auf, sobald eine Baustelle erfolgreich gesetzt wurde
                    // (Screeps hat ein Limit für gleichzeitige Baustellen)
                    break;
                }
            }
        }
    }
};

module.exports = managerConstruction;