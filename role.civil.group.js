/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.civil.group');
 * mod.thing == 'a thing'; // true
 */
let roleTransporter = require( 'role.transporter' );
let roleHarvester = require( 'role.harvester' );
let roleBuilder = require( 'role.builder' );

let LOGGER = require( 'util.log' )

let group = {

  /** @param {Creep} creep **/
  run: function( creep ) {
    switch ( creep.memory.role ) {
      case 'ROLE_BUILDER':
        LOGGER.debug( "group tryBuild" );
        roleBuilder.run( creep );

        break;

      case "ROLE_TRANSPORTER":
        LOGGER.debug( "group tryTransport" );
        roleTransporter.run( creep );
        break;

      default:
        LOGGER.error( "group UNKNOWN ROLE" + role );
        break;
    }


  }
};

module.exports = group;