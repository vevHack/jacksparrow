var jks = jks || {};
jks.user = jks.user || (function() {
    "use strict";

    function load() {
        var me;
        var profileUserId = document.URL.match(".*/([^/]*)$")[1];

        $.getJSON("/api/me")
            .done(function(data) { me = data.user; })
            .always(function() {
                $.when(
                      $.fetch.template("index")
                    , $.fetch.js("fetchUser")
                    , $.fetch.js("postList")
                    , $.fetch.js("userList")
                    , $.fetch.js("formatter")
                    , $.fetch.js("datacache")
                    , $.fetch.js("dashboard")
                    , $.fetch.js("rootPane")
                    , $.fetch.js("detailView")
                    , $.fetch.js("detailTrigger")
                    , $.fetch.js("follow")
                    , $.fetch.js("contentTabManager")
                ).done(function() {
                    var template = arguments[0][0];
                    $("body").html(Mustache.render(template));

                    var followersDfd;
                    if (me) {
                        me = jks.formatter.formatUser(me);
                        jks.datacache.setUser(me);
                        followersDfd = jks.follow.load(me);
                    } else {
                        followersDfd = $.Deferred().resolve();
                    }
                    jks.dashboard.load($("#dashboard"), me);

                    jks.fetchUser(profileUserId).done(function() {
                        var user = jks.datacache.getUser(profileUserId);
                        var tabs = jks.contentTabManager($("#content"), 
                            ["posts", "followers", "following"], profileUserId);

                        $.when(
                              jks.rootPane.load($("#root-pane"), user, tabs)
                            , followersDfd
                            , jks.detailView.load($("#detail"))
                        ).done(function() {
                            $("#post-trigger").trigger("click");
                        });
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
    jks.user.load();
});
