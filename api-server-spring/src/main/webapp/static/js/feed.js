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
                            showPostDetails(jks.datacache.getPost(
                                $(this).parent().data("id")));
                            event.preventDefault();
                        });
            });
    }


    var selfDiv;
    var lastUpdated, fetchedTill;


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


    function renderFeeds(template, data) {
        lastUpdated = data.now;
        fetchedTill = data.from;

        if (data.feed.length === 0) {
            $("#more-trigger").hide();
            return $("<div />"); /*XXX*/
        }

        var render = $(Mustache.render(template, data));

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
        jks.timestamper.setReference(Date.parse(lastUpdated));
        selfDiv.find(".post").each(jks.timestamper.update);
    }


    function load(container) {
        var deferred = $.Deferred();
        $.when(
              $.fetch.template("feed")
            , $.getJSON("/api/user/feed")
            , $.fetch.js("timestamper")
            , $.fetch.js("fetchUser")
            , $.fetch.js("datacache")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var data = arguments[1][0];

                container.append(
                    selfDiv = $('<div id="feed" />')
                        .append(renderFeeds(template, data))
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

                deferred.resolve(selfDiv);
            })

        preload();

        return deferred.promise();
    }


    function update(event) {
        event.preventDefault();
    }

    function more(event) {
        $.when(
              $.fetch.template("feed")
            , $.getJSON("/api/user/feed", {upto: fetchedTill})
        )
            .fail(jks.common.warn)
            .done(function() {
                selfDiv.append(renderFeeds(arguments[0][0], arguments[1][0]));
                updateTimestamps();
            });
        event.preventDefault();
    }


    return {
        load: load,
    };
}());

