var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function preload() {
        loadShowDetailTrigger();
    }

    var showDetailTrigger;

    function loadShowDetailTrigger() {
        return $.when(
            $.fetch.img("arrow-light.png"),
            $.fetch.img("arrow-dark.png")
            ).done(function(light, dark) {
                if(typeof showDetailTrigger !== 'undefined') {
                    return;
                }

                showDetailTrigger = 
                    $('<div id="show-detail-trigger"/>')
                        .append(light)
                        .append(dark.hide())
                        .hover(function() {
                            light.toggle();
                            dark.toggle();
                        })
                        .on("click", function() {
                            showPostDetails($(this).parents(".post").data("id"));
                            event.preventDefault();
                        });
            });
    }

    function appendRelativeTime(now, data) {
        data.feed.forEach(function(post) {
            post.staleness = now - Date.parse(post.created_on);
        });
    }

    function updatePostWithUserDetails(postElement, user) {
        $('<a href="#"/>').appendTo(postElement).text(user.username)
            .on("click", function() {
                showUserDetails(user);
                event.preventDefault();
            });
    }

    function mouseenterPost(event) {
        showDetailTrigger.appendTo(
            $(event.currentTarget).toggleClass("current"));
    }

    function mouseleavePost(event) {
        $(event.currentTarget).toggleClass("current");
        showDetailTrigger.detach();
    }

    function showPostDetails(postId) {
        $("#detail").html(postId);
    }

    function showUserDetails(user) {
        $("#detail").html(user.toString());
    }

    var selfDiv;

    function load(container) {
        var deferred = $.Deferred();
        $.when(
            $.fetch.template("feed"),
            $.getJSON("/api/user/feed"),
            $.fetch.js("timestamper"),
            $.fetch.js("idMapper")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var data = arguments[1][0];
                var now = Date.parse(data.now);

                jks.timestamper.setReference(now);
                appendRelativeTime(now, data);

                var render = $(Mustache.render(template, data));
                render.find(".timestamp").each(jks.timestamper.update);
                render.find(".author").each(function() {
                    jks.idMapper.update.apply(this, arguments)
                        .done(updatePostWithUserDetails);
                });
                render.find(".show-detail").hide();
                container.append(
                    selfDiv = $('<div id="feed" />').append(render).hide());

                loadShowDetailTrigger()
                    .done(function() {
                        container.on("mouseenter", ".post", mouseenterPost);
                        container.on("mouseleave", ".post", mouseleavePost);
                    });

                deferred.resolve(selfDiv);
            })

        preload();

        return deferred.promise();
    }

    return {
        load: load,
    };
}());

