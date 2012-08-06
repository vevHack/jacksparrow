var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function appendRelativeTime(now, data) {
        data.feed.forEach(function(post) {
            post.staleness = now - Date.parse(post.created_on);
        });
    }

    function load(container) {
        $.when(
            $.fetch.template("feed"),
            $.getJSON("/api/user/feed"),
            $.fetch.js("timestamp"),
            $.fetch.js("idMapper")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var data = arguments[1][0];
                var now = Date.parse(data.now);

                $.timestamp.setReference(now);
                appendRelativeTime(now, data);

                var render = $(Mustache.render(template, data));
                render.find(".timestamp").updateTS();
                render.find(".author").mapIds().done(function(user) {
                    console.log(arguments);
                    $("<a />").appendTo(this)
                        .attr("href", ["", user.username].join("/"))
                        .text(user.username);
                });
                container.html(render);
            });
    }

    return {
        load: load
    };
}());

