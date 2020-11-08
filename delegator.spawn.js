/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('util.renew');
 * mod.thing == 'a thing'; // true
 */
let LOGGER = require( 'util.log' );

const roleSpawn = require( 'role.spawn' );
const managerMineEnergy = require( 'manager.mine.energy' );
const managertransporter = require( 'manager.transport' );


//civil
const MAX_BUILDER = 4; //2 beggining
const ROLE_BUILDER = 'ROLE_BUILDER';

let MAX_TRANSPORTER = 6; //4 normal
const ROLE_TRANSPORTER = 'ROLE_TRANSPORTER';

let MAX_HARVESTER = 3;
const ROLE_HARVESTER = 'ROLE_HARVESTER';

let MAX_LINKER = 1;
const ROLE_LINKER = 'ROLE_LINKER';

const MAX_DISCOVERER = 1;
const ROLE_DISCOVERER = "ROLE_DISCOVERER";
//millitary
const MAX_SCOUT = 1;
const ROLE_SCOUT = 'ROLE_SCOUT';

const MAX_TANK = 1;
const ROLE_TANK = 'ROLE_TANK';

const MAX_HEAL = 1;
const ROLE_HEAL = 'ROLE_HEAL';


let delegatorSpawn = {

  /** @param {message} the message **/
  run: function( memoryObject ) {
    LOGGER.debug( "delegatorSpawn run" );


    //return;
    for ( let id in Game.spawns ) {
      let spawn = Game.spawns[ id ];
      LOGGER.debug( "delegatorSpawn spawn.energy " + spawn.energy );
      //ROLE_HARVESTER
      //	MAX_HARVESTER=managerMineEnergy.calculateMaxMiner(spawn);
      LOGGER.debug( "delegatorSpawn run MAX_HARVESTER: " + MAX_HARVESTER );
      let inDoing = roleSpawn.run( spawn, ROLE_HARVESTER, MAX_HARVESTER, [ WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK,
        WORK, WORK,
        WORK, WORK, WORK, WORK, WORK, CARRY, MOVE ] ) //enought for one resource
      //ROLE_TRANSPORTER

      //	MAX_TRANSPORTER = managertransporter.calculateMaxTransporter(spawn)+2;
      roleSpawn.run( spawn, ROLE_TRANSPORTER, MAX_TRANSPORTER, [ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY,
        MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE ] )
      //ROLE_BUILDER
      roleSpawn.run( spawn, ROLE_BUILDER, MAX_BUILDER, [ WORK, WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE,
        WORK, WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE ] )
      //ROLE_DISCOVERER
      roleSpawn.run( spawn, ROLE_DISCOVERER, MAX_DISCOVERER, [ MOVE ] )
      //creepHealer
      //roleSpawn.run(spawn, ROLE_HEAL,MAX_HEAL,[TOUGH,MOVE,HEAL,MOVE])
      ////creepTank
      // roleSpawn.run(spawn,ROLE_TANK,MAX_TANK,[TOUGH,ATTACK,MOVE,TOUGH,ATTACK,MOVE])
      ////creepScout
      //roleSpawn.run(creepScout,MAX_SCOUT,[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE])
      roleSpawn.renew( spawn );
    }

    LOGGER.debug( "delegatorSpawn done" );
  },

  increaseMaxHarvester: function( count ) {
    MAX_HARVESTER = MAX_HARVESTER + count
  }



};

module.exports = delegatorSpawn;