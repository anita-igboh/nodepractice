var util = require('../middleware/utilities');
var config = require('../config');

module.exports.login = login;
module.exports.logOut = logOut;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
let index = function index(req, res){
    // res.cookie('IndexCookie', 'This was set from Index');
    res.render ('index', {title: 'Index Page'});
    // cookie: JSON.stringify (req.cookies), 
    // session: JSON.stringify(req.session),
    // signedCookie: JSON.stringify(req.signedCookies)});
};
function login(req, res){
  res.render('login', {title: 'Login', message: req.flash('error')});
};
function loginProcess(req, res){
    var isAuth = util.auth(req.body.username, req.body.password, req.
  session);
    if (isAuth) {
      res.redirect('/chat');
    }else {
      req.flash('error', 'Wrong Username or Password');
      res.redirect(config.routes.login);
} 
};
function chat(req, res){
res.send('Chat');
};
module.exports.index = index;

function logOut(req, res){
    util.logOut(req.session);
    res.redirect('/');
};


