var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    var arrowLight, arrowDark; /* XXX don't need dark?? */
    function loadArrowImages() {
        return $.when(
            $.fetch.img("arrow-dark.png"),
            $.fetch.img("arrow-light.png")
            ).done(function(dark, light) {
                if(typeof arrowLight !== 'undefined') {
                    return;
                }
                arrowLight = light;
                arrowDark = dark;
            });
    }

    function preload() {
        loadArrowImages();
    }

    function appendRelativeTime(now, data) {
        data.feed.forEach(function(post) {
            post.staleness = now - Date.parse(post.created_on);
        });
    }

    function updatePostWithUserDetails(user) {
        var details;

        $("<a />").appendTo(this)
            .attr("href", ["", user.username].join("/"))
            .text(user.username);

        details = this.parents().find(".detail a");
        details.attr("href", 
            ["", user.username, details.attr("href")].join("/"));
    }

    function mouseenterPost(event) {
        var postDiv = $(event.currentTarget);
        postDiv.toggleClass("current")
            .children(".detail").show().children("a").append(arrowLight);
    }

    function mouseleavePost(event) {
        var postDiv = $(event.currentTarget);
        postDiv.toggleClass("current").children(".detail")
            .hide().children("a").children("img").remove();
    }

    var selfDiv;

    function load(container) {
        var deferred = $.Deferred();
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

                $.updateTimestamp.setReference(now);
                appendRelativeTime(now, data);

                var render = $(Mustache.render(template, data));
                render.find(".timestamp").updateTimestamp();
                render.find(".author").mapIds().done(updatePostWithUserDetails);
                render.find(".detail").hide();
                container.append(
                    selfDiv = $('<div id="feed" />').append(render));

                loadArrowImages()
                    .done(function() {
                        container.on("mouseenter", ".post", mouseenterPost);
                        container.on("mouseleave", ".post", mouseleavePost);
                    });

                deferred.resolve();
            })

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

