var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    var dependencies = ["fetchUser", "postList", "userList", "formatter",
        "datacache", "dashboard", "rootPane", "detailView", "detailTrigger",
        "follow", "contentTabManager", "userPix"];
    var me;

    function load() {
        $.getJSON("/api/me")
            .fail(jks.common.handleUnauthenticated)
            .done(function(data) {
                me = data.user;
                $.when.apply(this, [$.fetch.template("index")].concat(
                    dependencies.map($.fetch.js))).done(function() {
                        loadAfterAuthentication(arguments[0][0]);
                    });
            });
    }

    function loadAfterAuthentication(template) {
        jks.userPix.attachGlobalListener();
        $("body").html(Mustache.render(template));

        jks.datacache.setUser(me = jks.formatter.formatUser(me));
        var tabs = jks.contentTabManager($("#content"), 
            ["feed", "posts", "followers", "following"], me.id);

        $.when(
              jks.dashboard.load($("#dashboard"), me)
            , jks.rootPane.load($("#root-pane"), me, tabs, "rootPaneIndex")
            , jks.follow.load(me)
            , jks.detailView.load($("#detail"))
        ).done(function() {
            $("#feed-trigger").trigger("click");
        });
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.index.load();
});
