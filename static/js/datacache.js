var jks = jks || {};
jks.datacache = jks.datacache || (function() {
    "use strict";
    
    var cache = {user: {}, post: {}};
    /* because it plays havoc with cache invalidation 
     * it might be better to use etag based http caching 
     */ 
    var DISABLE_LOCAL = true; 

    /* XXX hacky */
    var setUserListener;

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

    function doSetUser(user) {
        if (setUserListener) {
            setUserListener(user);
        }
        return set("user", user.id, user);
    }

    function entitySetter(func, type) {
        return function(val) {
            if (setUserListener && type.localeCompare("user") === 0) {
                setUserListener(val);
            }
            return func(type, val.id, val);
        }
    }

/* XXX this file requires vaccuming  */
    return ( (!DISABLE_LOCAL && supports_html5_storage()) ? {
        getUser: wrap(get5, "user"),
        setUser: entitySetter(set5, "user"),
        getPost: wrap(get5, "post"),
        setPost: entitySetter(set5, "post")
    } : {
        getUser: wrap(get, "user"),
        setUser: doSetUser,
        getPost: wrap(get, "post"),
        setPost: entitySetter(set, "post")
        , print: print /*XXX*/
        , hasUser: function(id) { /* XXX */
            return !!get("user", id);
        }
        , get: get
        , addSetUserListener: function(listener) {
            setUserListener = listener;
        }
    });
}());

