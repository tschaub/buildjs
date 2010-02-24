var MERGE = require("buildkit/merge");
var Handler = require("./handler").Handler;

// TODO: persist this
var projects = {
    "/geoext/0.6": true
};

var handler = new Handler({
    POST: function(env) {
        var path = env.PATH_INFO;
        if (projects[path]) {
            var request = this.getRequest(env);
            var body = request.body().decodeToString(request.contentCharset() || "utf-8");
            var config = JSON.decode(body);
            var str = MERGE.concat({
                root: ["projects" + path],
                includes: config.includes || [],
                excludes: config.excludes || []
            });
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

exports.app = function(env) {
    return handler.handle(env);
};
