/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managermap = require('manager.map');
const PROTOTYPES = require('prototypes');

const INDEX_INIT 				=0;    
const INDEX_TRANSPORTER_FREE 	=1;
const INDEX_TRANSPORTER_ORDER 	=2;
const INDEX_TRANSPORTER_ORDER_TRANSPORTER 	=0;
const INDEX_TRANSPORTER_ORDER_FROM 	=1;
const INDEX_TRANSPORTER_ORDER_TO 	=2;
const INDEX_TRANSPORTER_ORDER_VALUE	=3;


const order = {
	transporter: null,
	from: null,
	to: null,
	value: 0,
	toString: function (){
		return "order: transporter "+this.transporter+" from "+this.from+" to " +this.to+" value "+this.value;
	}
};




var managertransport = {
	
	
		
	
	restart: function (memoryObject){
			memoryObject.memory.managertransport = new Array();
			//INDEX_INIT
			memoryObject.memory.managertransport.push(false);
			return true;
	},	
     // memory  
    init : function(memoryObject){
		//init=false;
		if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
			LOGGER.debug("managertransport Init with "+memoryObject);
			//init datamodel
			memoryObject.memory.managertransport = new Array();
			//INDEX_INIT
			memoryObject.memory.managertransport.push(false);
			//INDEX_TRANSPORTER_FREE
			memoryObject.memory.managertransport.push(new Array(0));
			//INDEX_TRANSPORTER_ORDER
			memoryObject.memory.managertransport.push(new Array(0));
			//INDEX_TRANSPORTER_ORDER_TRANSPORTER
			memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER].push(new Array(0));
			//INDEX_TRANSPORTER_ORDER_FROM
			memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER].push(new Array(0));
			//INDEX_TRANSPORTER_ORDER_TO
			memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER].push(new Array(0));
			//INDEX_TRANSPORTER_ORDER_VALUE
			memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER].push(new Array(0));
			memoryObject.memory.managertransport[INDEX_INIT] = true;
        }
    },
	
	registerOrder: function(memoryObject,target){
		if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport cleanupLists No init for " + memoryObject);
            return;
        }
		
		//describe order
		var transporter = null;
		var from = null;
		var to = target;
		var value = target.store;
		
		var orderTos = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_TO];
		
		if(orderTos.includes(target.name)){
			LOGGER.error("managertransport registerOrder was before"+target);
				return;
		}
		orderTos.push(target.name);
		var orderValues = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_VALUE];
			
		    me = Object.create(order);
			me.transporter = null;
			me.from=null;
			me.to=target.name;
			me.value=123;
			LOGGER.error("TEST####0 "+me);
			orderValues.push(me);
		
		

		
		var orderTransporters = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_TRANSPORTER];
		var orderFroms = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_FROM];
		
		var orderValues = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_VALUE];

		
LOGGER.error("TEST####1"+ orderTransporters);
LOGGER.error("TEST####2"+ orderFroms);
LOGGER.error("TEST####3"+ orderTos);
LOGGER.error("TEST####4"+ orderValues);
		
	},
	
    registerAsTransporter: function (memoryObject,creep){
        if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport registerAsHarvester No init for " + memoryObject);
            return;
        }
		freeTransporter = memoryObject.memory.managertransport[INDEX_TRANSPORTER_FREE];
		if(freeTransporter.includes(creep.name)){
			LOGGER.debug("managertransport registerAsTransporter "+creep.name+" was registered before.");
			return;
		}else{
			freeTransporter.push(creep.name);
			LOGGER.debug("managertransport registerAsTransporter "+creep.name);
		}
    },
	
	cleanupLists: function (memoryObject){
        if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport cleanupLists No init for " + memoryObject);
            return;
        }
		
		freeTransporters = memoryObject.memory.managertransport[INDEX_TRANSPORTER_FREE];
		for( var i = 0; i < freeTransporters.length; i++){
			var currentTarget = freeTransporters[i];
			if(!Game.creeps[currentTarget]) {
				freeTransporters.splice(i,1);
				LOGGER.debug("managertransport cleanupLists INDEX_TRANSPORTER_FREE removed: " + currentTarget);
			}				
		}
		//FIXME later improve with coordinate to get the near transporter
        orderTransporters = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_TRANSPORTER];
		for( var i = 0; i < orderTransporters.length; i++){
			var currentTarget = orderTransporters[i];
			if(!Game.creeps[currentTarget]) {
				orderTransporters.splice(i,1,null);
				LOGGER.debug("managertransport cleanupLists INDEX_TRANSPORTER_ORDER_TRANSPORTER removed: " + currentTarget);
			}				
		}	
	},
	
	calculateMaxTransporter: function (memoryObject){
		if(!memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport calculateMaxHarvester No init");
            return;
        }
		
		result = 1;
		var orderTransporters = memoryObject.memory.managertransport[INDEX_TRANSPORTER_ORDER][INDEX_TRANSPORTER_ORDER_TRANSPORTER];
		for( var i = 0; i < orderTransporters.length; i++){
			var currentTarget = freeTransporters[i];
			if(currentTarget){
				result++;
			}	
		}
		return result;
	}
};
module.exports = managertransport;