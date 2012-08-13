var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    function load() {
        var me;

        $.getJSON("/api/me")
            .fail(jks.common.handleUnauthenticated)
            .pipe(function(data) {
                me = data.user;
                return $.when(
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
                );
            }, function() { return $.Deferred() })
                .fail(jks.common.warn)
                .done(function() {
                    var template = arguments[0][0];
                    $("body").html(Mustache.render(template));

                    jks.datacache.setUser(me = jks.formatter.formatUser(me));
                    var tabs = jks.contentTabManager($("#content"), 
                        ["feed", "posts", "followers", "following"], me.id);

                    $.when(
                            jks.dashboard.load($("#dashboard"), me)
                          , jks.rootPane.load($("#root-pane"), me, tabs)
                          , jks.follow.load(me)
                          , jks.detailView.load($("#detail"))
                    ).done(function() {
                        $("#feed-trigger").trigger("click");
                    });
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
