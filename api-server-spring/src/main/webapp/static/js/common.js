/* XXX this file needs a better name */

var jks = jks || {};
jks.common = jks.common || (function() {
    "use strict";

    function spinnerFactoryFactory(src) {
        var baseImg = $("<img />");
        var pending = [];

        $.fetch.img(src)
            .done(function(img) {
                baseImg = img;
                pending.forEach(function(img) {
                    img.replaceWith(baseImg.clone());
                });
            })
            .fail(warn)
            .always(function() {pending = undefined});
        
        return function() {
            var img = baseImg.clone();
            if (typeof pending !== "undefined") {
                pending.push(img);
            }
            return img;
        };
    }

    function throwTodo() {
        throw {
            name: "todoException",
            message: "XXX"
        };
    }

    function warn() {
        console.warn(arguments);
    }
    
    var nop = new Function("");

    return {
        nop: nop,
        throwTodo: throwTodo,
        warn: warn,
        spinnerFactory: spinnerFactoryFactory("ajax-loader.gif")
    };

}());
