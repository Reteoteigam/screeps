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
const MAX_BUILDER= 4;//2 beggining
const ROLE_BUILDER = 'ROLE_BUILDER';

const MAX_TRANSPORTER = 4;//4 normal
const ROLE_TRANSPORTER = 'ROLE_TRANSPORTER';

var MAX_HARVESTER = 2;
const ROLE_HARVESTER = 'ROLE_HARVESTER';

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


    //return;
        for (var id in Game.spawns) {
            var spawn = Game.spawns[id];
            LOGGER.debug("delegatorSpawn spawn.energy "+spawn.energy);
            //ROLE_HARVESTER
			//MAX_HARVESTER=managerharvest.calculateMaxHarvester(spawn);
			var inDoing = roleSpawn.run(spawn, ROLE_HARVESTER,MAX_HARVESTER,[WORK,WORK,WORK,WORK,WORK,MOVE]) //enought for one resource
			//ROLE_TRANSPORTER
            roleSpawn.run(spawn, ROLE_TRANSPORTER,MAX_TRANSPORTER,[CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE])    
            //ROLE_BUILDER
            roleSpawn.run(spawn, ROLE_BUILDER,MAX_BUILDER,[WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE])
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