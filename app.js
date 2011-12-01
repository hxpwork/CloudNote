
/**
 * Module dependencies.
 */

var express = require('express')			// express.js
  , lingua = require('lingua')				// i18n handle
  , load_models = require('./models')		// mongodb models load
  , jadeRoutes = require('./routes') 		// load jade routes
  , checks = require('./routes/checks.js'); // load route check
/**
 * Start https server
 * 
 */
//var fs = require("fs");
//var options = {
//  key: fs.readFileSync('certs/privatekey.pem'),
//  cert: fs.readFileSync('certs/certificate.pem')
//};
//var app = module.exports = express.createServer(options);

/**
 * Start http server
 * 
 */
var app = module.exports = express.createServer(); 

// Configuration

app.configure(function(){
  var RedisStore = require('connect-redis')(express);	// register redis for session save
  app.register(".html", require("jqtpl").express);		// set html file will handle by jqtpl view engine
  app.set('views', __dirname + '/views');				// set views path
  app.set('view engine', 'jade');						// set default view engine is jade
  
  app.use(lingua(app, { 
	  				defaultLocale: 'en', 
	  				path: __dirname + '/i18n' }));		// define lingua config
    
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use(app.router);
  
  app.use(express.static(__dirname + '/public'));		// share /public on web
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  app.set('view cache', true);				// production envionment startup view cache
});

// Routes

app.get('/', checks.checkSession, jadeRoutes.index);

function _to(filename){
	return function(req, res){ res.render(filename,{layout: false });};
}
app.all('/login',  _to('login.html'));
app.all('/signup', _to('signup.html'));
app.post('/checkLogin', checks.checkLogin);


app.get('/signin', 		jadeRoutes.signin);
app.get('/main', 		jadeRoutes.main);
app.get('/domain', 		jadeRoutes.domain);
app.post('/domain', 	jadeRoutes.domainSave);
app.get('/category', 	jadeRoutes.category);
app.post('/category', 	jadeRoutes.categorySave);
app.get('/webnote', 	jadeRoutes.webnote);
app.post('/webnote', 	jadeRoutes.webnoteSave);
app.get('/filenote', 	jadeRoutes.filenote);
app.post('/filenote', 	jadeRoutes.filenoteSave);
app.get('/search', 		jadeRoutes.search);
app.post('/search', 	jadeRoutes.searchNote);

// from phone 
app.get('/phoneLogin/:user/:password', jadeRoutes.phoneLogin);

// start server listen at port 3000
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
