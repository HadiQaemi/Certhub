var mongoose = require('mongoose');

var agentSchema = mongoose.Schema({
    isMobile    : Boolean,
    isTablet    : Boolean,  
    isiPhone    : Boolean,
    isAndroid   : Boolean,
    isBlackberry: Boolean,
    isOpera     : Boolean,
    isIE        : Boolean,
    isEdge      : Boolean,
    isSafari    : Boolean,
    isFirefox   : Boolean,
    isChrome    : Boolean,
    isWebkit    : Boolean,
    isMac       : Boolean,
    isChromeOS  : Boolean,
    isSamsung   : Boolean,
    isRaspberry : Boolean,
    isBot       : Boolean,
    isCurl      : Boolean,
    browser     : String,
    version     :String,
    os          :String,
    platform    :String,
    source      :String,
    ip          :String,
    create_at   :{ type: Date, default: Date.now },
});

var agent = mongoose.model('agent' , agentSchema);
module.exports = agent;