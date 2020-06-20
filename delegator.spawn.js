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
const managerharvest = require('manager.harvest');


//civil
const MAX_BUILDER= 2;
const ROLE_BUILDER = 'ROLE_BUILDER';

const MAX_DELIVERER = 4;
const ROLE_DELIVERER = 'ROLE_DELIVERER';

var maxHarvester = 1;
const ROLE_HARVESTER = 'ROLE_HARVESTER';

const MAX_RANGE_WORKER = 2;
const ROLE_RANGEWORKER = "ROLE_RANGEWORKER";

const MAX_DISCOVERER = 1;
const ROLE_DISCOVERER = "ROLE_DISCOVERER";
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
               
            //ROLE_HARVESTER
            maxHarvester=managerharvest.calculateMaxHarvester(spawn);
            roleSpawn.run(spawn, ROLE_HARVESTER,maxHarvester,[WORK,WORK,WORK,WORK,WORK,MOVE]) //enought for one resource
            //ROLE_DELIVERER
            // roleSpawn.run(spawn, ROLE_DELIVERER,MAX_DELIVERER,[CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE])    
            //ROLE_BUILDER
            // roleSpawn.run(spawn, ROLE_BUILDER,MAX_BUILDER,[WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE])
            //ROLE_RANGEWORKER
            // roleSpawn.run(spawn, ROLE_RANGEWORKER,MAX_RANGE_WORKER,[WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE])    
            //ROLE_DISCOVERER
            roleSpawn.run(spawn, ROLE_DISCOVERER,MAX_DISCOVERER,[MOVE])    
            //creepHealer
            //roleSpawn.run(spawn, ROLE_HEAL,MAX_HEAL,[TOUGH,MOVE,HEAL,MOVE])
            ////creepTank
            // roleSpawn.run(spawn,ROLE_TANK,MAX_TANK,[TOUGH,ATTACK,MOVE,TOUGH,ATTACK,MOVE])
            ////creepScout
            //roleSpawn.run(creepScout,MAX_SCOUT,[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE])
            roleSpawn.renew(spawn);
            }
        
        LOGGER.debug("delegatorSpawn done");
    },
    
    increaseMaxHarvester: function(count){
        MAX_HARVESTER=MAX_HARVESTER+count
    }
    
    
    
};

module.exports = delegatorSpawn;