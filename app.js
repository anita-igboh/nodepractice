var util = require('./middleware/utilities');
var session = require('express-session');
var RedisStore = require('connect-redis')({session});
var partials = require('express-partials');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var routes = require('./routes');
var errorHandlers = require('./middleware/errorhandlers');
var log = require('./middleware/log');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var config = require('./config');
  
app.use(partials());
app.set('view engine', 'ejs');
app.set('view options', {defaultLayout: 'layout'});


app.use(log.logger);
app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore(
        {url: config.redisUrl})
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(express.static(__dirname + '/static'));
   
   
   
   app.use(function(req, res, next){
    if(req.session.pageCount)
      req.session.pageCount++;
    else
      req.session.pageCount = 1;
    next();
 });
 app.use(flash());
 app.use(util.templateRoutes);
 
   app.get('/', routes.index);
   app.get(config.routes.login, routes.login);
   app.post(config.routes.login, routes.loginProcess);
   app.get('/chat', [util.requireAuthentication], routes.chat);
   app.get(config.routes.logout, routes.logOut);

   app.use(errorHandlers.error);
   app.use(errorHandlers.notFound);
   app.listen(config.port);
   console.log("App server running on port 3000");

   app.get('/account/login', routes.login);
