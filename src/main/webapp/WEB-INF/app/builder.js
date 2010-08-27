var MERGE = require("buildkit/merge");
var JSMIN = require("buildkit/jsmin");
var FS = require("fs");
var MODELS = require("./models");
var DB = require("google/appengine/ext/db");
var getAssets = require("./assets").getAssets;
var {Request} = require("ringo/webapp/request");
var responseForStatus = require("./util").responseForStatus;

// TODO: derive and persist this
var projects = {
    "/geoext/0.6": {
        license: "license.txt"
    },
    "/geoext/0.7": {
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
                text: JSMIN.jsmin(FS.read(FS.join("projects", path)))
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
                text: FS.read(FS.join("projects", path))
            });
            license.put();
        }
        str = license.text;
    });
    return str;
};

exports.app = function(env, lib, version) {
    var resp;
    var request = new Request(env);
    if (request.method !== "POST") {
        resp = responseForStatus(405);
    } else {
        var path = request.pathInfo;
        if (projects[path]) {
            var type = request.contentType;
            var config;
            if (type.match(/form/)) {
                config = request.postParams;
                var include = config.include;
                if (include && !(include instanceof Array)) {
                    config.include = [include];
                }
                var exclude = config.exclude;
                if (exclude && !(exclude instanceof Array)) {
                    config.exclude = [exclude];
                }
            } else {
                var body = request.body().decodeToString(request.charset || "utf-8");
                config = JSON.parse(body);
            }
            var assets = JSON.parse(getAssets(path));
            var order = MERGE._getOrderedAssets(
                [], config.include || [], config.exclude || [], [], assets
            );

            var str = order.map(function(srcPath) {
                return getSource(FS.join(path, srcPath));
            }).join("");

            var license = projects[path].license;
            if (license) {
                str = getLicense(FS.join(path, license)) + str;
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
    }
    return resp;
};
