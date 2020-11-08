const LOGGER = require( 'util.log' );
const operationMove = require( 'util.operation.move' );

let inspector = require( 'util.inspector' );


PathFinder.use( true );
let healer = {
  /** @param {Creep} creep **/
  run: function( creep ) {
    LOGGER.debug( "healer run: " + inspector.stringMe( creep ) );


    let activeWeapons = creep.getActiveBodyparts( HEAL ) < 0;
    if ( activeWeapons ) {
      LOGGER.debug( "cannot heal" );
      return;
    }

    let target = creep.pos.findClosestByRange(
      FIND_MY_CREEPS, {
        filter: function( object ) {
          return object.hits < object.hitsMax;
        }
      }
    );

    if ( target ) {
      if ( creep.heal( target ) == ERR_NOT_IN_RANGE ) {
        creep.moveTo( target, {
          visualizePathStyle: {
            stroke: '#00ffff'
          }
        } );
      }
    }


  }
};

module.exports = healer;