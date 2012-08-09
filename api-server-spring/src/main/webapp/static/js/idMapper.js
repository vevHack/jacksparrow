var jks = jks || {};
jks.idMapper = jks.idMapper || (function() {
    "use strict";

    var cached = {};
    var fields = "username";

    function update(idx, element) {
        element = $(element);
        var deferred = $.Deferred();
        var id = element.data("id");

        function resolve() {
            deferred.resolveWith(this, [element, cached[id]]);
        }

        if (id in cached) {
            resolve();
        } else {
            $.getJSON("/api/user/details", { user: id,  field: fields })
                .fail(jks.common.warn)
                .done(function(data) {
                    cached[id] = data.user;
                    resolve();
                });
        }
        return deferred.promise();
    };

    return {
        update: update
    };
}());
