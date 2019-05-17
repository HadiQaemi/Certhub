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

router.get('/verwalten/index',function (req,res){
    res.render('verwalten/index');
    //res.json(req.user);
});


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

router.get('/login',function(req,res){
    res.render('verwalten/login');
});

router.post('/login',function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    check(email).isEmail().withMessage('ایمیل معتبر نیست');
    check(password).isEmpty().withMessage('پسورد خود را وارد کنید');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('verwalten/login' , {
            errors : errors.array(),
            emeil : email,
        });
        return;
    }
    next();
    
},passport.authenticate('local-login',{failureRedirect:'/verwalten/login'}),function(req,res){
    console.log('login suces');
    res.redirect('/verwalten/index');
});





//register page

router.get('/reg',function (req,res){
    res.render('verwalten/reg')

});



router.post('/reg', [
    check('name').not().isEmpty().escape().withMessage('نام را وارد کنید'),
    check('family').not().isEmpty().withMessage('نام خانوادگی  را وارد کنید'),
    check('mobile').not().isEmpty().withMessage('شماره همراه را وارد کنید'),
    check('mobile').isMobilePhone().withMessage('شماره همراه را صحیح وارد کنید'),
    check('password').isLength({ min: 7 }).withMessage('حداقل طول رمز عبور باید ۷ کارکتر باشد.'),
    check('email').not().isEmpty().withMessage('ایمیل   را وارد کنید'),
    check('password').not().isEmpty().withMessage('رمز عبور را وارد کنید'),
    check('email').isEmail().withMessage('ایمیل را بصورت صحیح وارد کنید'),
  ], function(req,res){
    //add new user  
    var  name     = req.body.name;
    var  family   = req.body.family;
    var  mobile   = req.body.mobile;
    var  password = req.body.password;
    var  email    = req.body.email;
    //add user agent
    var isMobile    = req.useragent.isMobile;
    var isTablet    = req.useragent.isTablet ;
    var isiPhone    = req.useragent.isiPhone;
    var isAndroid   = req.useragent.isAndroid;
    var isBlackberry= req.useragent.isBlackberry;
    var isOpera     = req.useragent.isOpera;
    var isIE        = req.useragent.isIE;
    var isEdge      = req.useragent.isEdge;
    var isSafari    = req.useragent.isSafari;
    var isFirefox   = req.useragent.isFirefox;
    var isChrome    = req.useragent.isChrome;
    var isWebkit    = req.useragent.isWebkit;
    var isMac       = req.useragent.isMac;
    var isChromeOS  = req.useragent.isChromeOS;
    var isSamsung   = req.useragent.isSamsung;
    var isRaspberry = req.useragent.isRaspberry;
    var isBot       = req.useragent.isBot;
    var isCurl      = req.useragent.isCurl;
    var browser     = req.useragent.browser;
    var version     = req.useragent.version;
    var os          = req.useragent.os;
    var platform    = req.useragent.platform;
    var source      = req.useragent.source;
    var ip          = req.useragent.ip;

    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('verwalten/reg' , {
            errors:errors.array(),
            name:name,
            family:family,
            mobile:mobile,
            email:email,
        });
        return;
    }

    var newUser = User({
        name:name,
        family:family,
        mobile:mobile,
        password: bcrypt.hashSync(password),
        email:email,
    })
    newUser.save(function(err,data){
        if(err) throw err;
        res.redirect('/login');     
    });

    var addagent = agent({
        isMobile    : isMobile,
        isTablet    : isTablet ,
        isiPhone    : isiPhone,
        isAndroid   : isAndroid,
        isBlackberry: isBlackberry,
        isOpera     : isOpera,
        isIE        : isIE,
        isEdge      : isEdge,
        isSafari    : isSafari,
        isFirefox   : isFirefox,
        isChrome    : isChrome,
        isWebkit    : isWebkit,
        isMac       : isMac,
        isChromeOS  : isChromeOS,
        isSamsung   : isSamsung,
        isRaspberry : isRaspberry,
        isBot       : isBot,
        isCurl      : isCurl,
        browser     : browser,
        version     : version,
        os          : os,
        platform    : platform,
        source      : source,
        ip          : ip,
    });
    addagent.save(function(erro){
        if(erro) throw erro;   
    });
});



router.get('/regkunde',function (req,res){
    res.render('verwalten/regKunde');
});
router.post('/regkunde', [
    check('name').not().isEmpty().escape().withMessage('نام را وارد کنید'),
    check('email').not().isEmpty().withMessage('ایمیل   را وارد کنید'),
    check('email').isEmail().withMessage('ایمیل را بصورت صحیح وارد کنید'),
  ], function(req,res){
        var  name     = req.body.name;
        var  type_kunde     = req.body.type_kunde;
        var  phone     = req.body.phone;
        var  address     = req.body.address;
        var  kundename     = req.body.kundename;
        var  family     = req.body.family;
        var  mobile     = req.body.mobile;
        var  email     = req.body.email;
        var  canbeexpired     = req.body.canbeexpired;
        var  startTime     = req.body.startTime;
        var  endTime     = req.body.endTime;
        var  ipRestrict     = req.body.ipRestrict;
        var  ipRange     = req.body.ipRange;
        var  timeRestrict     = req.body.timeRestrict;
        var  timeRange     = req.body.timeRange;
        var  userId;
       
        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            res.render('verwalten/regMenchen' , {
                errors:errors.array(),
                name:name,
                family:family,
                mobile:mobile,
                email:email,
            });
            return;
        }

        var newUser = User({
            name:name,
            family:family,
            mobile:mobile,
            email:email,
            passtmp:'123',
            acl: 2,
            status:true,
        })
        newUser.save(function(err,data){
            if(err) throw err;

            
            userId = data._id;

            var newKunde = Kunde({
                phone:phone,
                userId:userId,
                address:address,
                kundename:kundename,
                canbeexpired:canbeexpired,
                startTime:startTime,
                endTime:endTime,
                ipRestrict:ipRestrict,
                ipRange:ipRange,
                timeRestrict:timeRestrict,
                timeRange:timeRange,
                type:type_kunde,
                
    
            })
            newKunde.save(function(err,data){
                if(err) throw err;

                User.findById(userId,function(errupdate,userupdate){
                    if(errupdate) throw errupdate;

                    userupdate.kunde_id = data._id;

                    userupdate.save(function(err){
                        if(err) throw err;

                    });
                });


                res.redirect('/listkunde');     
            });
            
        });

        
});


