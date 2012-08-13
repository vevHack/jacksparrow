var jks = jks || {};
jks.rootPane = jks.rootPane || (function() {
    "use strict";

    function load(container, user, triggerHandler, template, hideFeed) {
        return $.when(
              $.fetch.template(template)
            , $.getJSON("/api/user/stats", {user: user.id})
            ).done(function() {
                var template = arguments[0][0];
                user.stats = arguments[1][0].stats;
                var render = $(Mustache.render(template, user));
                if (hideFeed) {
                    render.find("#feed-trigger").hide();
                }
                container.html(render)
                    .on('click', '.trigger', triggerHandler);
            });
    }

    return {
        load: load
    };
}());

