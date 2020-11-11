/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.military.group');
 * mod.thing == 'a thing'; // true
 */
let scouting = true;
const LOGGER = require( 'util.log' )
let roleMilitaryHealer = require( 'role.military.healer' );
let roleMilitaryScout = require( 'role.military.scout' );

let group = {

  /** @param {reep} creep **/
  group: function( creep ) {
    //talk but not every time
    if ( creep.memory.tick >= 2 ) {
      creep.say( "🧡" );
      creep.memory.tick = 0
    }
    creep.memory.tick++;


    roleMilitaryHealer.run( creep );
    roleMilitaryScout.run( creep );




    //LOGGER.debug(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS));


    if ( scouting && creep.ticksToLive >= 500 ) {
      let flagTo = Game.flags[ "Group" ];
      if ( flagTo ) {
        LOGGER.debug( "move from " + creep.pos + " to " + flagTo.pos );
        creep.moveTo( flagTo, {
          visualizePathStyle: {
            stroke: '#ff0000'
          },
          reusePath: 10
        } );
      }

    }

    if ( creep.ticksToLive < 500 ) {
      let flagTo = Game.flags[ "Home" ];
      if ( flagTo ) {
        LOGGER.debug( "move from " + creep.pos + " to " + flagTo.pos );
        creep.moveTo( flagTo, {
          visualizePathStyle: {
            stroke: '#ff0000'
          },
          reusePath: 10
        } );
      }
    }



  }
}


module.exports = group;