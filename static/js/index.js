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

    function loadCss(css) {
        $("head").append(
            $('<link rel="stylesheet" type="text/css" />').attr("href", css));
    }

    function onEditImage() {
        var alt = "Change your profile image";
        $("#editUserPix-trigger")
            .children("img").attr("alt", alt).attr("title", alt).end()
            .click(function() {
                console.log("test");
                window.location.replace("/static/image.html?user=" + me.id);
                return false;
        });
        /*
        loadCss("/static/css/lib/jquery.Jcrop.css");
        $.when(
        $.fetch.js("lib/jquery.Jcrop")
        , $.fetch.js("editUserPix")
        ).done(function() {
        var alt = "Change your profile image";
        $("#editUserPix-trigger")
        .children("img").attr("alt", alt).attr("title", alt).end()
        .click(function() {
        window.location.replace("/static/image.html");
        //jks.editUserPix.load($("body"), me.id);
        });
        });
        */
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
            onEditImage();
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
