(function($) {
    "use strict";

    if ($.mapIds) {
        return;
    }

    var cached = {};
    var fields = "username";

    $.fn.mapIds = function () {
        var deferred = $.Deferred();
        var id = this.data("id");
        if (id in cached) {
            deferred.resolveWith(this, [cached[id]]);
        } else {
            var that = this;
            $.getJSON("/api/user/details", { user: id,  field: fields })
                .fail(jks.common.warn)
                .done(function(data) {
                    deferred.resolveWith(that, [cached[id] = data.user]);
                });
        }
        return deferred.promise();
    };

}(jQuery));
