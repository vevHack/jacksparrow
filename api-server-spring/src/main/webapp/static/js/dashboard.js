var jks = jks || {};
jks.dashboard = jks.dashboard || (function() {
    "use strict";

    function logout() {
        return $.post("/api/session/destroy").done(jks.common.redirectToHome);
    }

    function createPostFactory() {
        var postDiv;
        var action = firstTime;

        function firstTime() {
            var dfd = $.Deferred();
            $.fetch.js("create").done(function() {
                jks.create.fetch(onSubmit, subsequently).done(function(render) {
                    postDiv = render;
                    $("body").prepend(render.hide());
                    subsequently().done(function() {
                        action = subsequently;
                        dfd.resolve();
                    });
                });
            });
            return dfd;
        }

        function onSubmit() {
            subsequently().done(function() {
                jks.common.incrementValue($("#stats-posts"));
            });
        }

        function subsequently() {
            var dfd = $.Deferred();
            postDiv.slideToggle("slow", dfd.resolve);
            return dfd;
        }

        return function() { 
            return action();
        };
    }

    function load(container, selfDisplayData) {
        if (typeof selfDisplayData === "undefined") {
            return loadVanilla(container);
        }

        return $.fetch.template("dashboard").done(function(template) {
            var render = Mustache.render(template, selfDisplayData);
            container.html(render);

            $.each({ 
                  "#logout-trigger": logout
                , "#create-trigger": createPostFactory()
            }, function(key, value) {
                container.find(key).click(jks.common.oneExecTrigger(value));
            });
        });
    }

    function loadVanilla(container) {
        return $.fetch.template("dashboardVanilla").done(function(template) {
            container.html(Mustache.render(template));
        });
    }

    return {
          load: load
    };
}());

