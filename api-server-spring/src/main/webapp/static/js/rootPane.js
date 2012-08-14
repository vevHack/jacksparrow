var jks = jks || {};
jks.rootPane = jks.rootPane || (function() {
    "use strict";

    function load(container, user, triggerHandler, options) {
        return $.when(
              $.fetch.template("rootPane")
            , $.getJSON("/api/user/stats", {user: user.id})
            ).done(function() {
                var template = arguments[0][0];

                user.stats = arguments[1][0].stats;
                if (options.statsNoUpdate) { 
                    user.stats.DISABLE = "anyString"; 
                }
                user.stats.showFeed = options.showFeed;

                container.html($(Mustache.render(template, user)))
                    .on('click', '.trigger', triggerHandler);
            });
    }

    return {
        load: load
    };
}());

