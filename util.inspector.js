/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.inspector');
 * mod.thing == 'a thing'; // true
 */
 var LOGGER = require('util.log')
 
 var inspector = {
     
     stringMe: function(object){
     
         var me = object;
         
         return ""+
         "\nme.name" + object.name +
         "\nme.memory.role " + object.memory.role +
         "\nme.pos " + object.pos +
         "\nme.pos " + object.body[0]   +
         "\nme.name " + object.ticksToLive;
  
         
     }
  
 }
 

module.exports = inspector