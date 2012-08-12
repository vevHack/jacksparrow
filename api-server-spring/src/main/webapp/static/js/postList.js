var jks = jks || {};
jks.postList = jks.postList || (function() {
    "use strict";

    var showDetailTrigger;

    function loadShowDetailTrigger(onClick) {
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
                });
            }
        });
    }


    return function(postListType, fetchData, onRender) {

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

        var root, postListTemplate;
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

            data[postListType].forEach(function(post) {
                jks.datacache.setPost(post.id, post);
            });

            onRender(render, data);

            return render;
        }

        function updateTimestamps() {
            jks.timestamper.setReference(Date.parse(serverTimestamp));
            root.find(".post").each(jks.timestamper.update);
        }

        function fetch() {
            var dfd = $.Deferred();
            $.when(
                  $.fetch.template(postListType)
                , fetchData()
                , $.fetch.js("timestamper")
                , $.fetch.js("fetchUser")
                , $.fetch.js("datacache")
                ).done(function() {
                    postListTemplate = arguments[0][0];
                    var data = arguments[1][0];
                    root = $('<div id="' + postListType + '" />');

                    if (data[postListType].length === 0) {
                        root.append('<span class="info">Nothing Yet</span>');
                        newestTimestamp = oldestTimestamp = serverTimestamp;
                        more = noMore;
                    } else {
                        root.append(renderPostList(data));
                        updateTimestamps();
                    }

                    loadShowDetailTrigger().done(function() {
                        root.on("mouseenter", ".post", mouseenterPost);
                        root.on("mouseleave", ".post", mouseleavePost);

                        showDetailTrigger.on("click", function() {
                            showPostDetails(jks.datacache.getPost(
                                $(this).parent().data("id")));
                            event.preventDefault();
                        });
                    });

                    dfd.resolve(root);
                });
                return dfd.promise();
        }


        function update() {
            return fetchData({newerThan: newestTimestamp})
                .fail(jks.common.warn)
                .done(function(data) {
                    if (data[postListType].length !== 0) {
                        renderPostList(data).hide()
                            .prependTo(root).slideDown("slow");
                        updateTimestamps();
                    }
                });
        }

        function noMore() {
            return $.Deferred().resolve();
        }

        function getMore() {
            var spinner = jks.common.loaderAnimation().appendTo(root);
            return fetchData({olderThan: oldestTimestamp})
                .fail(jks.common.warn)
                .done(function(data) {
                    spinner.remove();
                    if (data[postListType].length !== 0) {
                        renderPostList(data).hide()
                            .appendTo(root).slideDown("slow");
                            updateTimestamps();
                    } else {
                        more = noMore;
                    }
                });
        }

        var more = getMore;

        return {
              fetch: fetch
            , update: update
            , more: function() { return more(); }
        };
    };
}());

