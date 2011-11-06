
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
require('./models');

var app = module.exports = express.createServer();

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

app.post('/signup', routes.signin);
app.post('/login', routes.logon);
app.post('/domain', routes.domainSave);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
