var jks = jks || {};
jks.idMapper = jks.idMapper || (function() {
    "use strict";

    var cached = {};
    var fields = "username";

    function update(idx, element) {
        element = $(element);
        var deferred = $.Deferred();
        var id = element.data("id");
        if (id in cached) {
            deferred.resolveWith(element, [cached[id]]);
        } else {
            $.getJSON("/api/user/details", { user: id,  field: fields })
                .fail(jks.common.warn)
                .done(function(data) {
                    deferred.resolveWith(element, [cached[id] = data.user]);
                });
        }
        return deferred.promise();
    };

    return {
        update: update
    };
}());
