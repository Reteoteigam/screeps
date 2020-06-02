/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.civil.group');
 * mod.thing == 'a thing'; // true
 */
var roleDeliverer = require('role.deliverer');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder =  require('role.builder');

var LOGGER = require('util.log')

var group = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            switch (creep.memory.role) {
                case 'ROLE_BUILDER':
                    LOGGER.debug("tryBuild");
                    var hasResource = roleBuilder.run(creep);
                    if(!hasResource){
                        LOGGER.debug("tryUpgrade");
                        hasResource = roleUpgrader.run(creep);
                    }
                    
                    break;
                    
                case "ROLE_DELIVERER":    
                    LOGGER.debug("tryDeliver");
                    roleDeliverer.run(creep);
                    break;
                
                default:
                    LOGGER.debug("UNKNOWN ROLE"+ role);
				    break;
            }
                    

        }
};

module.exports = group;


