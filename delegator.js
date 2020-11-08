let LOGGER = require( 'util.log' )
let renewCreeps = require( 'util.renew' );


let roleDiscoverer = require( 'role.discoverer' );
let roleHarvester = require( 'role.harvester' );
let tower = require( 'tower' );

let militaryGroup = require( 'role.military.group' );
let civilGroup = require( 'role.civil.group' );

let delegator = {

  /** @param {Creep} creep **/
  run: function() {


    tower.run();


    for ( let name in Game.creeps ) {
      let creep = Game.creeps[ name ];
      //if(!renewCreeps.renewTicks(creep)){
      if ( true ) {
        let role = creep.memory.role;
        switch ( role ) {
          case "ROLE_SCOUT":
          case "ROLE_HEAL":
          case "ROLE_TANK":
            LOGGER.debug( "MILITARY.GROUP" );
            militaryGroup.group( creep );
            break;

          case "ROLE_BUILDER":
          case "ROLE_TRANSPORTER":
            LOGGER.debug( "CIVIL_GROUP" );
            civilGroup.run( creep );
            break;

          case "ROLE_HARVESTER":
            LOGGER.debug( "ROLE_HARVESTER" );
            roleHarvester.run( creep );
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

    }
  }
};

module.exports = delegator;