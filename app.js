
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , form = require('connect-form');

require('./models');

var app = module.exports = express.createServer(form({ keepExtensions: true }));

// Configuration

app.configure(function(){
	var RedisStore = require('connect-redis')(express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.get('/signin', routes.signin);
app.get('/main', routes.main);
app.get('/domain', routes.domain);
app.get('/category', routes.category);
app.get('/webnote', routes.webnote);
app.get('/filenote', routes.filenote);
app.get('/search', routes.search);

app.post('/signup', routes.signin);
app.post('/login', routes.logon);
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
