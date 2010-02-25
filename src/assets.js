var ASSETS = require("buildkit/assets");
var FILE = require("file");
var HANDLER = require("./handler");
var DB = require("google/appengine/ext/db");
var MEMCACHE = require("google/appengine/api/memcache");

var Asset = DB.Model("Asset", {
    json: new DB.TextProperty()
});

// TODO: persist this
var projects = {
    "/geoext/0.6": true
};

exports.app = HANDLER.App({
    GET: function(env) {
        var path = env.PATH_INFO;
        if (projects[path]) {
            var str = MEMCACHE.get(path);
            if (!str) {
                DB.runInTransaction(function() {
                    var asset = Asset.getByKeyName(path);
                    if (!asset) {
                        asset = new Asset({
                            keyName: path,
                            json: JSON.encode(ASSETS.compile(FILE.join("projects", path)))
                        });
                        asset.put();
                    }
                    str = asset.json;
                    MEMCACHE.set(path, str);
                });
            }
            var request = this.getRequest(env);
            var callback = request.GET("callback");
            if (callback) {
                str = callback + "(" + str + ")";
            }
            resp = {
                status: 200,
                headers: {"Content-Type": "text/javascript"},
                body: [str]
            };
        } else {
            resp = this.responseForStatus(400, "project '" + path + "' not found");
        }
        return resp;
    }
});
