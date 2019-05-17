
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

mongoose.connect('mongodb://localhost/certhub',{useNewUrlParser: true});
mongoose.set('useCreateIndex', true);




app.use(cookieParser());
app.use(session({ secret: 'G~z52]V{`pS', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('statisch'))
app.use(require('./routes'))

app.set("views", "./view/");
app.set('view engine' , 'pug');










app.listen(3000,function(){
    console.log('app start ');
});



//https://github.com/yahoo/xss-filters
//https://www.npmjs.com/package/request-ip
//express-recaptcha

//https://www.npmjs.com/package/helmet
//https://www.npmjs.com/package/passcode