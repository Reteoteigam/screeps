/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.military.group');
 * mod.thing == 'a thing'; // true
 */
var scouting = false;
const LOGGER = require('util.log')
var roleMilitaryHealer =  require('role.military.healer');
var roleMilitaryScout =  require('role.military.scout');

var group = {
        
    /** @param {reep} creep **/
    group :function(creep){
       //talk but not every time
        if(creep.memory.tick >=2){
            creep.say("🧡");
            creep.memory.tick = 0
        }
        creep.memory.tick++;
        

        roleMilitaryHealer.run(creep);
		roleMilitaryScout.run(creep);
        
        
        
        
        //LOGGER.debug(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
        
        
        if(scouting && creep.ticksToLive>1000){   
            LOGGER.debug("move from "+ creep.pos +" to "+Game.flags["Group"].pos);
	        creep.moveTo(Game.flags["Group"] , {visualizePathStyle: {stroke: '#ff0000'}});
        }
	    
	    if(creep.ticksToLive<200){
	        LOGGER.debug("move from "+ creep.pos +" to "+Game.flags["Home"].pos);
	        var target= Game.flags["Home"].pos; 
	        
	        creep.moveTo(target , {visualizePathStyle: {stroke: '#ff0000'}});
	    }
	    
	    
	         
    }
 }


module.exports = group;

