/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('util.renew');
 * mod.thing == 'a thing'; // true
 */


let LOGGER = require( 'util.log' )
let utilpath = require( "util.path" );


let renewCreeps = {
  /** @param {message} the message **/
  renewTicks: function( creep ) {
    // return;

    LOGGER.debug( creep.memory.home );
    creep.memory.resetPathTicks--;
    if ( creep.memory.role == 'ROLE_HARVESTER' ) {

      if ( creep.memory.role == 'ROLE_HARVESTER' && creep.memory.resetPathTicks <= 0 ) {
        let spawn = Game.getObjectById( creep.memory.home );
        let distanceRoom = Game.map.getRoomLinearDistance( spawn.room.name, creep.room.name );
        let distancePos = Math.ceil( Math.sqrt( Math.pow( creep.pos.x - spawn.pos.x, 2 ) + Math.pow( creep.pos.y - spawn.pos.y, 2 ) ) );
        let distance = distanceRoom * 50 + distancePos;
        let ticksPerField = creep.getActiveBodyparts( MOVE );
        ticksPerField = creep.body.length - ticksPerField;
        let tickToReturn = distance * ticksPerField;
        let pointOfNoReturn = creep.ticksToLive - distance * ticksPerField;

        LOGGER.info( "renewCreeps ################### INIT ####################" );
        LOGGER.info( "!!!!!!creep.memory.selfMaintain: " + !creep.memory.selfMaintain );
        LOGGER.info( "creep.ticksToLive<=450: " + ( creep.ticksToLive <= 1500 ) );
        LOGGER.info( "pointOfNoReturn <= 200: " + ( pointOfNoReturn <= 1500 ) );
        LOGGER.info( "pointOfNoReturn >= 1: " + ( pointOfNoReturn >= 1 ) );
        LOGGER.info( "creep.memory.resetPathTicks: " + ( creep.memory.resetPathTicks < 0 ) );
        LOGGER.info( "pointOfNoReturn: " + pointOfNoReturn );
        LOGGER.info( "creep.ticksToLive: " + ( creep.ticksToLive ) );
        LOGGER.info( "ticksPerField: " + ( ticksPerField ) );
        LOGGER.info( "distance: " + ( distance ) );
        LOGGER.info( "renew ################### INIT ####################" );

        if ( creep.ticksToLive <= 1500 && pointOfNoReturn <= 1500 && pointOfNoReturn >= 1 && creep.memory.resetPathTicks <= 0 ) {
          creep.memory.renewPath = utilpath.calculatePath( creep.pos, spawn.pos );
          // creep.memory.renewPath .pop();
          creep.memory.resetPathTicks = 3; //ticksPerField*3;
          creep.memory.selfMaintain = true;

        }
      }
      if ( creep.memory.selfMaintain ) {

        LOGGER.info( "renew ################### INIT #################### 1 " + creep.memory.renewPath.path );
        // let error= creep.moveByPath(creep.memory.renewPath);
        let error = creep.moveByPath( creep.memory.renewPath.path );
        if ( error == OK ) {
          creep.memory.renewPath.path.splice( 0, 1 );
          // creep.memory.renewPath.splice(0,2);
          // creep.memory.renewPath.pop();

          LOGGER.info( "renew ################### INIT #################### 2 " + !creep.memory.renewPath.path );





        } else {
          LOGGER.info( "renew #############DO MOVE!!!! 3 " + error );
          resetPathTicks = -1;
        }


        error = Game.getObjectById( creep.memory.home ).renewCreep( creep );
        LOGGER.info( "renew #############DO HEAL!!!! 3 " + error );

      }
    }
    LOGGER.debug( "renewCreeps done" );
    return creep.memory.selfMaintain;
  }
};

module.exports = renewCreeps;