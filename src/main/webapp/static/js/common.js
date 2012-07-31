/* XXX this file needs a better name */

var jks = jks || {};
jks.common = jks.common || {};

(function(exports) {

    exports.throwTodo = function() {
        throw {
            name: "todoException",
            message: "XXX"
        };
    };

    exports.warn = function(img) {
        console.warn(img);
    };

}(jks.common));
