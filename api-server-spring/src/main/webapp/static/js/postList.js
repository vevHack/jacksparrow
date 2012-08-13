var jks = jks || {};
jks.postList = jks.postList || (function() {
    "use strict";

    function attachDetailTrigger(root, type, detailView) {
        var currentDiv, trigger;

        function cancelDetail() {
            currentDiv.removeClass("current");
            currentDiv = undefined;
        }

        function expandDetail(event) {
            var targetDiv = $(event.currentTarget).parent();
            if (currentDiv) {
                var lastId = currentDiv.data("id");
                cancelDetail();
                if (lastId === targetDiv.data("id")) {
                    detailView.hide();
                    return;
                }
            } 
            currentDiv = targetDiv;
            currentDiv.addClass("current");
            detailView.show(type, currentDiv, cancelDetail);
        }

        function mouseenterPost(event) {
            var targetDiv = $(event.currentTarget);
            trigger.appendTo(targetDiv);
            if (!currentDiv) {
                targetDiv.addClass("current");
            }
        }

        function mouseleavePost(event) {
            var targetDiv = $(event.currentTarget);
            if (!currentDiv) {
                targetDiv.removeClass("current");
            }
            trigger.detach();
        }

        trigger = $('<a id="show-detail-trigger" class="trigger"/>');
        trigger.click(expandDetail);

        root.on("mouseenter", ".post", mouseenterPost);
        root.on("mouseleave", ".post", mouseleavePost);
    }


    return function(postListType, fetchDataActual) {

        var root, postListTemplate;
        var serverTimestamp, newestTimestamp, oldestTimestamp;

        function fetchData(params) {

            function authors(posts) {
                return posts.map(function(post) { return post.user.id });
            }

            var dfd = $.Deferred();

            fetchDataActual(params).done(function(data) {
                var posts = data[postListType];
                jks.fetchUser(authors(posts)).done(function() {
                    posts.forEach(function(post) {
                        post.user = jks.datacache.getUser(post.user.id);
                        jks.datacache.setPost(jks.formatter.formatPost(post));
                    });
                    dfd.resolve(data);
                });
            });

            return dfd.promise();
        }

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
                ).done(function() {
                    postListTemplate = arguments[0][0];
                    var data = arguments[1];
                    root = $('<div id="' + postListType + '" />');

                    if (data[postListType].length === 0) {
                        root.append('<span class="info">Nothing Yet</span>');
                        newestTimestamp = oldestTimestamp = serverTimestamp;
                        more = noMore;
                    } else {
                        root.append(renderPostList(data));
                        updateTimestamps();
                    }

                    attachDetailTrigger(root, "post", jks.detailView);

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

