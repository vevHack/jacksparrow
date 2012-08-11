var jks = jks || {};
jks.dashboard = jks.dashboard || (function() {
    "use strict";

    function logout() {
        $.post("/api/session/destroy").done(jks.common.redirectToHome);
    }

    function createPost() {
    /*
        return $.fetch.template("create")
        .done(function() {
            
        $("body").append(
        */
    }

    function load(container, selfDisplayData) {
        return $.fetch.template("dashboard").done(function(template) {
            var render = Mustache.render(template, selfDisplayData);
            container.html(render);

            $.each({"#logout-trigger": logout, "#create-trigger": createPost},
                function(key, value) {
                    $(render).find(key).click(jks.common.wrapTrigger(value));
                });
        });
    }

    return {
        load: load
    };
}());

