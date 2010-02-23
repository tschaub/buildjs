var FILE = require("file");
var JACK = require("jack");
var ASSETS = require("buildkit/assets");
var MERGE = require("buildkit/merge");

var responseForStatus = require("jack/utils").responseForStatus;

// TODO: remove when jack is closer to origins
require("./monkey");

var projects = {
    "/geoext/0.6": true
};

exports.app = JACK.URLMap({
    
    "/assets": function(env) {
        var resp;
        if (env.REQUEST_METHOD === "GET") {
            var path = env.PATH_INFO;
            if (projects[path]) {
                var request = new JACK.Request(env);
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
                resp = responseForStatus(400, "project '" + path + "' not found");
            }
        } else {
            resp = responseForStatus(405);
        }
        return resp;
    },
    
    "/builder": function(env) {
        var resp;
        if (env.REQUEST_METHOD === "POST") {
            var path = env.PATH_INFO;
            if (projects[path]) {
                var request = new JACK.Request(env);
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
        } else {
            resp = responseForStatus(405);
        }
        return resp;
    }
    
});
