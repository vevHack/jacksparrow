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

    function loaderAnimation() {
        return $('<div id="loader-tab-parent"/>').append(
            $('<div id="loader-tab"/>'));
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

    function attachWarnToFetchFailure() {
        /* Just to save some typing. XXX A real solution will handle
         * case specific retries */
        function wrap(actual) {
            return function() {
                return actual.apply(this, arguments).fail(warn);
            };
        }
        $.fetch.template = wrap($.fetch.template);
        $.fetch.js = wrap($.fetch.js);
        $.fetch.img = wrap($.fetch.img);
    }
    
    var nop = new Function("");

    function oneExecTrigger(actual) {
        var action = actual;
        return function (event) {
            if (action) {
                action.apply(this, arguments).always(function() {
                    action = actual;
                });
                action = false;
            }
            event.preventDefault();
        };
    }

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

    function notifyOnScrollToBottomFactory() {
        function nearBottomFactory(threshold) {
            var doc = $(document);
            var win = $(window);
            return function() {
                return (doc.height() - win.height() - win.scrollTop() 
                - threshold < 0);
            }
        }
        var nearBottom = nearBottomFactory(200), pending = true;
        var observers = [], enabled = [];

        function execObserver(key, observer) { 
            if (enabled[key]) {
                enabled[key] = false;
                observer().always(function() {
                    enabled[key] = true;
                });
            }
        }

        function notifyIfNearBottom() {
            if (pending && nearBottom()) {
                pending = false;
                $.each(observers, execObserver);
            } else {
                pending = true;
            }
        }

        $(window).scroll(notifyIfNearBottom);
        setInterval(notifyIfNearBottom, 1000);

        return function(observer) {
            enabled[observers.push(observer) - 1] = true;
        };
    }


    return {
          handleUnauthenticated: handleUnauthenticated
        , redirectToHome: redirectToHome
        , nop: nop
        , warn: warn
        , oneExecTrigger: oneExecTrigger
        , attachWarnToFetchFailure: attachWarnToFetchFailure
        , spinnerFactory: spinnerFactoryFactory("ajax-loader.gif")
        , loaderAnimation: loaderAnimation
        , notifyOnScrollToBottom: notifyOnScrollToBottomFactory(200)
    };

}());
