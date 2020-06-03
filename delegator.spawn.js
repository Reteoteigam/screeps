/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.renew');
 * mod.thing == 'a thing'; // true
 */
var LOGGER = require('util.log');

const roleSpawn= require('role.spawn');



//civil
const MAX_BUILDER= 3;
const ROLE_BUILDER = 'ROLE_BUILDER';

const MAX_DELIVERER = 3;
const ROLE_DELIVERER = 'ROLE_DELIVERER';

const MAX_HARVESTER = 1;
const ROLE_HARVESTER = 'ROLE_HARVESTER';

const MAX_RANGE_WORKER = 1;
const ROLE_RANGEWORKER = "ROLE_RANGEWORKER";

//millitary
const MAX_SCOUT = 1;
const ROLE_SCOUT = 'ROLE_SCOUT';

const MAX_TANK = 1;
const ROLE_TANK = 'ROLE_TANK';

const MAX_HEAL = 1;
const ROLE_HEAL = 'ROLE_HEAL';
    

var delegatorSpawn = {

    /** @param {message} the message **/
    run: function() {
        LOGGER.debug("delegatorSpawn run");


    
        for (var id in Game.spawns) {
            var spawn = Game.spawns[id];
               
            //creepHarvester
            roleSpawn.run(spawn, ROLE_HARVESTER,MAX_HARVESTER,[WORK,WORK,WORK,WORK,WORK,MOVE]) //enought for one resource
            //creepDeliverer
            roleSpawn.run(spawn, ROLE_DELIVERER,MAX_DELIVERER,[CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE])    
            //creepBuilder
            roleSpawn.run(spawn, ROLE_BUILDER,MAX_BUILDER,[WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE])
            //creepRangeWorker
            //creepFactory.run(creepRangeWorker,MAX_RANGE_WORKER,[WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])    
            //creepHealer
            //roleSpawn.run(spawn, ROLE_HEAL,MAX_HEAL,[TOUGH,MOVE,HEAL,MOVE])
            ////creepTank
            //creepFactory.run(creepTank,MAX_TANK,[TOUGH,ATTACK,MOVE,TOUGH,ATTACK,MOVE])
            ////creepScout
            //creepFactory.run(creepScout,MAX_SCOUT,[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE])
             
            }
        
        LOGGER.debug("delegatorSpawn done");
    },
    
};

module.exports = delegatorSpawn;