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

        return $.when.apply(this, ids.map(function(id) {
            if (!jks.datacache.hasUser(id)) {
                var params = $.param({ user: id,  field: fields }, true);
                return $.getJSON("/api/user/details", params)
                    .done(function(data) { 
                        jks.datacache.setUser(id, data.user);
                    });
            }
        }))
            .fail(jks.common.warn);
    };
}());
