var jks = jks || {};
jks.rootPane = jks.rootPane || (function() {
    "use strict";

    function load(container, userDisplayData, triggerHandler) {
        return $.when(
              $.fetch.template("rootPane")
            , $.getJSON("/api/user/stats", {user: userDisplayData.id})
            ).done(function() {
                var template = arguments[0][0];
                userDisplayData.stats = arguments[1][0].stats;
                container.html(Mustache.render(template, userDisplayData))
                    .on('click', '.trigger', triggerHandler);
            });
    }

    return {
        load: load
    };
}());

