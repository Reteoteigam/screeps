const LOGGER = require( 'util.log' );
const managerharvest = require( 'manager.mine.energy' );
const managertransport = require( 'manager.transport' );


module.exports = {
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
      if ( creep.fatigue <= 0 ) {
        //build manager
        creep.room.createConstructionSite( creep.pos, STRUCTURE_ROAD );
        creep.moveTo( exit, {
          visualizePathStyle: {
            stroke: '#00ffff'
          },
          reusePath: 25,
          swampCost: 2
        } );
      }
    } else {
      //harvest
      source = Game.getObjectById( creep.memory.target );
      let error = OK;

      error = creep.harvest( source );
      switch ( error ) {
        case OK:
          //drop or transfer RESOURCE_ENERGY
          this.dropOrTransfer( creep );
          if ( Game.time % 13 == 0 ) {
            this.placeOrders( homespawn, creep.pos );
          }
          break;

        case ERR_NOT_IN_RANGE:
          //build manager
          creep.room.createConstructionSite( creep.pos, STRUCTURE_ROAD );

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
  },

  placeOrders: function( homespawn, position ) {
    let looks = position.lookFor( LOOK_STRUCTURES );
    if ( looks.length > 0 ) {
      let structure = looks[ 0 ];
      if ( STRUCTURE_CONTAINER == structure.structureType ) {
        LOGGER.error( "miner placeOrders orderFrom structure" + structure );
        managertransport.orderFrom( homespawn, structure );
      }
    }
    looks = position.lookFor( LOOK_RESOURCES );
    if ( looks.length > 0 ) {
      let resource = looks[ 0 ];
      LOGGER.error( "miner placeOrders orderFrom resource" + resource );
      managertransport.orderFrom( homespawn, resource );
    }
  },

  dropOrTransfer: function( creep ) {
    if ( creep.store.getFreeCapacity( RESOURCE_ENERGY ) >= 1 ) {
      return;
    }
    //find _MY will not work if player was not the builder
    let target = Game.getObjectById( creep.memory.box );
    if ( !target ) {
      let targetList = creep.pos.findInRange( FIND_STRUCTURES, 1, {
        filter: object => object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_LINK
      } );
      if ( targetList ) {
        targetList.sort( function( a, b ) {
          if ( a.structureType == b.structureType ) {
            return 0;
          }
          if ( a.structureType == STRUCTURE_LINK ) {
            return -1
          } else {
            return 1;
          }
        } );
        target = targetList[ 0 ];
      }
    }
    creep.memory.box = target;

    let error = creep.transfer( target, RESOURCE_ENERGY );
    if ( error != OK ) {
      LOGGER.debug( "miner transfer was " + creep.name + " target " + target + " error " + error );
      if ( creep.store.getFreeCapacity( RESOURCE_ENERGY ) < 10 ) {
        error = creep.drop( RESOURCE_ENERGY );




      }
    }
  }
}