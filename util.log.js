var d = new Date();

var  debugLvl = false;

var   infoLvl = true;



var utilLog = {
    // /** @param {message} the message **/
    // test: function (message){
        
        
    // }
    
    /** @param {message} the message **/
    debug: function(message) {
        if (debugLvl) {
        console.log(d.getMilliseconds()+" debug: "+message );
        }
    },
    info: function(message){
        if (infoLvl) {
        console.log(d.getMilliseconds()+" debug: "+message );
        }
    }
};

module.exports = utilLog;