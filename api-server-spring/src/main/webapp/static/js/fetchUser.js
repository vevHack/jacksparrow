var jks = jks || {};
jks.fetchUser = jks.fetchUser || (function() {
    "use strict";

    var fields = ["username", "email", "name"];

    function uniqueNum(arr) {
        return Object.keys(arr.reduce(
            function(o, x) {o[x]=1; return o;}, {})).map(Number);
    }

    return function(ids) {

        if (!$.isArray(ids)) {
            ids = [ids];
        }
        ids = uniqueNum(ids);
        ids = ids.filter(function(id) { return !jks.datacache.hasUser(id) });

        if (ids.length === 0) {
            return $.Deferred().resolve();
        }

        return $.getJSON("/api/user/details", 
                    $.param({ user: ids,  field: fields }, true))
                .fail(jks.common.warn)
                .done(function(data) { 
                    data.users.forEach(function(user) {
                        jks.datacache.setUser(user.id, user);
                    });
                });
    };
}());
