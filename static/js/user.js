var jks = jks || {};
jks.user = jks.user || (function() {
    "use strict";

    var dependencies = ["fetchUser", "postList", "userList", "formatter",
        "datacache", "dashboard", "rootPane", "detailView", "detailTrigger",
        "follow", "contentTabManager", "userPix"];
    var username = document.URL.match(".*/([^/]*)$")[1];
    var me;

    function load() {
        document.title = ["@", username, " (", document.title, ")"].join("");
        $.getJSON("/api/me")
            .done(function(data) { me = data.user; })
            .always(function(data) {

                var fetchList = [
                      $.fetch.template("index") 
                    , $.getJSON("/api/user/find", {username: username})
                    ].concat(dependencies.map($.fetch.js));

                $.when.apply(this, fetchList).done(function() {
                    loadAfterAuthentication(arguments[0][0], arguments[1][0]);
                });
            });
    }

    function loadAfterAuthentication(template, data) {
        jks.userPix.attachGlobalListener();
        var user = data.user;
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

        jks.fetchUser(user.id).done(function() {
            user = jks.datacache.getUser(user.id);
            var tabs = jks.contentTabManager($("#content"), 
                ["posts", "followers", "following"], user.id);

            $.when(
                  jks.rootPane.load($("#root-pane"), user, tabs, {
                      statsNoUpdate: (!me || (user.id !== me.id)),
                      showFollow: true})
                , followersDfd
                , jks.detailView.load($("#detail"))
            ).done(function() {
                $("#posts-trigger").trigger("click");
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
