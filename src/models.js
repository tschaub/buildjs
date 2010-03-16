var DB = require("google/appengine/ext/db");

// simple json representation of a library's assets
var Asset = DB.Model("Asset", {
    json: new DB.TextProperty()
});

// minified source file, keyName: <project>/<version>/<path>
var Source = DB.Model("Source", {
    text: new DB.TextProperty()
});

// license text, keyName: <project>/<version>/<path>
var License = DB.Model("License", {
    text: new DB.TextProperty()
});

exports.Asset = Asset;
exports.Source = Source;
exports.License = License;
