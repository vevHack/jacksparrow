var jks = jks || {};
jks.post = jks.post || (function() {
    "use strict";

    function load() {
        var me;
        var postId = document.URL.match(".*/([^/]*)$")[1];

        $.getJSON("/api/me")
            .done(function(data) { me = data.user; })
            .always(function() {
                $.when(
                      $.fetch.template("post")
                    , $.getJSON("/api/post/details", {post: postId})
                    , $.fetch.js("dashboard")
                    , $.fetch.js("fetchUser")
                    , $.fetch.js("datacache")
                    , $.fetch.js("formatter")
                )
                    .done(function() {
                        var template = arguments[0][0];
                        var data = arguments[1][0];

                        var post = jks.formatter.formatPost(data.posts[0]);
                        me = jks.formatter.formatUser(me);

                        jks.fetchUser(post.user.id).done(function() {
                            post.user = jks.datacache.getUser(post.user.id);
                            $("body").html(Mustache.render(template, post));
                    
                            jks.dashboard.load($("#dashboard"), me);
                        });
                    });
            });
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.post.load();
});
