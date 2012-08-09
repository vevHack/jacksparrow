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

    return ( supports_html5_storage() ? {
        getUser: get5.bind(this, "user"),
        setUser: set5.bind(this, "user"),
        getPost: get5.bind(this, "post"),
        setPost: set5.bind(this, "post")
        , print: print
    } : {
        getUser: get.bind(this, "user"),
        setUser: set.bind(this, "user"),
        getPost: get.bind(this, "post"),
        setPost: set.bind(this, "post")
        , print: print
    });
}());

