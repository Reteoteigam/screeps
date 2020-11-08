/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.link');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require( 'util.log' );
const managermap = require( 'manager.map' );
const PROTOTYPES = require( 'prototypes' );
//const ORDER = require('order');

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

  filterDeathFrom: function( order ) {
    let targetID = order.from;
    let target = Game.creeps[ targetID ];
    LOGGER.error( "managerTransmission filterDeathLinks" + target );
    if ( !target ) {
      order.transporter = null;
      LOGGER.error( "managerTransmission filterDeathFrom removed " + managerTransmission.printOrder( order ) );
    }
  },

  filterDeathTo: function( order ) {
    let targetID = order.to;
    let is = true;
    if ( !Game.getObjectById( targetID ) ) {
      order.from = null;
      LOGGER.error( "managerTransmission filterDeathTo removed " + targetID );
    }
    is = !( !order.transporter && !order.from && !order.to );
    // because of JS falsey ... or I write ===null ...
    return is;
  },

  run: function( memoryObject ) {

  }

};