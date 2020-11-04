//return;
const LOGGER = require('util.log');
Creep.prototype.saveMove = function() { 
LOGGER.debug("protoypes Test Creep.prototype.saveMove");
};




// Make sure we haven't already stored the original
if (!Creep.prototype._say) {
			// Store the original method
		Creep.prototype._say = Creep.prototype.say;
		
		// Create our new function
		Creep.prototype.say = function(txt) {
			let error = 0;
			// Add custom functionality
			if(Game.time % 4 >=2){
				// Call and return the original method
				let error = this._say(txt);
			}
			return error;
		}
}

if(!Creep.prototype._moveTo){
	// Store the original method
	Creep.prototype._moveTo = Creep.prototype.moveTo;
	// Create our new function
	Creep.prototype.moveTo = function() {
		// Add custom functionality

		// Call and return the original method
		let error = this._moveTo.apply(this,arguments);
		
		if(error != OK  ){
			for (let prop in arguments){
				arguments[prop]
				LOGGER.error("protoypes MOVETO "+this.name+" was at "+this.pos+" error "+ error +" arg "+arguments[prop]);
			}
			this.saveMove(error , arguments);
		}
		return error;
	}	
}

Creep.prototype.saveMove = function(error, arguments){
    
	switch(error){
		case OK:
			LOGGER.debug("protoypes SAVEMOVE "+this.name+" was at "+this.pos+" with result "+error+" OK arguments were "+arguments); 
		break;
		case ERR_TIRED:
			LOGGER.debug("protoypes SAVEMOVE "+this.name+" was at "+this.pos + " with result "+error+" ERR_TIRED arguments were "+arguments); 								
		break;
		default:
		return;
			let direction = Math.floor(Math.random()*8)
			direction = direction* (direction%2);
			LOGGER.error("protoypes SAVEMOVE "+this.name+" was at "+this.pos + " with result "+error+" UNKNOWN arguments were "+arguments); 
			error = this.move(direction);
			LOGGER.error("protoypes SAVEMOVE try "+this.name+" "+direction+" result: "+error);
		break;
	}
		
};
