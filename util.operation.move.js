const LOGGER = require('util.log');

Creep.prototype.sayHello = function() { 
    // In prototype functions, 'this' usually has the value of the object calling 
    // the function. In this case that is whatever creep you are 
    // calling '.sayHello()' on.
    this.say("Hello!"); 
};


	function printError(error){	
		result = "";
		switch (error) {
		    case OK:
				result = "OK";
				break;
		    case ERR_NOT_OWNER:
				result = "ERR_NOT_OWNER";
				break;
			case ERR_BUSY:
				result = "ERR_BUSY";
				break;
			case ERR_TIRED:
				result = "ERR_TIRED";
				break;
			case ERR_NO_PATH:
				result = "ERR_NO_PATH";
				break;
			case ERR_NOT_FOUND:
				result = "ERR_NOT_FOUND";
				break;
			case ERR_INVALID_TARGET:
				result = "ERR_INVALID_TARGET";
				break;
			default:
				result = "unknown:"+error;
				break;
		}
		return result+"("+error+")";
	}
	
	function newMoveTo(creep,target,ops){
		LOGGER.error("!!!111" + creep +"   "+target +"   "+ops);
		if(!ops){
			ops = {visualizePathStyle: {stroke: '#999999'}};
		}
		LOGGER.error("!!!2222" + creep +"   "+target +"   "+ops.visualizePathStyle.stroke);
		error = creep.moveTo(target,{ops});
		switch (error) {
			case OK:
			case ERR_NOT_OWNER:
			case ERR_BUSY:
			case ERR_TIRED:
				LOGGER.debug("discoverer moved correct to "+ target +" error was "+ this.printError(error));
				break;
			case ERR_NO_PATH:
			case ERR_NOT_FOUND:
			case ERR_INVALID_TARGET:
				//FIXME: geht nicht richtig bei raum wechsel, macht -2 trotz das der creep hätte durchgehen können
				LOGGER.error("discoverer move failed "+ target +" error " + this.printError(error));
				var homespawn = Game.getObjectById(creep.memory.home);
				managerMap.newInvalid(homespawn,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);			
				creep.memory.targetRoom =false;
				break;
			default:
				LOGGER.error("discoverer move failed"+ target +" UNEXPECTED error " + this.printError(error));
				var homespawn = Game.getObjectById(creep.memory.home);
				managerMap.newInvalid(newInvalid,creep.memory.targetRoom);
				managerMap.stopDiscovering(homespawn,creep.memory.targetRoom);			
				creep.memory.targetRoom =false;
				break;
		}
	}
	

