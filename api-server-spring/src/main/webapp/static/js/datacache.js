var jks = jks || {};
jks.datacache = jks.datacache || (function() {
    "use strict";
    
    var cache = {user: {}, post: {}};
    /* because it plays havoc with cache invalidation 
     * it might be better to use etag based http caching 
     */ 
    var DISABLE_LOCAL = true; 

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

    function entitySetter(func, type) {
        return function(val) {
            return func(type, val.id, val);
        }
    }

    return ( (!DISABLE_LOCAL && supports_html5_storage()) ? {
        getUser: wrap(get5, "user"),
        setUser: entitySetter(set5, "user"),
        getPost: wrap(get5, "post"),
        setPost: entitySetter(set5, "post")
    } : {
        getUser: wrap(get, "user"),
        setUser: entitySetter(set, "user"),
        getPost: wrap(get, "post"),
        setPost: entitySetter(set, "post")
        , print: print /*XXX*/
        , hasUser: function(id) { /* XXX */
            return !!get("user", id);
        }
    });
}());

