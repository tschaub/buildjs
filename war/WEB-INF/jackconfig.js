var ContentLength = require("jack/contentlength").ContentLength;

exports.app = ContentLength(require("./src/app").app);

