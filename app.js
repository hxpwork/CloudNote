
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , form = require('connect-form')
  , lingua = require('lingua');

require('./models');

var app = module.exports = express.createServer(form({ keepExtensions: true }));

// Configuration

app.configure(function(){
  var RedisStore = require('connect-redis')(express);
  app.register(".html", require("jqtpl").express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // app.set("view engine", "html");


  
  // Lingua configuration
  app.use(lingua(app, { defaultLocale: 'en', path: __dirname + '/i18n' }));
    
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use("/images",express.static(__dirname + '/images'));
  app.use("/javascripts",express.static(__dirname + '/javascripts'));
  app.use("/stylesheets",express.static(__dirname + '/stylesheets'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/signup', function(req, res){
    res.render('signup.html',{ layout: false });
});
app.get('/login',  function(req, res){
    res.render('login.html',{ layout: false });
});
app.get('/signin', routes.signin);
app.get('/main', routes.main);
app.get('/domain', routes.domain);
app.get('/category', routes.category);
app.get('/webnote', routes.webnote);
app.get('/filenote', routes.filenote);
app.get('/search', routes.search);

app.post('/signup', function(req, res){
    res.render('signup.html',{ layout: false });
});
app.post('/login', function(req, res){
    res.render('login.html',{ layout: false });
});
app.post('/domain', routes.domainSave);
app.post('/category', routes.categorySave);
app.post('/webnote', routes.webnoteSave);
app.post('/filenote', routes.filenoteSave);
app.post('/search', routes.searchNote);

app.all('/puttest', function(req,res,next){
	console.log('come all');
	next();
});
app.get('/puttest', routes.puttest);
app.put('/puttest', routes.putcome);
app.del('/puttest', function(req,res,next){
	console.log('come del');
	res.send( 'del received'); 
});

// from phone 
app.get('/phoneLogin/:user/:password', routes.phoneLogin);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
