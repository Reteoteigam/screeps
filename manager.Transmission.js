Transmission
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.link');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require( 'util.log' );
const managerTransport = require( 'manager.transport' );
const PROTOTYPES = require( 'prototypes' );


const INDEX_INIT = 0;
const INDEX_TRANSMISSION = 1;

function Transmission() {
  this.from = null;
  this.to = null;
  this.value = 0;
}



module.exports = {

  restart: function( memoryObject ) {
    memoryObject.memory.managerTransmission = new Array();
    //INDEX_INIT
    memoryObject.memory.managerTransmission.push( false );
    return true;
  },
  // memory
  init: function( memoryObject ) {
    //init=false;
    if ( !memoryObject.memory.managerTransmission || !memoryObject.memory.managerTransmission[ INDEX_INIT ] ) {
      LOGGER.debug( "managerTransmission Init with " + memoryObject );
      //init datamodel
      memoryObject.memory.managerTransmission = new Array();
      //INDEX_INIT
      memoryObject.memory.managerTransmission.push( false );
      //INDEX_TRANSMISSION
      memoryObject.memory.managerTransmission.push( new Array() );

      //INDEX_TRANSMISSION_INDO

      memoryObject.memory.managerTransmission[ INDEX_INIT ] = true;
    }
  },

  cleanupLists: function( memoryObject ) {
    if ( !memoryObject.memory.managerTransmission || !memoryObject.memory.managerTransmission[ INDEX_INIT ] ) {
      LOGGER.error( "managerTransmission cleanupLists No init for " + memoryObject );
      return;
    }
    //clean from INDEX_TRANSMISSION
    let transmissions = memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ];
    transmissions.forEach( this.filterDeathFrom );
    transmissions = transmissions.filter( this.filterDeathTo );
    memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ] = transmissions;
  },

  filterDeathFrom: function( transmission ) {
    let targetID = transmission.from;
    if ( targetID && !Game.structures[ targetID ]; ) {
      transmission.from = null;
      LOGGER.error( "managerTransmission filterDeathFrom removed " + targetID );
    }
  },

  filterDeathTo: function( transmission ) {
    let targetID = transmission.to;
    ( targetID && !Game.structures[ targetID ]; ) {
      transmission.to = null;
      LOGGER.error( "managerTransmission filterDeathTo removed " + targetID );
    }
    is = !( !transmission.from && !transmission.to );
    // because of JS falsey ... or I write ===null ...
    return is;
  },

  run: function( memoryObject ) {
    let links = memoryObject.room.find( FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_LINK
      }
    } );
    for ( var i = 0; i < links.length; i++ ) {
      this.toLinkTask( memoryObject, links[ i ] );
    }
  },


  toLinkTask: function( target, link ) {
    //delegate to correct task
    if ( link.pos.isNearTo( target ) ) {
      this.transmissionTo( target, link );
    } else {
      this.transmissionFrom( target, link );
    }

    this.performTransmissions( target );

  },

  performTransmissions: function( memoryObject ) {
    if ( !memoryObject.memory.managerTransmission || !memoryObject.memory.managerTransmission[ INDEX_INIT ] ) {
      LOGGER.error( "managerTransmission performTransmissions No init for " + memoryObject );
      return;
    }

    let transmissions = memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ];
    transmissions = transmissions.filter( e => e.to != null && e.from != null );
    for ( var i = 0; i < transmissions.length; i++ ) {
      let transmission = transmissions[ i ];

      let linkFrom = Game.getObjectById( transmission.from );
      let linkTo = Game.getObjectById( transmission.to );

      if ( linkFrom.cooldown > 0 || linkTo.cooldown > 0 ) {
        continue;
      }

      let lokalStorage = linkFrom.store.getUsedCapacity( RESOURCE_ENERGY );
      if ( lokalStorage <= 103 ) {
        continue;
      }

      let targetStorage = linkTo.store.getFreeCapacity( RESOURCE_ENERGY );
      if ( targetStorage <= 103 ) {
        managerTransport.orderFrom( memoryObject, linkTo );
        continue;
      }

      let targetAmount = Math.min( lokalStorage, targetStorage );
      targetAmount = Math.floor( targetAmount / 100 ) * 100;

      if ( targetAmount < 100 ) {
        return;
      }

      let error = linkFrom.transferEnergy( linkTo, targetAmount );
      if ( error != OK ) {
        LOGGER.error( "managerTransmission transferEnergy failed: " + error );
        return;
      }




    }
  },

  transmissionTo: function( memoryObject, target ) {
    if ( !memoryObject.memory.managerTransmission || !memoryObject.memory.managerTransmission[ INDEX_INIT ] ) {
      LOGGER.error( "managerTransmission transmissionTo No init for " + memoryObject );
      return;
    }

    let transmissions = memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ];
    transmissions = transmissions.filter( e => e.to === null );
    if ( !transmissions ) {
      LOGGER.debug( "managerTransmission transmissionTo nothing to do" );
      return;
    }
    for ( var i = 0; i < transmissions.length; i++ ) {
      transmissions[ i ].to = target.id;
      LOGGER.debug( "managerTransmission transmissionTo add " + target + "pos " + target.pos );
    }
  },

  transmissionFrom: function( memoryObject, target ) {
    if ( !memoryObject.memory.managerTransmission || !memoryObject.memory.managerTransmission[ INDEX_INIT ] ) {
      LOGGER.error( "managerTransmission transmissionFrom No init for " + memoryObject );
      return;
    }

    let transmissions = memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ];
    let newTransmission = transmissions.find( e => e.from === target.id );
    //describe transmission
    if ( !newTransmission ) {
      let newTransmission = transmissions.find( e => e.from === null );
      if ( !newTransmission ) {
        newTransmission = new Transmission();
        newTransmission.from = target.id;
        newTransmission.to = null;
        transmissions.push( newTransmission );
        LOGGER.debug( "managerTransmission transmissionFrom add transmission:" + newTransmission );
      } else {
        newTransmission.from = target.id;
        LOGGER.debug( "managerTransmission transmissionFrom add transmission:" + newTransmission );
      }
      //memoryObject.memory.managerTransmission[ INDEX_TRANSMISSION ] = transmissions;
    }
    LOGGER.debug( "managerTransmission transmissionFrom nothing to do" );
  }





};