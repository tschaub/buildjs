var ASSETS = require("buildkit/assets");
var FS = require("fs");
var DB = require("google/appengine/ext/db");
var MEMCACHE = require("google/appengine/api/memcache");
var MODELS = require("./models");
var {Request} = require("ringo/webapp/request");
var responseForStatus = require("./util").responseForStatus;

// TODO: derive and persist this
var projects = {
    "/geoext/0.6": true,
    "/geoext/0.7": true,
    "/geoext/1.0": true
};

exports.getAssets = function(path) {
    var str = MEMCACHE.get(path);
    if (!str) {
        DB.runInTransaction(function() {
            var asset = MODELS.Asset.getByKeyName(path);
            if (!asset) {
                asset = new MODELS.Asset({
                    keyName: path,
                    json: JSON.stringify(ASSETS.compile(FS.join("projects", path)))
                });
                asset.put();
            }
            str = asset.json;
            MEMCACHE.set(path, str);
        });
    }
    return str;
};

exports.app = function(env, lib, version) {
    var resp;
    var request = new Request(env);
    if (request.method !== "GET") {
        resp = responseForStatus(405);
    } else {
        var path = request.pathInfo;
        if (projects[path]) {
            var str = exports.getAssets(path);
            var callback = request.queryParams["callback"];
            if (callback) {
                str = callback + "(" + str + ")";
            }
            resp = {
                status: 200,
                headers: {"Content-Type": "text/javascript"},
                body: [str]
            };
        } else {
            resp = responseForStatus(404, "project '" + path + "' not found");
        }
    }
    return resp;
};
