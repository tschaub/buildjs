var ASSETS = require("buildkit/assets");
var FILE = require("file");
var HANDLER = require("./handler");

var DB = require("google/appengine/ext/db");

var Article = DB.Model("Article", {
    title: new db.StringProperty({required: true}),
    summary: new db.TextProperty(), 
    content: new db.TextProperty({required: true}),
    created: new db.DateTimeProperty({autoNowAdd: true}),
    updated: new db.DateTimeProperty({autoNow: true}),
    categories: new db.StringListProperty()
});

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
                headers: {"Content-Type": "text/javascript"},
                body: [str]
            };
        } else {
            resp = this.responseForStatus(400, "project '" + path + "' not found");
        }
        return resp;
    }
});
