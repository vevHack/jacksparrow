var jks = jks || {};
jks.post = jks.post || (function() {
    "use strict";

    var dependencies = ["fetchUser", "datacache", "dashboard", 
        "formatter", "userPix"];
    var postId = document.URL.match(".*/([^/]*)$")[1];
    var me;

    function load() {
        $.getJSON("/api/me")
            .done(function(data) { me = data.user; })
            .always(function() {

                var fetchList = [
                      $.fetch.template("post") 
                    , $.getJSON("/api/post/details", {post: postId})
                    ].concat(dependencies.map($.fetch.js));

                $.when.apply(this, fetchList).done(function() {
                    loadAfterAuthentication(arguments[0][0], arguments[1][0]);
                });

            });
    }

    function loadAfterAuthentication(template, data) {
        jks.userPix.attachGlobalListener();
        var post = jks.formatter.formatPost(data.posts[0]);
        me = me && jks.formatter.formatUser(me);

        jks.fetchUser(post.user.id).done(function() {
            post.user = jks.datacache.getUser(post.user.id);
            $("body").html(Mustache.render(template, post));
            jks.dashboard.load($("#dashboard"), me);
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
