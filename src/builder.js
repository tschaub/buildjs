var MERGE = require("buildkit/merge");
var JSMIN = require("buildkit/jsmin");
var HANDLER = require("./handler");
var FILE = require("file");
var MODELS = require("./models");
var DB = require("google/appengine/ext/db");
var getAssets = require("./assets").getAssets;

// TODO: persist this
var projects = {
    "/geoext/0.6": {
        license: "license.txt"
    }
};

var getSource = function(path) {
    var str;
    DB.runInTransaction(function() {
        var source = MODELS.Source.getByKeyName(path);
        if (!source) {
            source = new MODELS.Source({
                keyName: path,
                text: JSMIN.jsmin(FILE.read(FILE.join("projects", path)))
            });
            source.put();
        }
        str = source.text;
    });
    return str;
};

var getLicense = function(path) {
    var str;
    DB.runInTransaction(function() {
        var license = MODELS.License.getByKeyName(path);
        if (!license) {
            license = new MODELS.License({
                keyName: path,
                text: FILE.read(FILE.join("projects", path))
            });
            license.put();
        }
        str = license.text;
    });
    return str;
};

exports.app = HANDLER.App({
    POST: function(env) {
        var path = env.PATH_INFO;
        if (projects[path]) {
            var request = this.getRequest(env);
            var type = request.contentType();
            var config;
            if (type.match(/form/)) {
                config = request.POST();
                var include = config.include;
                if (include && !(include instanceof Array)) {
                    config.include = [include];
                }
                var exclude = config.exclude;
                if (exclude && !(exclude instanceof Array)) {
                    config.exclude = [exclude];
                }
            } else {
                var body = request.body().decodeToString(request.contentCharset() || "utf-8");
                config = JSON.decode(body);
            }
            var assets = JSON.decode(getAssets(path));
            var order = MERGE._getOrderedAssets(
                [], config.include || [], config.exclude || [], [], assets
            );

            var str = order.map(function(srcPath) {
                return getSource(FILE.join(path, srcPath));
            }).join("");

            var license = projects[path].license;
            if (license) {
                str = getLicense(FILE.join(path, license)) + str;
            }
            resp = {
                status: 200,
                headers: {
                    "Content-Type": "application/x-javascript",
                    "Content-Disposition": "attachment; filename=GeoExt.js"
                },
                body: [str]
            };
        } else {
            resp = responseForStatus(400, "project '" + path + "' not found");
        }
        return resp;
    }
});
