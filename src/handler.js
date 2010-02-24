var JACK = require("jack");
var responseForStatus = require("jack/utils").responseForStatus;

var Handler = function(methods) {
    this.methods = methods;    
};
Handler.prototype = {
    responseForStatus: responseForStatus,
    handle: function(env) {
        var name = env.REQUEST_METHOD;
        var resp;
        if (name in this.methods) {
            resp = this.methods[name].apply(this, [env]);
        } else {
            resp = this.responseForStatus(405);
        }
        return resp;
    },
    getRequest: function(env) {
        return new JACK.Request(env);
    }
};

exports.Handler = Handler;
