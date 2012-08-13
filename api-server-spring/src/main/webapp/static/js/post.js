var jks = jks || {};
jks.post = jks.post || (function() {
    "use strict";

    function load() {
        var me;
        var postId = document.URL.match(".*/([^/]*)$")[1];

        /* this can be checked by the calling HTML XXX */
        $.getJSON("/api/me")
            .done(function(data) { me = data.user; })
            .always(function() {
                $.when(
                      $.fetch.template("post")
                    , $.getJSON("/api/post/details", {post: postId})
                    , $.fetch.js("dashboard")
                    , $.fetch.js("fetchUser")
                    , $.fetch.js("datacache")
                )
                    .done(function() {
                        var template = arguments[0][0];
                        var data = arguments[1][0];
                        var post = data.posts[0];
                        console.log(post);

                        jks.fetchUser(post.user.id).done(function() {
                            post.user = jks.datacache.getUser(post.user.id);
                            $("body").html(Mustache.render(template, post));
                    
                            /* XXX merge with jks.datacache ?? */
                            var userDisplayData = me && 
                                { displayName: me.name || me.username };
                            jks.dashboard.load($("#dashboard"), userDisplayData);
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
