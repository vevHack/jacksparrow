var jks = jks || {};
jks.editProfile = jks.editProfile || (function() {
    "use strict";

    var root, userId;

    function fetch() {
        var dfd = $.Deferred();
        $.fetch.template("editProfile").done(function(template) {
            root = $(Mustache.render(template, jks.datacache.getUser(userId)));
            dfd.resolve(root);
        });
        return dfd.promise();
    }

    return function(userId_) {
        userId = userId_;
        return { fetch: fetch };
    };
}());

