/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('util.military.defense');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
function defendRoom(roomName) {
    let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        let username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        let towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}
};