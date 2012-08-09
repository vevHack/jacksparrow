var jks = jks || {};
jks.datacache = jks.datacache || (function() {
    "use strict";
    
    var cache = {user: {}, post: {}};

    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function get(type, key) {
        return cache[type][key];
    }
    
    function get5(type, key) {
        var o = get(type, key);
        if (typeof o === "undefined") {
            o = localStorage[[type, key].join(".")];
            if (typeof o === "string") {
                o = JSON.parse(o);
                set(type, key, o);
            }
        }
        return o;
    }

    function set(type, key, value) {
        cache[type][key] = value;
    }

    function set5(type, key, value) {
        cache[type][key] = value;
        localStorage[[type, key].join(".")] = JSON.stringify(value);
    }

    function print() {
        console.log(cache);
        console.log(localStorage);
    }

    function wrap(func, firstArg) {
        return function() {
            var args = Array.prototype.slice.apply(arguments);
            args.unshift(firstArg);
            var o = func.apply(this, args);
            if (!o) {
                jks.common.warn();
            }
            return o;
        };
    }

    return ( supports_html5_storage() ? {
        getUser: wrap(get5, "user"),
        setUser: set5.bind(this, "user"),
        getPost: wrap(get5, "post"),
        setPost: set5.bind(this, "post")
        , print: print
    } : {
        getUser: wrap(get, "user"),
        setUser: set.bind(this, "user"),
        getPost: wrap(get, "post"),
        setPost: set.bind(this, "post")
        , print: print
    });
}());

