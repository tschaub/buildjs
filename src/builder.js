var MERGE = require("buildkit/merge");
var JSMIN = require("buildkit/jsmin");
var HANDLER = require("./handler");

// TODO: persist this
var projects = {
    "/geoext/0.6": true
};

exports.app = HANDLER.App({
    POST: function(env) {
        var path = env.PATH_INFO;
        if (projects[path]) {
            var request = this.getRequest(env);
            var body = request.body().decodeToString(request.contentCharset() || "utf-8");
            var config = JSON.decode(body);
            var str = JSMIN.jsmin(MERGE.concat({
                root: ["projects" + path],
                includes: config.includes || [],
                excludes: config.excludes || []
            }));
            resp = {
                status: 200,
                headers: {"Content-Type": "text/plain"},
                body: [str]
            };
        } else {
            resp = responseForStatus(400, "project '" + path + "' not found");
        }
        return resp;
    }
});
