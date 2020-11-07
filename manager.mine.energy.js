/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managermap = require('manager.map');

const INDEX_INIT = 0;
const INDEX_MINE = 1;



function Mine() {
  this.miner = null;
  this.source = null;
  this.room = null;
  //later type of resource
}

let managerMineEnergy = {
  restart: function(memoryObject) {
    memoryObject.memory.managermine = new Array();
    //INDEX_INIT
    memoryObject.memory.managermine.push(false);
    return true;
  },
  // memory
  init: function(memoryObject) {
    //init=false;
    if (!memoryObject.memory.managermine || !memoryObject.memory.managermine[INDEX_INIT]) {
      LOGGER.debug("managerMineEnergy Init with " + memoryObject);
      //init datamodel
      memoryObject.memory.managermine = new Array();
      //INDEX_INIT
      memoryObject.memory.managermine.push(false);
      //INDEX_MINE
      memoryObject.memory.managermine.push(new Array(0));
      memoryObject.memory.managermine[INDEX_INIT] = true;
    }
  },


  registerAsMiner: function(memoryObject, target) {
    if (!memoryObject.memory.managermine || !memoryObject.memory.managermine[INDEX_INIT]) {
      LOGGER.error("managertransport orderTo No init for " + memoryObject);
      return;
    }

    let mines = memoryObject.memory.managermine[INDEX_MINE];
    let newMine = mines.find(e => e.miner === target.id);
    //describe order
    if (!newMine) {
      newMine = mines.find(e => e.miner === null);
      if (!newMine) {
        newMine = new Mine();
        newMine.miner = target.id;
        newMine.source = null;
        newMine.room = null;

        mines.push(newMine);
        LOGGER.error("managertransport registerAsTransporter add mine:" + newMine);
      } else {
        newMine.miner = target.id;
        LOGGER.error("managertransport registerAsTransporter at mine:" + newMine);
      }

    }
    target.memory.targetRoom = newMine.room;
    target.memory.target = newMine.source;
  },

  cleanupLists: function(memoryObject) {
    if (!memoryObject.memory.managermine || !memoryObject.memory.managermine[INDEX_INIT]) {
      LOGGER.error("managermine cleanupLists No init for " + memoryObject);
      return;
    }

    //
    this.updateMines(memoryObject);
    //clean from INDEX_MINE
    let mines = memoryObject.memory.managermine[INDEX_MINE];
    mines.forEach(this.filterDeathMiner);
    mines = mines.filter(this.filterDeathSource); //later filter dangerousRooms
    memoryObject.memory.managermine[INDEX_MINE] = mines;
  },

  updateMines: function(memoryObject) {
    sourceIDs = managermap.getAllSourceIDs(memoryObject);
    sourceRooms = managermap.getAllSourceRooms(memoryObject);
    for (var i = 0; i < sourceIDs.length; i++) {
      this.registerSource(memoryObject, sourceIDs[i], sourceRooms[i]);
    }
  },

  registerSource: function(memoryObject, targetID, targetRoom) {
    if (!memoryObject.memory.managermine || !memoryObject.memory.managermine[INDEX_INIT]) {
      LOGGER.error("managerMineEnergy registerSource No init for " + memoryObject);
      return;
    }

    let mines = memoryObject.memory.managermine[INDEX_MINE];
    let newMine = mines.find(e => e.source === targetID);
    //describe order
    if (!newMine) {
      newMine = mines.find(e => e.source === null);
      if (!newMine) {
        newMine = new Mine();
        newMine.miner = null;
        newMine.source = targetID;
        newMine.room = targetRoom;

        mines.push(newMine);
        LOGGER.error("managerMineEnergy registerSource add mine:" + newMine);
      } else {
        newMine.source = targetID;
        newMine.room = targetRoom;
        LOGGER.error("managerMineEnergy registerSource at mine:" + newMine);
      }
    }
  },


  filterDeathMiner: function(mine) {
    let targetID = mine.miner;
    if (!Game.getObjectById(targetID)) {
      mine.miner = null;
      LOGGER.error("managerMineEnergy filterDeathMiner removed " + targetID);
    }
  },

  filterDeathSource: function(mine) {
    let targetID = mine.source;
    let is = true;
    if (!Game.getObjectById(targetID)) {
      mine.source = null;
      LOGGER.error("managerMineEnergy filterDeathTransporter removed " + targetID);
    }
    is = !(!mine.miner && !mine.source && !mine.room);
    // because of JS falsey ... or I write ===null ...
    return is;
  },





  calculateMaxMiner: function(memoryObject) {
    if (!memoryObject.memory.managermine[INDEX_INIT]) {
      LOGGER.error("managerMineEnergy calculateMaxMiner No init");
      return;
    }

    let sourceIDsCount = managermap.getAllSourceIDs(memoryObject).length;
    return sourceIDsCount;
  }
};
module.exports = managerMineEnergy;
