/*
 * GET home page.
 */
  var model_name = 'UserAccount';
  var coll_name = 'accounts';

exports.index = function(req, res){
  res.render('index', { title: 'Cloud Note' })
};

exports.signup = function(req, res){
  res.render('signup', { title: 'Sign Up' })
};

exports.login = function(req, res){
  res.render('login', { title: 'Login' })
};

exports.signin = function(req, res){
  var mongoose = require('mongoose');
  var USER  = mongoose.model(model_name, coll_name);
  var user = new USER();
  user.name = req.body.user.name;
  user.email = req.body.user.email;
  user.password = req.body.user.password;
  user.save(function(err) {
    if (err) {
      console.log('save failed');
      res.render('signin', { title: 'Sign In Failed', signed : false });
    }else{
      console.log('save success');
      res.render('signin', { title: 'Sign Ok', signed : true });
    }
      });
};

exports.logon = function(req, res){
	var mongoose = require('mongoose');
	var USER = mongoose.model(model_name, coll_name);
	
	USER.findOne( { name: req.body.user.name}, function( err, theUser ){
		if ( err )
		{
		  console.error("db findOne error.");
		  console.error(err);
		}
		else
		{
			if ( theUser == null ){
				res.render('login', { title: 'Not Found User'});
			}
			else {
				if ( theUser.password == req.body.user.password ){
					req.session.user = theUser;
					res.render('main', { title : 'Login' , username : theUser.name } );
				}else{
					res.render('login', { title : 'Password wrong'});
				}				
			}
		}
	});	
}

exports.main = function(req, res){
	res.render('main', { title : 'Not login', username : 'need login' } );
}

exports.domain = function(req, res){
	if ( req.session == null )
		res.redirect('login' , { title : 'Login'});
	else {
		var mongoose = require('mongoose');
		var UserDomain = mongoose.model('UserDomain', 'domains');
		UserDomain.findOne( { userid: req.session.user._id}, function( err, userDomain ){
			var domains = new Array ( { name : 'default' } );
			if ( userDomain )
				domains = userDomain.domains;
			res.render('domain', {title:'Domain Management', mydomains: domains});
		});
	}
}

exports.domainSave = function(req, res){
	var mongoose = require('mongoose');
	var UserDomain = mongoose.model('UserDomain', 'domains');
	UserDomain.findOne( { userid: req.session.user._id}, function( err, userDomain ){
		if ( userDomain == null ){
			userDomain = new UserDomain();
			userDomain.userid = req.session.user._id;
		}

		userDomainSet ( userDomain, req.body.domains.n0, 0);
		userDomainSet ( userDomain, req.body.domains.n1, 1);
		userDomainSet ( userDomain, req.body.domains.n2, 2);
		userDomainSet ( userDomain, req.body.domains.n3, 3);
		userDomainSet ( userDomain, req.body.domains.n4, 4);
		userDomainSet ( userDomain, req.body.domains.n5, 5);
		userDomainSet ( userDomain, req.body.domains.n6, 6);
		userDomainSet ( userDomain, req.body.domains.n7, 7);

		userDomain.save(function(err) {
			if (err) {
				console.log('user domain save failed');
				console.error(err);
			}
			res.render('domain', {title:'Domain Management', mydomains: userDomain.domains});
		});
		
	});
}

function userDomainSet ( userDomain , domainName , index ){
	if ( domainName ){
		if ( userDomain.domains.length > index )
			userDomain.domains[index].name = domainName ;
		else
			userDomain.domains.push( { name : domainName } );
	}
}

exports.category = function(req, res){
	if ( req.session.user == null ){
		res.render('login', { title: 'Need Login'});
		return ;
	}

	var mongoose = require('mongoose');
	var UserDomain = mongoose.model('UserDomain', 'domains');
	UserDomain.findOne( { userid: req.session.user._id}, function( err, userDomain ){
		var domains = {};
		if ( userDomain )
			domains = userDomain.domains;
			res.render('category', {title:'Category Management', domains: domains});
	});		
}

exports.categorySave = function(req, res){
	console.log(req.body.domain.id);
	console.log(req.body.category.name);
	
	var mongoose = require('mongoose');
	var Category = mongoose.model('Category', 'categorys');
	Category.findOne( { domainid : req.body.domain.id , name : req.body.category.name } , 
		function( err, dcategory ){
			if ( dcategory  ){
//				var UserDomain = mongoose.model('UserDomain', 'domains');
//				var domains = UserDomain.findOne( { userid: req.session.user._id}, function( err, userDomain ){
//  				  res.render('category', {title:'Category Name Exist!', domains: userDomain.domains});
//				});
				res.redirect('BACK');
				return;
			}else {
				dcategory = new Category();
				dcategory.domainid = req.body.domain.id ;
				dcategory.name = req.body.category.name ;
				dcategory.sort = 0 ;
	
				dcategory.save(function(err){
					if ( err ){
						console.error(err);
					}else {
						console.log('category create ok');
					}
					Category.find( { domainid : req.body.domain.id } , 
					  function ( err, categorys ) {
						var UserDomain = mongoose.model('UserDomain', 'domains');
						UserDomain.findOne( { userid: req.session.user._id}, function( err, userDomain ){
		  				  res.render('category', {title:'Category Management', domains: userDomain.domains, categorys : categorys});
						});
		  			});
				});
			}
	});
}

