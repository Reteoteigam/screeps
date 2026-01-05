var roleMiner = {
    run: function(creep) {
        // Der Miner bekommt im Memory eine feste Source-ID zugewiesen
        var source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
module.exports = roleMiner;