let LOGGER = require( 'util.log' )
let renewCreeps = require( 'util.renew' );


let roleDiscoverer = require( 'role.discoverer' );
let roleHarvester = require( 'role.miner' );
let tower = require( 'tower' );

let militaryGroup = require( 'role.military.group' );
let civilGroup = require( 'role.civil.group' );

module.exports = {

  /** @param {Creep} creep **/
  run: function( memoryObject ) {


    tower.run( memoryObject );


    for ( let name in Game.creeps ) {
      let creep = Game.creeps[ name ];
      //if(!renewCreeps.renewTicks(creep)){


      if ( creep.spawning ) {
        LOGGER.error( "delegator crepp still in spawn" + creep );
        continue;
      }
      if ( true ) {
        let role = creep.memory.role;
        switch ( role ) {
          case "ROLE_SCOUT":
          case "ROLE_HEAL":
          case "ROLE_TANK":
            LOGGER.debug( "MILITARY.GROUP" );
            militaryGroup.group( creep );
            break;

          case "ROLE_MINER":
          case "ROLE_BUILDER":
          case "ROLE_TRANSPORTER":
            LOGGER.debug( "CIVIL_GROUP" );
            civilGroup.run( creep );
            break;

          case "ROLE_DISCOVERER":
            LOGGER.debug( "ROLE_DISCOVERER" );
            roleDiscoverer.run( creep );
            break;

          default:
            LOGGER.debug( "UNKNOWN ROLE" + role );
            break;
        }
      }
            if ( creep.ticksToLive >= 1490 && Game.flags.Flag1 !== undefined ) {
        creep.moveTo( Game.flags.Flag1 );
      }

    }
  }
}