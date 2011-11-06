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

