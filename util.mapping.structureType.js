/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.mapping.sctructuretype');
 * mod.thing == 'a thing'; // true
 */
 
 
const valueMap = new Map();
valueMap.set(STRUCTURE_ROAD,1);


const sortedStructures = [ STRUCTURE_ROAD,
     STRUCTURE_TOWER,
     STRUCTURE_EXTENSION,
     STRUCTURE_CONTAINER,
     STRUCTURE_SPAWN,
     STRUCTURE_WALL,
     STRUCTURE_RAMPART,
     STRUCTURE_KEEPER_LAIR,
     STRUCTURE_PORTAL,
     STRUCTURE_CONTROLLER,
     STRUCTURE_LINK,
     STRUCTURE_STORAGE,
     STRUCTURE_OBSERVER,
     STRUCTURE_POWER_BANK,
     STRUCTURE_POWER_SPAWN,
     STRUCTURE_EXTRACTOR,
     STRUCTURE_LAB,
     STRUCTURE_TERMINAL,
     STRUCTURE_NUKER,
     STRUCTURE_FACTORY,
     STRUCTURE_INVADER_CORE];
var isInit = false;

var mapping = {
    valueOf: function(structureType){
        return sortedStructures.indexOf(structureType); 
    }
};

module.exports = mapping;