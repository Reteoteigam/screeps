/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.rangeworker');
 * mod.thing == 'a thing'; // true
 */



const LOGGER = require( 'util.log' );
const managerMap = require( 'manager.map' );
let discoverer = {



  run: function( creep ) {
    LOGGER.debug( "discoverer run: " + creep );
    if ( creep.memory.targetRoom ) {
      Game.map.visual.line( creep.pos, new RoomPosition( 25, 25, creep.memory.targetRoom ), {
        color: '#0000ff',
      } );
    }
    let homespawn = Game.getObjectById( creep.memory.home );

    // visualize the path
    if ( true ) {
      const path = PathFinder.search( creep.pos, homespawn.pos ).path;
      Game.map.visual.poly( path, {
        stroke: '#ffffff',
        strokeWidth: .8,
        opacity: .2,
        lineStyle: 'dashed'
      } );
    }

    //was attacked
    if ( creep.memory.wasAttackedin ) {
      creep.move( creep, homespawn );
      return;
    }

    //startRoom?
    if ( !creep.memory.targetRoom ) {
      creep.memory.targetRoom = managerMap.nextUndiscovered( homespawn );

      LOGGER.debug( "discoverer " + creep.memory.targetRoom );
      if ( !creep.memory.targetRoom ) {
        LOGGER.error( "discoverer Nothing to do, dead in: " + creep.ticksToLive + " ticks." );
        creep.moveTo( homespawn, {
          reusePath: 25
        } );
        return;
      }
    }

    //was Attacked
    let eventLog = creep.room.getEventLog();
    let attackEvents = _.filter( eventLog, {
      event: EVENT_ATTACK
    } );

    attackEvents.forEach( event => {
      let target = Game.getObjectById( event.data.targetId );
      if ( target && target.my ) {
        managerMap.newDanger( homespawn, creep.room.name );
        managerMap.addUndiscovered( homespawn, creep.memory.targetRoom );
        managerMap.stopDiscovering( homespawn, creep.memory.targetRoom );
        creep.memory.targetRoom = false;
        creep.memory.wasAttackedin = creep.room.name;
        LOGGER.debug( "discoverer creep.memory.wasAttackedin " + creep.memory.wasAttackedin );
        return;
      }
    } );
    //is dangerous -> hostile entity?
    let hostileCreep = creep.room.find( FIND_HOSTILE_CREEPS );
    let hostilePowerCreep = creep.room.find( FIND_HOSTILE_POWER_CREEPS );
    let hostileStructureTower = creep.room.find( FIND_HOSTILE_STRUCTURES, {
      filter: ( structure ) =>
        ( ( structure.structureType == STRUCTURE_TOWER ) || ( structure.structureType == STRUCTURE_KEEPER_LAIR ) )

    } );
    let hostile = hostileCreep.concat( hostilePowerCreep ).concat( hostileStructureTower );
    if ( hostile && hostile.length >= 1 ) {
      managerMap.newDanger( homespawn, creep.room.name );
      managerMap.newDiscovered( homespawn, creep.memory.targetRoom );
      managerMap.stopDiscovering( homespawn, creep.memory.targetRoom );
      LOGGER.debug( "discoverer hostiles in " + creep.memory.targetRoom );
      creep.memory.targetRoom = homespawn.room.name;
      LOGGER.debug( "discoverer Go home" );

    }



    LOGGER.debug( "discoverer targetRoom " + creep.memory.targetRoom );
    LOGGER.debug( "discoverer currentRoom " + creep.room.name );
    if ( creep.memory.targetRoom == creep.room.name ) {
      //are there sources?
      let sources = creep.room.find( FIND_SOURCES );
      LOGGER.debug( "discoverer sources here?: " + sources.length );
      for ( let i = 0; i < sources.length; i++ ) {
        managerMap.newSourceLocation( homespawn, sources[ i ].id, creep.room.name );
      }

      LOGGER.debug( "discoverer look for exits in targetRoom " + creep.room.name );
      //find exits
      let exits = Game.map.describeExits( creep.room.name );
      for ( let name in exits ) {
        let aNewRoom = exits[ name ];
        LOGGER.debug( "discoverer Find exit: " + aNewRoom );
        managerMap.newExit( homespawn, aNewRoom );
      }
      managerMap.newDiscovered( homespawn, creep.room.name );
      managerMap.stopDiscovering( homespawn, creep.room.name );
      creep.memory.targetRoom = false;
    } else {
      //move to new room


      exitDir = Game.map.findExit( creep.room, creep.memory.targetRoom );
      exit = creep.pos.findClosestByRange( exitDir );
      let result = creep.moveTo( exit, {
        visualizePathStyle: {
          stroke: '#999999'
        },
        reusePath: 25,
        swampCost: 2
      } );
      LOGGER.debug( "discoverer moveTo " + exit + " " + result );
    }
    if ( creep.ticksToLive < 5 ) {
      managerMap.stopDiscovering( homespawn, creep.memory.targetRoom );
      creep.suicide();
    }
    LOGGER.debug( "discoverer done: " + creep );
  }
}

module.exports = discoverer;