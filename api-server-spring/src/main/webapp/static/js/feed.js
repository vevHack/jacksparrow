var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

/*XXX
    function preload() {
        $.fetch.template("feed")
    }
    */

    function appendRelativeTime(now, data) {
        data.feed.forEach(function(post) {
            post.staleness = now - Date.parse(post.created_on);
        });
    }

    function load(container) {
        $.when(
            $.fetch.template("feed"),
            $.getJSON("/api/user/feed"),
            $.fetch.js("timestamp")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var data = arguments[1][0];
                var now = Date.parse(data.now);
                appendRelativeTime(now, data);
                var render = $(Mustache.render(template, data));
                $.timestamp.setReference(now);
                render.find(".timestamp").updateTS();
                container.html(render);
                //render.find(".timestamp").timestamp.update();
                //container.html(Mustache.render(template, data));
            });
    }

    return {
        load: load
    };
}());

