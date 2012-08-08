var jks = jks || {};
jks.dashboard = jks.dashboard || (function() {
    "use strict";

    function preload() {
    }

    function logout() {
        $.post("/api/session/destroy")
            .fail(jks.common.warn)
            .done(jks.common.redirectToHome);
    }

    function load(container, selfData) {
        $.when(
            $.fetch.template("dashboard")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0];
                container.html(Mustache.render(template, selfData));
                container.find("#logout-trigger").click(logout);
            });

        preload();
    }

    return {
        load: load
    };
}());

