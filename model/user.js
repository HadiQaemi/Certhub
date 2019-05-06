var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');



var UserSchema = mongoose.Schema({
    name        :   String,
    family      :   String,
    mobile      :   String,
    kunde_id    :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kunde' }],     //id of kunde table
    email       :   { type: String , require:true , unique:true},
    password    :   String,
    passtmp     :   String,
    create_at   :   Date,
    update_at   :   Date,
    last_login  :   { type: Date, default: Date.now },
    acl         :   {type:Number,  default: 4 },     //administrator 1 , Admin 2 , userAdmin 3 ,  userView 4
    useragent   :   mongoose.Schema.Types.ObjectId,     //id of useragent table
    status      :   {type:Boolean , default: 0 },    //active 1 | diactive 0
    login_fail  :   Number,
    pic         :   String,
    parent_user :   {type:Number,  default: 0 }, 
    isdelete    :   {type:Boolean , default: 0 }, // 1 is not delete 

});

UserSchema.pre('save',function(next){
    var currentDate = new Date();

    this.update_at = currentDate;

    if(!this.create_at)
        this.create_at = currentDate;

    next();    
    
});

UserSchema.pre('find',function(next){
    if(this.acl == 2){
        this.acl = "salam";
    }
    this.where({isdelete: false});
    next();    
    
});

var User = mongoose.model('User' , UserSchema);
module.exports = User;

module.exports.generatehash = function(password){
   return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

module.exports.validpass = function(password , hash){
    return bcrypt.compareSync(password , hash);
}