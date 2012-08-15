var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    var dependencies = ["fetchUser", "postList", "userList", "formatter",
        "datacache", "dashboard", "rootPane", "detailView", "detailTrigger",
        "follow", "contentTabManager", "userPix", "editProfile", 
        "webSocket"];
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
            ["feed", "editProfile", "posts", "followers", "following"], me.id);

        $.when(
              jks.dashboard.load($("#dashboard"), me)
            , jks.rootPane.load($("#root-pane"), me, tabs, 
                {showFeed: true, editProfile: true})
            , jks.follow.load(me)
            , jks.detailView.load($("#detail"))
        ).done(function() {
            $("#feed-trigger").trigger("click");
        });

        jks.webSocket.connect();
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.index.load();
});
