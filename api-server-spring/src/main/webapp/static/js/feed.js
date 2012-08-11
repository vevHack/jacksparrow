var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

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
                            showPostDetails(jks.datacache.getPost(
                                $(this).parent().data("id")));
                            event.preventDefault();
                        });
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


    function showPostDetails(post) {
        $("#detail").html(JSON.stringify(post));
    }

    function showUserDetails(user) {
        $("#detail").html(JSON.stringify(user));
    }


    var selfDiv, feedTemplate;
    var serverTimestamp, newestTimestamp, oldestTimestamp;

    function updateSyncStatus(data) {
        if (typeof newestTimestamp === "undefined") {
            newestTimestamp = data.newest;
            oldestTimestamp = data.oldest;
        } else {
            if (newestTimestamp.localeCompare(data.newest) < 0) {
                newestTimestamp = data.newest;
            }
            if (oldestTimestamp.localeCompare(data.oldest) > 0) {
                oldestTimestamp = data.oldest;
            }
        }
    }


    function renderFeeds(template, data) {
        var render = $(Mustache.render(template, data));

        serverTimestamp = data.now;
        updateSyncStatus(data);

        jks.fetchUser(data.feed.map(function(post) { return post.user.id }))
            .done(function() {
                render.find(".author").each(updatePostWithUserDetails);
            });

        data.feed.forEach(function(post) {
            jks.datacache.setPost(post.id, post);
        });

        return render;
    }

    function updatePostWithUserDetails(idx, authorSpan) {
        authorSpan = $(authorSpan);
        var user = jks.datacache.getUser(authorSpan.data("id"));
        $('<a href="#"/>').appendTo(authorSpan)
            .text(user.name || user.username)
            .on("click", function() {
                showUserDetails(user);
                event.preventDefault();
            });
    }

    function updateTimestamps() {
        jks.timestamper.setReference(Date.parse(serverTimestamp));
        selfDiv.find(".post").each(jks.timestamper.update);
    }


    function load(container) {
        return $.when(
              $.fetch.template("feed")
            , $.getJSON("/api/user/feed")
            , $.fetch.js("timestamper")
            , $.fetch.js("fetchUser")
            , $.fetch.js("datacache")
        ).done(function() {
            feedTemplate = arguments[0][0];
            var data = arguments[1][0];

            container.append(
                selfDiv = $('<div id="feed" />')
                .append(renderFeeds(feedTemplate, data))
                .hide());

                updateTimestamps();

                loadShowDetailTrigger()
                .done(function() {
                    container.on("mouseenter", ".post", mouseenterPost);
                    container.on("mouseleave", ".post", mouseleavePost);
                });

                /* XXX */
                $("#update-trigger").click(update);
                $("#more-trigger").click(more);
        });
    }


    function update(event) {
        $.getJSON("/api/user/feed", {newerThan: newestTimestamp})
            .fail(jks.common.warn)
            .done(function(data) {
                if (data.feed.length !== 0) {
                    selfDiv.prepend(renderFeeds(feedTemplate, data));
                    updateTimestamps();
                }
            });
        event.preventDefault();
    }

    function more(event) {
        $.getJSON("/api/user/feed", {olderThan: oldestTimestamp})
            .fail(jks.common.warn)
            .done(function(data) {
                if (data.feed.length !== 0) {
                    selfDiv.append(renderFeeds(feedTemplate, data));
                    updateTimestamps();
                } else {
                    $("#more-trigger").hide(); /*XXX*/
                }
            });
        event.preventDefault();
    }


    return {
        load: load,
    };
}());

