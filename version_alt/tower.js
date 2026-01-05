/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

let LOGGER = require( "util.log" );


let tower = {
  run: function( memoryObject ) {

    LOGGER.debug( "tower run on " + memoryObject );
    let targetList = memoryObject.room.find( FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_TOWER
      }
    } );

    for ( var i = 0; i < targetList.length; i++ ) {
      this.doTowerTask( targetList[ i ] );
    }


    // for(let name in Game.structures) {
    //     let structure = Game.structures[name];

    // if (structure.structureType == STRUCTURE_TOWER){
    //     Game.flags['Home'].room.visual.text(
    // // "123456789_123456789_123456789_123456789_123456789_123456789_123456789_",
    // "HI",
    // Game.flags['Home'].pos.x + 1,
    // Game.flags['Home'].pos.y,
    // {align: 'left', opacity: 0.8});
    // }



    // }


  },

  doTowerTask: function( aTower ) {
    LOGGER.debug( "tower doTowerTask " + aTower );
    let closestHostile = aTower.pos.findClosestByRange( FIND_HOSTILE_CREEPS );
    if ( closestHostile ) {
      aTower.attack( closestHostile );
      return;
    }



    let closestDamagedStructure = aTower.room.find( FIND_STRUCTURES, {
      filter: ( structure ) =>
        ( ( structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART ) && structure.hits <
          structure.hitsMax ) ||
        ( ( structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART ) && structure.hits < 5000 )

    } );
    closestDamagedStructure.sort( ( a, b ) => a.hits - b.hits );
    if ( closestDamagedStructure && closestDamagedStructure.length > 0 ) {
      LOGGER.debug( "tower repair " + aTower + " target: " + closestDamagedStructure[ 0 ].pos );
      aTower.repair( closestDamagedStructure[ 0 ] );
    }
  }
}
module.exports = tower