var MERGE = require("buildkit/merge");
var JSMIN = require("buildkit/jsmin");
var HANDLER = require("./handler");
var FILE = require("file");

// TODO: persist this
var projects = {
    "/geoext/0.6": {
        license: "license.txt"
    }
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
            var root = FILE.join("projects", path);
            var str = JSMIN.jsmin(MERGE.concat({
                root: ["projects" + path],
                include: config.include || [],
                exclude: config.exclude || []
            }));
            var license = projects[path].license;
            if (license) {
                str = FILE.read(FILE.join(root, license)) + str;
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
