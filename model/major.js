var mongoose = require('mongoose');



var MajorSchema = mongoose.Schema({
    majortype   :   Number,    
    majorFarsi  :   String,
    majorEng    :   String,
    majorId     :   { type: Number  , unique:true},
    create_at   :   Date,
    update_at   :   Date,
    status      :   {type:Boolean , default: 0 },  //active 1 | diactive 0
    isdelete    :   {type:Boolean , default: 0 }, // 0 is not delete 

});

MajorSchema.pre('save',function(next){
    var currentDate = new Date();

    this.update_at = currentDate;

    if(!this.create_at)
        this.create_at = currentDate;

    next();    
    
});

var Major = mongoose.model('Major' , MajorSchema);
module.exports = Major;

