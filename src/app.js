var FILE = require("file");
var JACK = require("jack");

// TODO: remove when jack is closer to origins
require("./monkey");

exports.app = JACK.URLMap({
    "/assets": require("./assets").app,
    "/builder": require("./builder").app
});
