var knox = require('knox')
  , fs = require('fs');

try {
  var auth = { key : 'AKIAITGASHNZ4NTGR7MA', secret : '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', bucket : 'JasonNote' };
  var client = knox.createClient(auth);
  
//  client.get('/').on('response', function(res){
//	   console.log('Get /');
//	   res.setEncoding('utf8');
//	   res.on('data', function(chunk){
//	     console.log(chunk);
//	   });
//    }).end();
//     
//  client.get('/Test/').on('response', function(res){
//	   console.log('Get /Test');
//	   res.setEncoding('utf8');
//	   res.on('data', function(chunk){
//	     console.log(chunk);
//	   });
//    }).end();
//        
//        
//  client.get('/Test/hello.txt').on('response', function(res){
//	   console.log('Get /Test/hello.txt');
//	   res.setEncoding('utf8');
//	   res.on('data', function(chunk){
//	     console.log(chunk);
//	   });
//    }).end();
  client.putFile('app.js', 'Look/app.js', function(err, res){
	  if ( err )
		  console.error(err);
	  else
      {
    	  res.setEncoding('utf8');
   	      res.on('data', function(chunk){
   	          console.log(chunk);
   	      });
      }
	}); 
} catch (err) {
  console.error(err);
  process.exit(1);
}

console.log('staring....');
