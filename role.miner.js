const LOGGER = require( 'util.log' );
const managerharvest = require( 'manager.mine.energy' );
const managertransport = require( 'manager.transport' );


let roleMiner = {
  /** @param {Creep} creep **/
  run: function( creep ) {


    LOGGER.debug( "roleMiner run: " + creep );
    creep.say( "❗ " + creep.ticksToLive );

    let homespawn = Game.getObjectById( creep.memory.home );
    if ( !creep.memory.target || !creep.memory.targetRoom ) {
      managerharvest.registerAsMiner( homespawn, creep );
    }

    if ( creep.memory.targetRoom != creep.room.name ) {
      //move to new room
      exitDir = Game.map.findExit( creep.room, creep.memory.targetRoom );
      exit = creep.pos.findClosestByRange( exitDir );
      // ignore swampCost
      creep.moveTo( exit, {
        visualizePathStyle: {
          stroke: '#00ffff'
        },
        reusePath: 25,
        swampCost: 2
      } );
    } else {
      //harvest
      source = Game.getObjectById( creep.memory.target );
      let error = OK;
      error = creep.harvest( source );
      switch ( error ) {
        case OK:
          // calculate the from target
          let look = creep.pos.look();
          look.forEach( function( lookObject ) {
            if ( lookObject.type == LOOK_STRUCTURES && lookObject.structureType == STRUCTURE_CONTAINER && lookObject.store[
                RESOURCE_ENERGY ] > 50 ) {
              managertransport.orderFrom( homespawn, lookObject );
              return;
            }
            if ( lookObject.type == LOOK_RESOURCES && lookObject.amount >= 50 ) {
              managertransport.orderFrom( homespawn, lookObject );
              return;
            }
          } );

          break;

        case ERR_NOT_IN_RANGE:
          creep.moveTo( source, {
            visualizePathStyle: {
              stroke: '#00ffff'
            },
            range: 1,
            reusePath: 25
          } );
          LOGGER.debug( "roleMiner go harvest: " + source.pos );
          break;

        default:
          LOGGER.error( "roleMiner harvest unknown error" + error );
      }
    }
    LOGGER.debug( "roleMiner done: " + creep );
  }
};

module.exports = roleMiner;