/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.renew');
 * mod.thing == 'a thing'; // true
 */


var LOGGER = require('util.log')

var renewCreeps = {

    /** @param {message} the message **/
    renewTicks: function(creep) {
        return;
        LOGGER.debug("renewCreepsrenewCreeps run");
        
        LOGGER.debug(creep.memory.home);
        creep.memory.resetPathTicks--;
        
        if(creep.memory.role == 'ROLE_HARVESTER' && creep.memory.resetPathTicks <=0){
        
        var spawn = Game.getObjectById(creep.memory.home);
        var distanceRoom = Game.map.getRoomLinearDistance(spawn.room.name,creep.room.name);
        var distancePos =Math.ceil (Math.sqrt(Math.pow( creep.pos.x - spawn.pos.x,2) + Math.pow( creep.pos.y - spawn.pos.y,2)));
        
        var distance = distanceRoom *50 + distancePos;
        
        var ticksPerField= creep.getActiveBodyparts(MOVE);
        ticksPerField= creep.body.length - ticksPerField +1;
        
        var tickToReturn = distance*ticksPerField;
        var pointOfNoReturn = creep.ticksToLive-distance*ticksPerField;
        
        
            LOGGER.info("pointOfNoReturn "+pointOfNoReturn+" tickToReturn "+tickToReturn);

            if(!creep.memory.selfMaintain && creep.ticksToLive<=500 && pointOfNoReturn <= 200 && pointOfNoReturn >= 1){
                creep.memory.selfMaintain = true;
                creep.memory.reniewPath = PathFinder.search(creep.pos,spawn,
                    {
                        // We need to set the defaults costs higher so that we
                        // can set the road cost lower in `roomCallback`
                        plainCost: 2,
                        swampCost: 10,
                    
                        roomCallback: function(roomName) {
                
                            let room = Game.rooms[roomName];
                            // In this example `room` will always exist, but since 
                            // PathFinder supports searches which span multiple rooms 
                            // you should be careful!
                            if (!room) return;
                            let costs = new PathFinder.CostMatrix;
                
                            room.find(FIND_STRUCTURES).forEach(function(struct) {
                            if (struct.structureType === STRUCTURE_ROAD) {
                                // Favor roads over plain tiles
                                costs.set(struct.pos.x, struct.pos.y, 1);
                            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                                      (struct.structureType !== STRUCTURE_RAMPART ||
                                      !struct.my)) {
                                // Can't walk through non-walkable buildings
                                costs.set(struct.pos.x, struct.pos.y, 0xff);
                            }
                        });
                
                        // Avoid creeps in the room
                        room.find(FIND_CREEPS).forEach(function(creep) {
                            costs.set(creep.pos.x, creep.pos.y, 0xff);
                        });
                        return costs;
                    },
                   }
                );
            }else{
                creep.memory.selfMaintain = false
            }
            creep.memory.resetPathTicks = ticksPerField*3;
            if (creep.memory.selfMaintain) {
                var error= creep.moveByPath(creep.memory.reniewPath);
                LOGGER.info("!!!!!!!!!!!!!!!"+error);
            }
             LOGGER.info("creep.memory.selfMaintain "+creep.memory.selfMaintain);
            
            return creep.memory.selfMaintain;
            LOGGER.debug("renewCreeps done");
        }
    }    
};

module.exports = renewCreeps;