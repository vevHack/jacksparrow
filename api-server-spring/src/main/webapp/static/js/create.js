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
                    selfDiv = $('<div id="create" />').append(render));

                deferred.resolve();
            });

        preload();
        return deferred.promise();
    }

    function toggle() {
        selfDiv.slideToggle("slow");
    }

    return {
        load: load,
        toggle: toggle
    };
}());

