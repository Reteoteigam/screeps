/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.civil.group');
 * mod.thing == 'a thing'; // true
 */
var roleTransporter = require('role.transporter');
var roleHarvester = require('role.harvester');
var roleBuilder =  require('role.builder');

var LOGGER = require('util.log')

var group = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            switch (creep.memory.role) {
                case 'ROLE_BUILDER':
                    LOGGER.debug("group tryBuild");
					roleBuilder.run(creep);

                    break;
                    
                case "ROLE_TRANSPORTER":    
                    LOGGER.debug("group tryTransport");
                    roleTransporter.run(creep);
                    break;
                
                default:
                    LOGGER.error("group UNKNOWN ROLE"+ role);
				    break;
            }
                    

        }
};

module.exports = group;


