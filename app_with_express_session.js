var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
const mongoose=require('mongoose');
const Dishes=require('./models/dishes');

const url="mongodb+srv://sunnytyagi26:iwttaiiit@cluster0.i2jgp.mongodb.net/test";
mongoose.connect(url).then((db)=>{
  console.log("Connected to server");
}).catch((err)=>console.log(err))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name:'session-id',
  resave:false,
  saveUninitialized:false,
  secret:'12345-67890-09876-54321',
  store:new FileStore()
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// authentication middleware with express-session and before making login and signup route

/*function auth (req, res, next) {
  console.log(req.session);
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    if(username=="admin" && password==="12345678"){
      //res.cookie('user','admin',{signed:true});
      req.session.user='admin';
      next();
    }else{
      var err=new Error("You are not Authenticated");
      res.setHeader("WWW-Authenticate","Basic")
      err.status=401;
      next(err);
    }
  }else{
    if(req.session.user==="admin"){
      console.log('re.session',req.session);
      
      next();
    }else{
      var err=new Error("You are not Authenticated");
      res.status=401;
      next(err);
    }
  }
};*/

// authentication middleware with express-session and after making login and signup route

function auth (req, res, next) {
  
  if (!req.session.user) {
    var err = new Error('You are not authenticated!');             
    err.status = 401;
    next(err);
    return;
  }else{
    if(req.session.user==="authenticated"){
      console.log('re.session',req.session);
      
      next();
    }else{
      var err=new Error("You are not Authenticated");
      res.status=401;
      next(err);
    }
  }
};
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
