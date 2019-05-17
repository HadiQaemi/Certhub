var express = require('express');
var router = express.Router();
var useragent = require('express-useragent');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JDate = require('jalali-date');
var multer  = require('multer');
var upload = multer({ dest: 'statisch/uploads/' , fileFilter: fileFilter,limits: { fileSize: 8 * 1024 * 1024 }})


function fileFilter (req, file, cb){
    var type = file.mimetype;
    var typeArray = type.split("/");
    if (typeArray[0] == "video" || typeArray[0] == "image") {
      cb(null, true);
    }else {
      cb(null, false);
      cb(new Error('I don\'t have a clue!'))
    }
  }

  var User = require('../model/user');
  var agent = require('../model/agent');
  var Kunde = require('../model/kunde');
  var Major = require('../model/major');




function showStatusLabale(arg){
    switch(arg){
        case true:
             arg  = "فعال";
             break;
        case false:
             arg  = "غیر فعال";
             break;
             
    }
    
    return arg;

}
function showAclLabel(arg){
    switch(arg){
        case 2:
             arg  = "مدیر ارشد";
             break;
        case 3:
             arg  = "مدیر";
             break;
             
        case 4:
             arg  = "کاربر";
             break;
    }
    
    return arg;

}
      

function checkIfTrue(arg){
    switch(arg){
        case true:
             arg  = "checked";
             break;
        case false:
             arg  = " ";
             break;
             
    }
    
    return arg;
}


const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

router.use(useragent.express());


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        next();
        return;
    }
    res.redirect('/verwalten/login');
}




//login page
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

passport.use('local-login',new LocalStrategy({
        usernameField : 'email',
        passwordField :  'password',
    },
    function(email,password,done){
        User.findOne({email:email},function(err,user){
            if(err){return done(err);}
            if(!user){
                return done(null,false,{});
            }
            if(!User.validpass(password,user.password)){
                return done(null,false,{});
            }
        
            return done(null,user);
        });
    }
))




router.get('/index',function (req,res){
    console.log('test');
    res.render('system/index');
});


router.get('/regschuler',function (req,res){
    res.render('system/regSchuler');
});
router.post('/regschuler',function (req,res){
   res.send(req.body);
});


router.get('/reguser',function (req,res){
    res.render('system/regKunde');
});
router.post('/reguser', [
    check('name').not().isEmpty().escape().withMessage('نام را وارد کنید'),
    check('family').not().isEmpty().withMessage('نام خانوادگی  را وارد کنید'),
    check('email').not().isEmpty().withMessage('ایمیل   را وارد کنید'),
    check('email').isEmail().withMessage('ایمیل را بصورت صحیح وارد کنید'),
  ], function(req,res){
    //add new administrator  
        var  name     = req.body.name;
        var  family   = req.body.family;
        var  mobile   = req.body.mobile;
        var  email    = req.body.email;
        var  acl    = req.body.acl;
        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            res.render('system/regKunde' , {
                errors:errors.array(),
                name:name,
                family:family,
                mobile:mobile,
                email:email,
                acl,acl,
            });
            return;
        }

        var newUser = User({
            name:name,
            family:family,
            mobile:mobile,
            email:email,
            passtmp:'123',
            acl: acl,
            status:true,
        })
        newUser.save(function(err,data){
            if(err) throw err;
            res.redirect('/listuser');     
        });
});

module.exports = router;