
var TABLE = require('./tableDict');

// check user has logged in
exports.checkSession = function (req,res,next){
	if ( req.session && req.session.user )
		next();
	  else
		res.redirect('/login');
};

exports.checkLogin = function(req,res){
	// if use 'GET' verb --> req.query.user.email
	// now use 'POST' verb --> req.body.user.email
	var mongoose = require('mongoose');
	var lingua = res.lingua.content;
	var USER = mongoose.model(TABLE.UserAccount.TableName, TABLE.UserAccount.Column.Accounts ); // );
	USER.findOne( { name: req.body.user.email }, function( err, theUser ){
		if ( err ){
			res.json({ result : lingua.login.dberror});
		}
		else{
			if ( theUser == null ){
				res.json({ result : lingua.login.invalid });
			}
			else {
				if ( theUser.password == req.body.user.password ){
					res.json({ result : 'ok' } );
				}else{
					res.json({ result : lingua.login.invalid });
				}				
			}
		}			
	});
}