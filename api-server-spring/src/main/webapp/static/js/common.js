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
        if (arguments[2] instanceof SyntaxError) {
            console.warn(arguments[2].message);
        }
        alert("Aww. Something went wrong! \n" +
            "Jack Sparrow will not be able to fly properly");
        try {
            throw new Error();
        } catch (e) {
            console.warn(e.stack);
        }
    }
    
    var nop = new Function("");

    function redirectToHome() {
        window.location.replace("/");
    }

    function handleUnauthenticated(jqXHR) {
        /* http://stackoverflow.com/a/10593045/141220 */
        function delete_cookie(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        if (jqXHR.status === 401 && /API\-ACT/.test(document.cookie)) {
            delete_cookie("API-ACT");
            window.location.replace("/");
        }
    }

    return {
        handleUnauthenticated: handleUnauthenticated,
        redirectToHome: redirectToHome,
        nop: nop,
        throwTodo: throwTodo,
        warn: warn,
        spinnerFactory: spinnerFactoryFactory("ajax-loader.gif")
    };

}());
