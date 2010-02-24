var ASSETS = require("buildkit/assets");
var FILE = require("file");
var HANDLER = require("./handler");

// TODO: persist this
var projects = {
    "/geoext/0.6": true
};

exports.app = HANDLER.App({
    GET: function(env) {
        var path = env.PATH_INFO;
        if (projects[path]) {
            var request = this.getRequest(env);
            var callback = request.GET("callback");
            var assets = ASSETS.compile(FILE.join("projects", path));
            var str = JSON.encode(assets);
            if (callback) {
                str = callback + "(" + str + ")";
            }
            resp = {
                status: 200,
                headers: {"Content-Type": "text/plain"},
                body: [str]
            };
        } else {
            resp = this.responseForStatus(400, "project '" + path + "' not found");
        }
        return resp;
    }
});
