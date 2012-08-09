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

    function updateTimestamps() {
        selfDiv.find(".post").each(jks.timestamper.update);
    }

    var lastUpdated, fetchedTill;

    function renderFeeds(template, data) {
        fetchedTill = data.from;

        if (data.feed.length === 0) {
            $("#more-trigger").hide();
            return $("<div />"); /*XXX*/
        }

        var render = $(Mustache.render(template, data));
        render.find(".author").each(function() {
            jks.idMapper.update.apply(this, arguments)
            .done(updatePostWithUserDetails);
        });

        lastUpdated = Date.parse(data.now);
        jks.timestamper.setReference(lastUpdated);
        data.feed.forEach(function(post) {
            jks.datacache.setPost(post.id, post);
        });

        return render;
    }


    function load(container) {
        var deferred = $.Deferred();
        $.when(
              $.fetch.template("feed")
            , $.getJSON("/api/user/feed")
            , $.fetch.js("timestamper")
            , $.fetch.js("idMapper")
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
        event.preventDefault();
        $.when(
              $.fetch.template("feed")
            , $.getJSON("/api/user/feed", {upto: fetchedTill})
        )
            .fail(jks.common.warn)
            .done(function() {
                selfDiv.append(renderFeeds(arguments[0][0], arguments[1][0]));
                updateTimestamps();
            });
    }

    return {
        load: load,
    };
}());