router.get('/listkunde',function (req,res){
    Kunde.find({}).select('_id create_at kundename ').populate({
        path:  'userId', 
        model: 'User',
        select: 'name family'
    }).exec(function(err , kundes){
        if(err) throw err



        res.render('verwalten/listKunde',{
            title : 'مدیریت کاربران ',
            kundes : kundes,
            JDate:JDate,


        });
        
    });
    
    

});

router.get('/editkunde/:id/edit',function (req,res){
    Kunde.findById(req.params.id).select('_id create_at kundename phone address canbeexpired').exec(function(err , kundes){
        if(err) throw err



        res.render('verwalten/editkunde',{
            title : 'مدیریت کاربران ',
            kundes : kundes,
            JDate:JDate,
            checkIfTrue:checkIfTrue,

        });
        
    });
    
    

});



router.get('/regmenchen',function (req,res){
    res.render('verwalten/regMenchen');
});
router.post('/regmenchen', [
    check('name').not().isEmpty().escape().withMessage('نام را وارد کنید'),
    check('family').not().isEmpty().withMessage('نام خانوادگی  را وارد کنید'),
    check('mobile').isMobilePhone().withMessage('شماره همراه را صحیح وارد کنید'),
    check('mobile').isEmpty().withMessage('شماره همراه را وارد کنید'),
    check('email').not().isEmpty().withMessage('ایمیل   را وارد کنید'),
    check('email').isEmail().withMessage('ایمیل را بصورت صحیح وارد کنید'),
  ], function(req,res){
    //add new administrator  
        var  name     = req.body.name;
        var  family   = req.body.family;
        var  mobile   = req.body.mobile;
        var  email    = req.body.email;

        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            res.render('verwalten/regMenchen' , {
                errors:errors.array(),
                name:name,
                family:family,
                mobile:mobile,
                email:email,
            });
            return;
        }

        var newUser = User({
            name:name,
            family:family,
            mobile:mobile,
            email:email,
            passtmp:'123',
            acl: 1,
            status:true,
        })
        newUser.save(function(err,data){
            if(err) throw err;
            res.redirect('/verwalten/listmenchen');     
        });
});

router.get('/listmenchen',function (req,res){
    
    User.find({}).select('name family email acl _id').populate({
        path:  'kunde_id', 
        model: 'Kunde',
        select: 'kundename'
    }).exec(function(err , users){
        if(err) throw err



        res.render('verwalten/listMenchen',{
            title : 'مدیریت کاربران ',
            users : users,
            showAclLabel:showAclLabel,

        });
    });

    
});

router.get('/regmajorcsv',function (req,res){
    res.render('verwalten/regMajorCsv');
});

router.post('/regmajorcsv', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
   // next();
   //console.log(req.file);
   res.json({"filename": req.file.filename, "type": req.file.mimetype});

})



router.get('/regmajor',function (req,res){
    res.render('verwalten/regMajor');
});
router.post('/regmajor',[
    check('majorFarsi').not().isEmpty().escape().withMessage('نام رشته را وارد کنید'),
  ], function(req,res){
    var majortype    = req.body.majortype;
    var majorFarsi   = req.body.majorFarsi;
    var majorEng     = req.body.majorEng;
    var majorId      = req.body.majorId;
    
    var newMajor = Major({
        majortype:majortype,
        majorFarsi:majorFarsi,
        majorEng:majorEng,
        majorId:majorId,
    })
    newMajor.save(function(err,data){
        if(err) throw err;
        res.redirect('/verwalten/regMajor');     
    });
});


router.get('/listmajor/:id/view',function (req,res){
    Major.find({majortype:{$eq:req.params.id}}).select('_id majorFarsi majorEng majorId status').exec(function(err , majors){
        if(err) throw err
        
        res.render('verwalten/listmajor',{
            title : 'مدیریت کاربران ',
            majors : majors,



        });
    });
});



router.get('/profile/:id/view',function (req,res){
    User.findById(req.params.id ).select('name family email mobile last_login create_at acl status pic').populate({
        path:  'kunde_id', 
        model: 'Kunde',
        select: 'kundename'
    }).exec( function(err,data){
        //res.json(post);
        res.render('verwalten/profile',{
            data:data,
            showAclLabel:showAclLabel,
            JDate:JDate,
            showStatusLabale:showStatusLabale,
        });
    });
    
    
});



module.exports = router;