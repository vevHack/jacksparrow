var jks = jks || {};
jks.rootPaneSelf = jks.rootPaneSelf || (function() {
    "use strict";

    function preload() {
    }

    function load(container, triggerHandler) {
        $.when(
            $.fetch.template("root-pane-self")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0];
                container
                    .html(Mustache.render(template))
                    .on('click', '.trigger', triggerHandler);
            });

        preload();
    }

    return {
        load: load
    };
}());

