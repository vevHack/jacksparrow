var jks = jks || {};
jks.rootPane = jks.rootPane || (function() {
    "use strict";

    function load(container, userDisplayData, triggerHandler) {
        return $.fetch.template("root-pane").done(function(template) {
            container.html(Mustache.render(template, userDisplayData))
                .on('click', '.trigger', triggerHandler);
        });
    }

    return {
        load: load
    };
}());

