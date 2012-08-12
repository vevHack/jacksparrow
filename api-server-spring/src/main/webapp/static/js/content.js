var jks = jks || {};
jks.postList = jks.postList || (function() {
    "use strict";

    return function(postListType) {

        var showDetailTrigger;

        function loadShowDetailTrigger() {
            return $.when(
                $.fetch.img("arrow-light.png"),
                $.fetch.img("arrow-dark.png")
            ).done(function(light, dark) {
                if(typeof showDetailTrigger === 'undefined') {
                    showDetailTrigger = $('<div id="show-detail-trigger"/>')
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
                }
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


        var api = "/api/user/" + postListType;
        var root, postListTemplate, api;
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

        function renderPostList(data) {
            var render = $(Mustache.render(postListTemplate, data));

            serverTimestamp = data.now;
            updateSyncStatus(data);

            jks.fetchUser(data[postListType].map(function(post) { 
                return post.user.id;
            }))
            .done(function() {
                render.find(".author").each(updatePostWithUserDetails);
            });

            data[postListType].forEach(function(post) {
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
            root.find(".post").each(jks.timestamper.update);
        }

        function fetch() {
            var dfd = $.Deferred();
            $.when(
                $.fetch.template(postList")
                , $.getJSON(api)
                , $.fetch.js("timestamper")
                , $.fetch.js("fetchUser")
                , $.fetch.js("datacache")
                ).done(function() {

                    postListTemplate = arguments[0][0];
                    var data = arguments[1][0];
                    root = $('<div id="' + postListType + '" />')
                    .append(renderPostList(data));

                    updateTimestamps();

                    loadShowDetailTrigger()
                    .done(function() {
                        root.on("mouseenter", ".post", mouseenterPost);
                        root.on("mouseleave", ".post", mouseleavePost);
                    });

                    jks.common.notifyOnScrollToBottom(more)

                    dfd.resolve(root);
                });
                return dfd.promise();
        }


        function update() {
            $.getJSON(api, {newerThan: newestTimestamp})
                .fail(jks.common.warn)
                .done(function(data) {
                    if (data.postList.length !== 0) {
                        renderPostList(postListTemplate, data).hide()
                        .prependTo(root).slideDown("slow");
                        updateTimestamps();
                    }
                });
        }

        var more = (function() {
            var action = function () {
                var spinner = jks.common.loaderAnimation().appendTo(root);
                return $.getJSON(api, {olderThan: oldestTimestamp})
                    .fail(jks.common.warn)
                    .done(function(data) {
                        spinner.remove();
                        if (data.postList.length !== 0) {
                            renderPostList(postListTemplate, data).hide()
                            .appendTo(root).slideDown("slow");
                            updateTimestamps();
                        } else {
                            action = noMore;
                        }
                    });
            }

            function noMore() {
                return $.Deferred().resolve();
            }

            return function() {
                return action();
            }
        }());


        return {
            fetch: fetch
            , update: update
        };
    };
}());