exports.webnote = function(req,res){
	if ( req.session.user == null ){
		res.render('login', { title: 'Need Login'});
		return ;
	}
	var mongoose = require('mongoose');
	var UserDomain = mongoose.model('UserDomain', 'domains');
	var Category = mongoose.model('Category', 'categorys');
	
	UserDomain.findOne( { userid: req.session.user._id}, 
		function( err, userDomain ){
			if ( err ) res.redirect('BACK');
			
			if ( userDomain && userDomain.domains && userDomain.domains.length > 0 ){
				Category.find( { domainid : userDomain.domains[0]._id } , 
				  function ( err, categorys ) {
	  				  res.render('webnote', {title:'Create New Web Note', domains: userDomain.domains, categorys : categorys});
	  			});
			}
			else
				res.redirect('BACK');
	});

}

exports.webnoteSave = function(req, res){
	var mongoose = require('mongoose');
	var UserNote = mongoose.model('UserNote','notes');
	var note = new UserNote();
	note.title = req.body.note.title;
	note.keyword = req.body.note.keyword;
	note.categoryid = req.body.category.id;
	
	note.save(function(err){
		if ( err ){
			console.error('note save failed');
			console.error(err);
		}else {
			console.log('note saved');
		}
		noteSaveS3(note, req.body.note.content);
		exports.webnote(req, res);
	});
}

function noteSaveS3( note, content ){
	var knox = require('knox')
	  , fs = require('fs');

	try {
	  var authFile = fs.readFileSync('./auth', 'ascii');
	  console.log('authFile read');
	  console.log(authFile);
	  var auth = JSON.parse(authFile);
	  console.log("auth is:");
	  console.log(auth);
	  var client = knox.createClient(auth);
	  console.log('create client');
	  buf = new Buffer(content);
	  var req = client.put('/'+note.categoryid+'/'+note._id, {
		   'Content-Length': buf.length
		   , 'Content-Type': 'text/plain'
		   });
	  req.on('response', function(res){
		  console.log(res.statusCode);
		  console.log(res.headers);
		  res.on('data', function(chunk){
		    console.log(chunk.toString());
		  });
	  });
	  // Send the request with the file's Buffer obj
	  req.end(buf);
	} catch (err) {
	  console.error(err);
	  return;
	}
}

exports.filenote = function(req, res){
	if ( req.session.user == null ){
		res.render('login', { title: 'Need Login'});
		return ;
	}
	var mongoose = require('mongoose');
	var UserDomain = mongoose.model('UserDomain', 'domains');
	var Category = mongoose.model('Category', 'categorys');
	
	UserDomain.findOne( { userid: req.session.user._id}, 
		function( err, userDomain ){
			if ( err ) res.redirect('BACK');
			
			if ( userDomain && userDomain.domains && userDomain.domains.length > 0 ){
				Category.find( { domainid : userDomain.domains[0]._id } , 
				  function ( err, categorys ) {
	  				  res.render('filenote', {title:'Create New File Note', domains: userDomain.domains, categorys : categorys});
	  			});
			}
			else
				res.redirect('BACK');
	});
}

exports.filenoteSave = function(req,res,next){
	var mongoose = require('mongoose');
	var UserNote = mongoose.model('UserNote','notes');
	var note = new UserNote();

	console.log('wait file transfer complete..');
	req.form.complete(function(err, fields, files){
		console.log(fields.note);
	    if (err) {
	      console.log('upload file error');
	      console.error(err);
	    } else {
	    	console.log('uplode file ok');
	    	note.title = fields.title;
	    	note.keyword = fields.keyword;
	    	note.categoryid = fields.categoryid;
	    	note.save(function(err){
	    		if ( err ){
	    			console.error('note save failed');
	    			console.error(err);
	    		}else {
	    			console.log('note saved');
	    		}
	    		fileSaveS3(note, files);
	    	});
	    }
	    exports.filenote(req, res);
	});
	req.form.on('progress', function(bytesReceived, bytesExpected){
	    var percent = (bytesReceived / bytesExpected * 100) | 0;
	    process.stdout.write('Uploading: %' + percent + '\r');
	  });
	console.log('form passsed');
}

function fileSaveS3(note, files){
	var knox = require('knox')
	  , fs = require('fs');

	try {
	  var authFile = fs.readFileSync('./auth', 'ascii');
	  var auth = JSON.parse(authFile);
	  var client = knox.createClient(auth);
	  console.log(files);
	  console.log(files.file.path);
	  console.log('/'+note.categoryid+'/'+note._id);
	  client.putFile(files.file.path, '/'+note.categoryid+'/'+note._id, function(err, res){
	      if ( err ){
	    	  console.log('putFile failed');
	    	  console.error(err);
	    	  return;
	      }
	      else {
		      console.log(res);
	      }
	    });
	} catch (err) {
	  console.error(err);
	  return;
	}
}

exports.search = function(req, res){
	res.render('search', {title:'Note Search', notes: {} } ); 
}

exports.searchNote = function(req, res){
	
	// { $or : [{keyword:/.*b2.*/i},{title:/.*aa.*/i}]}
	var key = eval('/.*'+req.body.note.keyword+'.*/i');
	var cd1 = { keyword :key }, cd2 = { title : key };
	var query = { $or : [ cd1, cd2]};
	
	var mongoose = require('mongoose');
	var UserNote = mongoose.model('UserNote','notes');
	UserNote.find( query , function (err, notes) {
		if ( err ){
			console.error(err);
			res.render('search', {title:'Note Search', notes: {} } ); 
		}
		else
		{
			res.render('search', {title:'Note Search', notes: notes } ); 
		}
	});
}