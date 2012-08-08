var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    function preload() {
    }

    function triggerHandlerFactory(content, tabs) {
        var currentTab, isLoading;

        function currentHideAndSet(tab) {
            if (currentTab) {
                currentTab.toggle();
            }
            currentTab = tab;
        }

        return function(event) {
            event.preventDefault();

            if (isLoading) {
                return;
            }

            var tab = tabs[event.target.id];
            if (typeof tab === 'undefined') {
                jks.common.warn();
            }

            if (typeof tab === 'string') {
                isLoading = true;
                $.fetch.js(tab)
                    .fail(jks.common.warn)
                    .done(function() {
                        tab = tabs[event.target.id] = jks[tab];
                        tab.load(content).done(function() {
                            isLoading = false;
                            currentHideAndSet(tab);
                        });
                    });
            } else {
                tab.toggle();
                currentHideAndSet(tab);
            }
        }
    }


    function load() {
        $.when(
            $.fetch.template("index"),
            $.getJSON("/api/me")
                .fail(jks.common.handleUnauthenticated),
            $.fetch.js("dashboard"),
            $.fetch.js("root-pane-self")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0][0];
                var selfData = arguments[1][0];

                $("body").html(Mustache.render(template));

                jks.dashboard.load($("#dashboard"), selfData);
                jks.rootPaneSelf.load($("#root-pane"), 
                    triggerHandlerFactory($("#content"), {
                        "feed-trigger": "feed",
                        "create-trigger": "create"
                    }));

                //$("#feed-trigger").trigger("click");
            });

        preload();
    }

    return {
        load: load
    };
}());

$(function() {
    jks.index.load();
});
