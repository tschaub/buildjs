// String
// ======
 
String.prototype.squeeze = function() {
    var set = arguments.length > 0 ? "["+Array.prototype.join.call(arguments, '')+"]" : ".|\\n",
        regex = new RegExp("("+set+")\\1+", "g");
    return this.replace(regex, "$1");
};
 
String.prototype.chomp = function(separator) {
    var extra = separator ? separator + "|" : "";
    return this.replace(new RegExp("("+extra+"\\r|\\n|\\r\\n)*$"), "");
};
 
// Check if the string starts with the given prefix string.
String.prototype.begins = function(str) {
    return this.indexOf(str) === 0;
};
 
// Check if the string ends with the given postfix string.
String.prototype.ends = function(str) {
    var offset = this.length - str.length;
    return offset >= 0 && this.lastIndexOf(str) === offset;
};

//Trim the string, left.
var trimBeginExpression = /^\s\s*/g;
String.prototype.trimBegin = function() {
    return this.replace(trimBeginExpression, "");
};
 
// Trim the string, right.
var trimEndExpression = /\s\s*$/g;
String.prototype.trimEnd = function() {
    return this.replace(trimEndExpression, "");
};
 
String.prototype.trim = function() {
    return this.replace(trimBeginExpression, "").replace(trimEndExpression, "");
};
