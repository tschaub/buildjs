exports.httpConfig = {
    staticDir: "static"
};

exports.urls = [
    [(/^\/assets/), require("./assets").app],
    [(/^\/builder/), require("./builder").app],
    ["/", function(env) {
        return {
            status: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: [
                "JavaScript build tool hosted by <a href='http://opengeo.org/'>OpenGeo</a>."
            ]
        }
    }]
];

exports.middleware = [
    require("ringo/middleware/gzip").middleware,        
    require("ringo/middleware/etag").middleware,
    require("ringo/middleware/error").middleware,
    require("ringo/middleware/notfound").middleware
];

exports.app = require("ringo/webapp").handleRequest;

exports.macros = [
    require("ringo/skin/macros"),
    require("ringo/skin/filters"),
];

exports.charset = "UTF-8";
exports.contentType = "text/plain";
