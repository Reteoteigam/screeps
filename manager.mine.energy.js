/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require( 'util.log' );
const managermap = require( 'manager.map' );

const INDEX_INIT = 0;
const INDEX_MINE = 1;



function Mine() {
  this.miner = null;
  this.source = null;
  this.room = null;
  //later type of resource
}

let managerMineEnergy = {
  restart: function( memoryObject ) {
    memoryObject.memory.managermine = new Array();
    //INDEX_INIT
    memoryObject.memory.managermine.push( false );
    return true;
  },
  // memory
  init: function( memoryObject ) {
    //init=false;
    if ( !memoryObject.memory.managermine || !memoryObject.memory.managermine[ INDEX_INIT ] ) {
      LOGGER.debug( "managerMineEnergy Init with " + memoryObject );
      //init datamodel
      memoryObject.memory.managermine = new Array();
      //INDEX_INIT
      memoryObject.memory.managermine.push( false );
      //INDEX_MINE
      memoryObject.memory.managermine.push( new Array( 0 ) );
      memoryObject.memory.managermine[ INDEX_INIT ] = true;
    }
  },


  registerAsMiner: function( memoryObject, target ) {
    if ( !memoryObject.memory.managermine || !memoryObject.memory.managermine[ INDEX_INIT ] ) {
      LOGGER.error( "managertransport orderTo No init for " + memoryObject );
      return;
    }

    let mines = memoryObject.memory.managermine[ INDEX_MINE ];
    var newMine = mines.find( e => e.miner == target.id );
    //describe order
    if ( !newMine ) {
      newMine = mines.find( e => e.miner === null );
      if ( !newMine ) {
        newMine = new Mine();
        newMine.miner = target.id;
        newMine.source = null;
        newMine.room = null;

        mines.push( newMine );
        LOGGER.error( "managertransport registerAsTransporter add mine:" + newMine );
      } else {
        newMine.miner = target.id;
        LOGGER.error( "managertransport registerAsTransporter at mine:" + newMine );
      }
    }
    newMine.miner = target.id;
    target.memory.targetRoom = newMine.room;
    target.memory.target = newMine.source;
  },

  cleanupLists: function( memoryObject ) {
    if ( !memoryObject.memory.managermine || !memoryObject.memory.managermine[ INDEX_INIT ] ) {
      LOGGER.error( "managermine cleanupLists No init for " + memoryObject );
      return;
    }

    //
    this.updateMines( memoryObject );
    //clean from INDEX_MINE
    let mines = memoryObject.memory.managermine[ INDEX_MINE ];
    //mines.forEach(this.filterDeathSource);
    mines.forEach( this.filterDeathMiner ); //later filter dangerousRooms
    memoryObject.memory.managermine[ INDEX_MINE ] = mines;
  },

  updateMines: function( memoryObject ) {
    sourceIDs = managermap.getAllSourceIDs( memoryObject );
    sourceRooms = managermap.getAllSourceRooms( memoryObject );
    for ( var i = 0; i < sourceIDs.length; i++ ) {
      this.registerSource( memoryObject, sourceIDs[ i ], sourceRooms[ i ] );
    }
    let mines = memoryObject.memory.managermine[ INDEX_MINE ];



    mines.sort( ( a, b ) => this.sortMines( a, b, memoryObject.room.name ) );
  },

  sortMines: function( mineA, mineB, targetRoom ) {
    roomA = mineA.room;
    roomB = mineB.room;
    LOGGER.error( "managerMineEnergy sortMines" + roomA + " " + roomB + " " + targetRoom );
    // if (roomName1 == roomName2) return 0;
    //let posA = roomName1.split(/([N,E,S,W])/);
    //    let posB = roomName2.split(/([N,E,S,W])/);
    //let xDif = posA[1] == posB[1] ? Math.abs(posA[2] - posB[2]) : posA[2] + posB[2] + 1;
    //let yDif = posA[3] == posB[3] ? Math.abs(posA[4] - posB[4]) : posA[4] + posB[4] + 1;
    //if (diagonal) return Math.max(xDif, yDif); // count diagonal as 1
    //return xDif + yDif; // count diagonal as 2

    let distanceA = Game.map.getRoomLinearDistance( roomA, targetRoom );
    let distanceB = Game.map.getRoomLinearDistance( roomB, targetRoom );
    return distanceA - distanceB;
  },

  registerSource: function( memoryObject, targetID, targetRoom ) {
    if ( !memoryObject.memory.managermine || !memoryObject.memory.managermine[ INDEX_INIT ] ) {
      LOGGER.error( "managerMineEnergy registerSource No init for " + memoryObject );
      return;
    }

    let mines = memoryObject.memory.managermine[ INDEX_MINE ];
    let newMine = mines.find( e => e.source == targetID );
    //describe order
    if ( !newMine ) {
      newMine = mines.find( e => e.source === null );
      if ( !newMine ) {
        newMine = new Mine();
        newMine.miner = null;
        newMine.source = targetID;
        newMine.room = targetRoom;

        mines.push( newMine );
        LOGGER.error( "managerMineEnergy registerSource add mine:" + newMine );
      } else {
        newMine.source = targetID;
        newMine.room = targetRoom;
        LOGGER.error( "managerMineEnergy registerSource at mine:" + newMine );
      }
    }
  },


  filterDeathMiner: function( mine ) {
    let targetID = mine.miner;
    if ( !Game.getObjectById( targetID ) ) {
      mine.miner = null;
      LOGGER.error( "managerMineEnergy filterDeathMiner removed " + targetID );
    }
  },

  filterDeathSource: function( mine ) {
    //resource not death but invis for me
  },





  calculateMaxMiner: function( memoryObject ) {
    if ( !memoryObject.memory.managermine[ INDEX_INIT ] ) {
      LOGGER.error( "managerMineEnergy calculateMaxMiner No init" );
      return;
    }

    let sourceIDsCount = managermap.getAllSourceIDs( memoryObject ).length;
    return sourceIDsCount;
  }
};
module.exports = managerMineEnergy;