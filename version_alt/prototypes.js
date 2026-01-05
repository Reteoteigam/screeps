//return;
const LOGGER = require( 'util.log' );
Creep.prototype.saveMove = function() {
  LOGGER.debug( "protoypes Test Creep.prototype.saveMove" );
};


// Make sure we haven't already stored the original
if ( !Creep.prototype._say ) {
  // Store the original method
  Creep.prototype._say = Creep.prototype.say;

  // Create our new function
  Creep.prototype.say = function( txt ) {
    let error = 0;
    // Add custom functionality
    if ( Game.time % 4 >= 2 ) {
      // Call and return the original method
      let error = this._say( txt );
    }
    return error;
  }
}

if ( !Creep.prototype._moveTo ) {
  // Store the original method
  Creep.prototype._moveTo = Creep.prototype.moveTo;
  // Create our new function
  Creep.prototype.moveTo = function() {
    // Add custom functionality

    // Call and return the original method
    let error = this._moveTo.apply( this, arguments );
    this.logParameter( error, arguments );
    return error;
  }
}

Creep.prototype.logParameter = function( error, arguments ) {
  let message = "protoypes SAVEMOVE " + this.name + " fat: " + this.fatigue + " pos: " + this.pos + " result: " + error;
  let argumentsPrint = "";
  for ( var i = 0; i < arguments.length; i++ ) {
    argumentsPrint = argumentsPrint + "" + arguments[ i ]
  }
  switch ( error ) {
    case OK:
      LOGGER.debug( message + " OK args: " + arguments );
      return;

      break;
    case ERR_TIRED:
      LOGGER.debug( message + " ERR_TIRED args: " + argumentsPrint );
      break;
      return;
    case ERR_NO_PATH:
      LOGGER.error( message + " ERR_NO_PATH args: " + argumentsPrint );

      break;
    default:
      LOGGER.error( message + " UNKNOWN args: " + argumentsPrint );
      break;
  }
};