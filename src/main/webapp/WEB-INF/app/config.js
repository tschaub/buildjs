exports.httpConfig = {
    staticDir: "static"
};

exports.urls = [
    [(/^\/assets/), require("./assets").app],
    [(/^\/builder/), require("./builder").app]
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
