var jks = jks || {};
jks.postList = jks.postList || (function() {
    "use strict";

    function isMouseOver(e) {
        var underneathMouse = $(document.elementFromPoint(e.pageX, e.pageY));
        return (underneathMouse.parents(".details")) /*XXX*/
    }

    return function(postListType, fetchDataActual) {

        var showDetailTrigger;
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

        var permanentDiv, currentDiv;

        function loadShowDetailTrigger() {
            showDetailTrigger = 
                $('<a id="show-detail-trigger" class="trigger"/>')
                .click(clickArrow);
                ;
        /*
                .hover(function() {
                    if (!permanentDiv) {
                        jks.detailView.show("post", $(this).parent().data("id"));
                    }
                }, function(e) {
                    if (!isMouseOver(e)) {
                        jks.detailView.hide();
                    }
                })
                .click(function(){
                    if (permanentDiv) {
                        permanantDiv = undefined;
                    } else {
                        permanentDiv = currentDiv;
                    }
                });

*/
            root.on("mouseenter", ".post", mouseenterPost);
            root.on("mouseleave", ".post", mouseleavePost);
            //root.on("click", ".post", clickPost);
            $("#detail").on("detail-closed", cancelDetail);
        }

        function cancelDetail() {
            permanentDiv.removeClass("current");
            permanentDiv = undefined;
        }

        function clickArrow(event) {
            if (permanentDiv) {
                cancelDetail();
            } 
            permanentDiv = $(event.currentTarget).parent();
            jks.detailView.show("post", permanentDiv.data("id"));
            permanentDiv.addClass("current");
        }

        function mouseenterPost(event) {
            currentDiv = $(event.currentTarget);
            showDetailTrigger.appendTo(currentDiv);
            if (!permanentDiv) {
                $(event.currentTarget).addClass("current");
            }
        }

        function mouseleavePost(event) {
            if (!permanentDiv) {
                $(event.currentTarget).removeClass("current");
            }
            showDetailTrigger.detach();
            currentDiv = undefined;
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

                    loadShowDetailTrigger();

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

