
/***************************
 * error.js
 * 
 * handle all error
 * 
 * logfile : create at app.js, save log to today's log file
 * 
 */

 exports.capture = function(err, req, res, next){
	 if ( req.isXMLHttpRequest )
		 res.send({result:err.message});
	 else
		 res.render('error/unhandle', { title:'error' , error : err.message });
 }
