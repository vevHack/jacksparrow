var jks = jks || {};

(function() {
    "use strict";

    function preload() {
        $.fetch.js("timestamp"),
        $.fetch.js("idMapper")
    }

    function logout() {
        $.post("/api/session/destroy")
            .fail(jks.common.warn)
            .done(jks.common.redirectToHome);
    }

    $(function() {
        $.when(
            $.fetch.template("index"),
            $.getJSON("/api/me")
                .fail(jks.common.handleUnauthenticated),
            $.fetch.js("feed")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var data = arguments[1][0];
                $("body").html(Mustache.render(template, data));
                $("#logout").on("click", ".trigger", logout);
                jks.feed.load($("#content"));
            });

        preload();
    });
}());

