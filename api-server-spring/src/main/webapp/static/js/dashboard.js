var jks = jks || {};
jks.dashboard = jks.dashboard || (function() {
    "use strict";

    function logout() {
        $.post("/api/session/destroy")
            .fail(jks.common.warn)
            .done(jks.common.redirectToHome);
    }

    function load(container, selfDisplayData) {
        return $.fetch.template("dashboard")
            .fail(jks.common.warn)
            .done(function(template) {
                var render = Mustache.render(template, selfDisplayData);
                container.html(render);
                $(render).find("#logout-trigger").click(logout)
            });
    }

    return {
        load: load
    };
}());

