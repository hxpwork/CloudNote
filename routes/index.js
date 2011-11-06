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