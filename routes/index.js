/*
 * GET home page.
 */

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
  res.render('signin', { title: 'Sign In' })
};