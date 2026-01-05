const PROTOTYPES = require( 'prototypes' );
const LOGGER = require( 'util.log' );
LOGGER.debug( "INIT" );

const managermap = require( 'manager.map' );
const managerMineEnergy = require( 'manager.mine.energy' );
const managerTransport = require( 'manager.transport' );
const managerTransfer = require( 'manager.Transmission' );
const cleaner = require( 'util.cleaner' );

let delegator = require( 'delegator' );
let delegatorSpawn = require( 'delegator.spawn' )


const startBaseName = "Spawn1";


module.exports.loop = function() {
  LOGGER.debug( "TICK" );

  //init memory
  if ( false ) {
    if ( !Memory.spawns ) {
      Memory.spawns = {};
    }
    if ( !Memory.spawns.Spawn1 ) {
      LOGGER.error( "main init shard Memory.spawns.spawn1:" + Memory.spawns.spawn1 );
      Memory.spawns.Spawn1 = {};
    }

    if ( !Memory.shardData || !Memory.shardData.name ) {
      LOGGER.error( "test" );
      delete Memory.shardData;
      Memory.shardData = {
        name: Game.shard.name

      };
      cleaner.restart();
      return;
    }
  }

  //	cleaner.restart();
  //	return;

  if ( Game.time % 10 == 0 ) {
    cleaner.clean();
  }

  let memoryObject = Game.spawns[ startBaseName ];
  managermap.init( memoryObject );
  managerMineEnergy.init( memoryObject );
  managerTransport.init( memoryObject );
  managerTransfer.init( memoryObject );

  delegatorSpawn.run( memoryObject );

  delegator.run( memoryObject );
  managerTransfer.run( memoryObject );

  LOGGER.debug( "START TICK LOOP Game.cpu.tickLimit: " +
    Game.cpu.tickLimit +
    " Game.cpu.bucket: " +
    Game.cpu.bucket +
    " Game.cpu.getUsed: " +
    Math.ceil( Game.cpu.getUsed() ) )



  if ( Game.cpu.unlocked && Game.cpu.bucket > 9000 ) {
    let error = Game.cpu.generatePixel();
    LOGGER.error( "Game.cpu.generatePixel() " + error );
  }
}