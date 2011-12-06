/*************************
 * checks.js  
 * 
 * functions:
 * 		checkSession     check has user login, and session valid
 * 		checkLogin		 login user by email & password
 * 		checkEmailPwd    check email vaild then regenerate pwd and email
 * 
 * 
 */
var TABLE = require('./tableDict');
var crypto = require('crypto');
var mongoose = require('mongoose');
var USER = mongoose.model(TABLE.UserAccount.TableName, TABLE.UserAccount.Column.Accounts ); 

// check user has logged in
exports.checkSession = function (req,res,next){
	if ( req.session && req.session.user )
		next();
	  else
		res.redirect('/login');
};


exports.checkLogin = function(req,res,next){
	// if use 'GET' verb --> req.query.user.email
	// now use 'POST' verb --> req.body.user.email

	var lingua = res.lingua.content;
    
	USER.findOne( { email : req.body.user.email } , function( err, theUser ){
		if ( err ){
			res.json({ result : lingua.login.dberror});
			return ;
		}
		
		if ( theUser == null ){
			res.json({ result : lingua.login.invalid });
			return;
		}

		if ( theUser.password == sha1NewPassword( req.body.user.password ) ){
			loginSessionSave( req, theUser, req.body.user.keepSession);
			if ( needAccountManage(theUser) )
				res.json({result:'account'});
			else
				res.json({ result : 'ok' } );
		}else{
			res.json({ result : lingua.login.invalid });
		}				
	
	});
}

exports.checkEmailPwd = function(req,res,next){
	var lingua = res.lingua.content;
 
	USER.findOne( { email : req.query.user.email } , function( err, theUser ){
		if ( err ){
			res.json({ result : lingua.login.dberror});
			return;
		}

		if ( theUser == null ){
			res.json({ result : lingua.login.invalidEmail });
		}
		else {
			var newPwd = generateNewPassword();
			theUser.password = sha1NewPassword(newPwd) ;
			theUser.save(function(err){
				if ( err ){
					res.json({ result: lingua.login.autoChangePwdFaild });
					return ;
				}
				var subject = lingua.login.pwdEmailSubject;
				var body = lingua.login.pwdEmailBodyHeader+newPwd;
				passwordChangeEmailSend(theUser.email,subject,body,
				    function(err, result){
				      if(err) 
				    	  res.json({ result: lingua.login.emailSendFail });
				      else
				    	  res.json({ result : lingua.login.pwdEmailSendOk } );	
				    }
				);
			});
	
		} // else--
		
	});
}

exports.checkEmailValid = function(req,res,next){
	var lingua = res.lingua.content;
	
	USER.findOne( { email : req.body.owner.email } , function( err, theUser ){
		if ( err ){
			res.json({ result : lingua.errors.dberror});
			return;
		}
	
		if ( theUser == null ){
			res.json({ result : lingua.signup.validEmail });
		}
		else {
			res.json({ result : lingua.signup.invalidEmail });
		}
	});
}

exports.checkSignup = function(req,res,next){
	var lingua = res.lingua.content;
	
	USER.findOne( { email : req.body.owner.email } , function( err, theUser ){
		if ( err ){
			res.json({ result : lingua.errors.dberror});
			return;
		}
	
		if ( theUser == null ){
			if ( req.body.owner.password.length < 4 ){
				res.json({ result : lingua.signup.pwdlen });
				return ;
			}
			if ( req.body.owner.password != req.body.owner.confirm ){
				res.json({ result : lingua.signup.pwddiff});
				return ;
			}
			
			createNewAccount( lingua, res, req.body.owner.email, req.body.owner.password );
		}
		else {
			res.json({ result : lingua.signup.invalidEmail });
		}
	});
}

function needAccountManage( user ){
	if ( user.name == user.email )
		return true;
	return false;
}

function createNewAccount ( lingua, res, email, password ){
	var user = new USER();
	user.email = email;
	user.name = email;
	user.password = sha1NewPassword(password);
	user.save(function(err) {
	    if (err) {
	      res.json({ result : lingua.signup.createFailed });
	    }else{
	      res.json({result:'ok'});
	    }
	});
}

function generateNewPassword(){
	return String(Math.round(Math.random()*100000000));
}

function passwordChangeEmailSend( mailto , subject, body , callback ){
	var email = require("mailer");	
	var fs = require("fs");
	var authFile = fs.readFileSync('./certs/mailauth', 'ascii');
    var mailauth = JSON.parse(authFile);
	email.send({
	      host : mailauth.host,              // smtp server hostname
	      port : mailauth.port,                     // smtp server port
	      ssl: mailauth.ssl,                        // for SSL support - REQUIRES NODE v0.3.x OR HIGHER
	      domain : mailauth.domain,            // domain used by client to identify itself to server
	      to : mailto,
	      from : mailauth.from,
	      subject : subject,
	      body: body,
	      authentication : mailauth.authentication,        // auth login is supported; anything else is no auth
	      username : mailauth.username,        // username
	      password : mailauth.password         // password
	    }, callback );
}

function sha1NewPassword(newPwd){
	var shasum = crypto.createHash('sha1');
	shasum.update(newPwd);
	return String(shasum.digest('hex'));
}

function loginSessionSave( req, user , keepSession ){
	if ( keepSession == 'true' ) {
		var day30 = 3600000 * 24 * 30 ;
		req.session.cookie.expires = new Date(Date.now() + day30);
		req.session.cookie.maxAge = day30;
	}else{
		req.session.cookie.expires = false;
	}		
	
	req.session.user = user;
}