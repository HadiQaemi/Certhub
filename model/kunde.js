var mongoose = require('mongoose');



var KundeSchema = mongoose.Schema({
    type        :   Boolean,    // 0 is uni & 1 is academy
    kundename   :   String,
    phone       :   String,
    address     :   String,
    description :   String,
    canbeexpired:   {type:Boolean , default: 0 }, // not be expire
    startTime   :   String,
    endTime     :   String,
    ipRestrict  :   {type:Boolean , default: 0 }, // not be Restriction   
    ipRange     :   String,  
    timeRestrict:   {type:Boolean , default: 0 }, // not be Restriction
    timeRange   :   String,  
    userId      :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    userCreator :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    create_at   :   Date,
    update_at   :   Date,
    status      :   {type:Boolean , default: 0 },  //active 1 | diactive 0
    pic         :   String,
    isdelete    :   {type:Boolean , default: 0 }, // 0 is not delete 

});

KundeSchema.pre('save',function(next){
    var currentDate = new Date();

    this.update_at = currentDate;

    if(!this.create_at)
        this.create_at = currentDate;

    next();    
    
});


var Kunde = mongoose.model('Kunde' , KundeSchema);
module.exports = Kunde;

