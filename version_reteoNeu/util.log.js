let d = new Date();

let debugLvl = false;

let infoLvl = false;
let errorLvl = true;
let counter = 0;

let utilLog = {
  initCounter: function() {
    counter = 0;
  },

  /** @param {message} the message **/
  debug: function( message ) {
    if ( debugLvl ) {
      console.log( d.getMilliseconds() + " " + counter++ + " debug: " + message );

    }
  },
  info: function( message ) {
    if ( infoLvl ) {
      console.log( d.getMilliseconds() + " " + counter++ + " info: " + message );
    }
  },
  error: function( message ) {
    if ( errorLvl ) {
      console.log( d.getMilliseconds() + " " + counter++ + " error: " + message );
    }
  }
};

module.exports = utilLog;