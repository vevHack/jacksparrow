var jks = jks || {};
jks.create = jks.create || (function() {
    "use strict";

    function preload() {
    }

    var selfDiv;

    function load(container) {
        var deferred = $.Deferred();
        $.when(
            $.fetch.template("create")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0];
                var render = $(Mustache.render(template));

                container.append(
                    selfDiv = $('<div id="create" />').append(render).hide());

                deferred.resolve(selfDiv);
            });

        preload();
        return deferred.promise();
    }

    return {
        load: load,
    };
}());

