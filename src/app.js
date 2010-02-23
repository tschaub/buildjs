exports.app = function(env) {
    return {
        status: 200,
        headers: {"Content-Type": "text/html"},
        body: ["gxbuild"]
    };
};
