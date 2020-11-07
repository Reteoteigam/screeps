/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('manager.map');
 * mod.thing == 'a thing'; // true
 */

const LOGGER = require('util.log');
const managermap = require('manager.map');
const PROTOTYPES = require('prototypes');
//const ORDER = require('order');

const INDEX_INIT 	=0;
const INDEX_ORDER 	=1;

function Order(){
	this.transporter= null;
	this.from= null;
	this.to= null;
	this.value = 0 ;
}
//methoden in prototypes gehen noch nicht
//Order.prototype.toString = function() {
//	return this.firstName + " " + this.lastName;
//};





let managertransport = {

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
			//INDEX_ORDER
			memoryObject.memory.managertransport.push(new Array());

			//INDEX_ORDER_INDO

			memoryObject.memory.managertransport[INDEX_INIT] = true;
        }
    },

    cleanupLists: function (memoryObject){
        if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport cleanupLists No init for " + memoryObject);
            return;
        }
		//clean from INDEX_ORDER

		let orders = memoryObject.memory.managertransport[INDEX_ORDER];
		orders.forEach(this.filterDeathTransporter);
		orders.forEach(this.filterDeathTo);
		orders = orders.filter(this.filterDeathFrom);
		memoryObject.memory.managertransport[INDEX_ORDER]=orders;
	},

	filterDeathTransporter: function (order) {
		let targetID = order.transporter;
		if(!Game.creeps[targetID]) {
			order.transporter = null;
			LOGGER.error("managertransport filterDeathTransporter removed "+targetID);
		}
	},

	filterDeathTo: function (order) {
		let targetID = order.to;
		if(!Game.getObjectById(targetID)) {
			order.to = null;
			LOGGER.error("managertransport filterDeathTo removed "+targetID);
		}
	},

	filterDeathFrom: function (order) {
		let targetID = order.from;
		let is = true;
		if(!Game.getObjectById(targetID)) {
			order.from = null;
			LOGGER.error("managertransport filterDeathFrom removed "+targetID);	
		}
		is = !(!order.transporter && !order.from && !order.to);
		// because of JS falsey ... or I write ===null ...
		return is;
	},

	printOrder: function(order){
		return "order: transporter "+order.transporter+" from "+order.from+" to " +order.to+" value "+order.value;
	},

	orderTo: function(memoryObject,target){
		if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport orderTo No init for " + memoryObject);
            return;
        }

		let orders = memoryObject.memory.managertransport[INDEX_ORDER];
		let newOrder = orders.find(e => e.to === target.id);
		//describe order
		if(!newOrder){
			let newOrder = orders.find(e => e.to === null);
			if(!newOrder){
				newOrder = new Order();
				newOrder.transporter=null;
				newOrder.from=null;
				newOrder.to=target.id;
				newOrder.value=50;//one storage
				orders.push(newOrder);
				LOGGER.debug("managertransport orderTo add order:"+newOrder);
			}else{
				newOrder.to = target.id;
				LOGGER.debug("managertransport orderTo at order:"+newOrder);
			}

		}

	},

	orderFrom: function(memoryObject,target){
		if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport orderTo No init for " + memoryObject);
            return;
        }

		let orders = memoryObject.memory.managertransport[INDEX_ORDER];
		let newOrder = orders.find(e => e.from === target.id);
		//describe order
		if(!newOrder){
			let newOrder = orders.find(e => e.from === null);
			if(!newOrder){
				newOrder = new Order();
				newOrder.transporter=null;
				newOrder.from=target.id;
				newOrder.to=null;
				newOrder.value=50;//one storage
				orders.push(newOrder);
				LOGGER.debug("managertransport orderFrom add order:"+newOrder);
			}else{
				newOrder.from = target.id;
				LOGGER.debug("managertransport registerAsTransporter at order:"+newOrder);
			}

		}

	},



	registerAsTransporter: function(memoryObject,target){
		if(!memoryObject.memory.managertransport || !memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport orderTo No init for " + memoryObject);
            return;
        }

		let orders = memoryObject.memory.managertransport[INDEX_ORDER];
		let newOrder = orders.find(e => e.transporter === target.id);
		//describe order
		if(!newOrder){
			newOrder = orders.find(e => e.transporter === null);
			if(!newOrder){
				newOrder = new Order();
				newOrder.transporter=target.id;
				newOrder.from=null;
				newOrder.to=null;
				newOrder.value=50;//one storage
				orders.push(newOrder);
				LOGGER.debug("managertransport registerAsTransporter add order:"+newOrder);
			}else{
				newOrder.transporter = target.id;
				LOGGER.debug("managertransport registerAsTransporter at order:"+newOrder);
			}

		}
		target.memory.from=newOrder.from;
		target.memory.to=newOrder.to;
	},

	calculateMaxTransporter: function (memoryObject){
		if(!memoryObject.memory.managertransport[INDEX_INIT]){
            LOGGER.error("managertransport calculateMaxHarvester No init");
            return;
        }
		let orders = memoryObject.memory.managertransport[INDEX_ORDER];
		var count = 0;
		for(let i=0; i<orders.length; i++){
			if (orders[i].transporter===null){
				count ++;
			}
		}
		return count;
	},

};
module.exports = managertransport;
