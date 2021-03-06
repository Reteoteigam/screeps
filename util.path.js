/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('util.path');
 * mod.thing == 'a thing'; // true
 */

let LOGGER = require( 'util.log' )

let utilpath = {

  calculatePath: function( from, to ) {
    LOGGER.info( "from" + from + " to " + to );
    return PathFinder.search( from, to, {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: 2,
      swampCost: 10,

      roomCallback: function( roomName ) {

        let room = Game.rooms[ roomName ];
        // In this example `room` will always exist, but since
        // PathFinder supports searches which span multiple rooms
        // you should be careful!
        if ( !room ) return;
        let costs = new PathFinder.CostMatrix;

        room.find( FIND_STRUCTURES ).forEach( function( struct ) {
          if ( struct.structureType === STRUCTURE_ROAD ) {
            // Favor roads over plain tiles
            costs.set( struct.pos.x, struct.pos.y, 1 );
          } else if ( struct.structureType !== STRUCTURE_CONTAINER &&
            ( struct.structureType !== STRUCTURE_RAMPART ||
              !struct.my ) ) {
            // Can't walk through non-walkable buildings
            costs.set( struct.pos.x, struct.pos.y, 0xff );
          }
        } );

        // Avoid creeps in the room
        room.find( FIND_CREEPS ).forEach( function( creep ) {
          costs.set( creep.pos.x, creep.pos.y, 0xff );
        } );
        return costs;
      },
    } );


  }
};

module.exports = utilpath;