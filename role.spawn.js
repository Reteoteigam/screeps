const LOGGER = require( 'util.log' )
const cleaner = require( 'util.cleaner' );
let reset = 5;
let inDoing = -1;

let roleSpawn = {
  /** @param {Creep} creep **/
  run: function( spawn, role, roleMax, design ) {
    LOGGER.debug( "roleSpawn run" );


    let creeps = _.filter( Game.creeps, ( creep ) => creep.memory.role == role );
    if ( !spawn.spawning && Game.time % 1000 == 0 ) {
      cleaner.clean();
    }

    if ( !spawn.spawning ) {

      let isNearDead;
      for ( let i in Game.creeps ) {
        let element = Game.creeps[ i ];
        if ( element.memory.role == role && element.ticksToLive < 60 && creeps.length <= roleMax ) {
          isNearDead = element;
          break;
        }
      }
      if ( isNearDead || creeps.length < roleMax ) {
        let testIfCanSpawn;
        while ( !spawn.spawning ) {
          testIfCanSpawn = spawn.spawnCreep( design,
            'DryRun', {
              dryRun: true
            } );
          if ( ERR_NOT_ENOUGH_ENERGY == testIfCanSpawn && design.length > 3 ) {
            design = design.slice( 1 );
          } else {
            break;
          }
        }
        let newName = role + Game.time;
        LOGGER.error( "roleSpawn try " + role + design );
        inDoing = spawn.spawnCreep( design, newName, {
          memory: {
            "role": role,
            "home": spawn.id
          }
        } );

      }
    } else {
      let spawningCreep = Game.creeps[ spawn.spawning.name ];
      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y, {
          align: 'left',
          opacity: 0.8
        } );
    }
    LOGGER.debug( "roleSpawn done" );
    return inDoing;
  },


  renew: function( spawn ) {
    reset--;
    LOGGER.debug( "renew run " + reset );
    if ( reset <= 0 ) {
      reset = 3;
      spawn.memory.creepsToRenew = spawn.pos.findInRange( FIND_MY_CREEPS, 1, {
        filter: ( creep ) => {
          return ( creep.memory.role != "ROLE_CLAIMER" && creep.ticksToLive < 1400 );
        }
      } );

    }
    LOGGER.debug( "renew run " + spawn.memory.creepsToRenew );
    if ( spawn.memory.creepsToRenew && spawn.memory.creepsToRenew.length > 0 ) {
      let target = Game.getObjectById( spawn.memory.creepsToRenew.pop().id );
      LOGGER.debug( "renew HEAL " + target );
      let error = spawn.renewCreep( target );
      LOGGER.debug( " renewed: " + error + " target was " + target );
    }



  }
};

module.exports = roleSpawn;