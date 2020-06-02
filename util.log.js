var d = new Date();

var utilLog = {
    // /** @param {message} the message **/
    // test: function (message){
        
        
    // }
    
    /** @param {message} the message **/
    debug: function(message) {
        console.log(d.getMilliseconds()+" debug: "+message );
        
        
        
        
        
	
	   // if(Memory.iterations > callCount ){
	   //     console.log("LOGGER: Memory.iterations "+ Memory.iterations)
    	//}else{
    	   // Memory.iterations = callCount;
	    
	    
	       // console.log("LOGGER: callCount "+callCount );
	   // }
	
    }
};

module.exports = utilLog;