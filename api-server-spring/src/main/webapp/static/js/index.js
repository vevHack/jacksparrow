var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    function preload() {
    }

    function triggerHandlerFactory(content, tabs) {
        var currentTab;
        var previousTrigger = $("<a />");
        var action = handle;
        var animDuration = "slow";

        function handle(event) {
            var spinner;
            var trigger = event.target;
            var newTab = tabs[trigger.id];

            if (typeof newTab === 'undefined') {
                jks.common.warn();
            }

            previousTrigger.toggleClass("current");
            previousTrigger = $(trigger).toggleClass("current");
            action = jks.common.nop;

            var currentTabHidden = $.Deferred();
            var newTabLoaded = $.Deferred();

            if (currentTab) {
                currentTab.div.slideToggle(animDuration, 
                    currentTabHidden.resolve);
            } else {
                currentTabHidden.resolve();
            }
             
            if (typeof newTab === 'string') {
                spinner = $('<div id="loader-tab-parent"/>').append(
                    $('<div id="loader-tab"/>')).prependTo(content);
                $.fetch.js(newTab)
                    .fail(jks.common.warn)
                    .done(function() {
                        newTab = tabs[trigger.id] = jks[newTab];
                        newTab.load(content).done(function(div) {
                            spinner.remove();
                            newTab.div = div;
                            newTabLoaded.resolve();
                        });
                    });
            } else {
                newTabLoaded.resolve();
            }

            $.when(currentTabHidden, newTabLoaded).done(function() {
                newTab.div.fadeToggle(animDuration, function() {
                    currentTab = newTab;
                    action = handle;
                });
            });
        }

        return function(event) {
            action(event);
            event.preventDefault();
        }
    }


    function load() {
        var me;
        $.getJSON("/api/me")
            .fail(jks.common.handleUnauthenticated)
            .pipe(function(data) {
                me = data;
                return $.when(
                    $.fetch.template("index"),
                    $.fetch.js("dashboard"),
                    $.fetch.js("root-pane-self")
                );
            }, function() { return $.Deferred() })
                .fail(jks.common.warn)
                .done(function() {
                    var template = arguments[0][0];

                    $("body").html(Mustache.render(template));

                    /* XXX merge with jks.datacache ?? */
                    jks.dashboard.load($("#dashboard"), 
                        { name: me.name || me.username });
                    jks.rootPaneSelf.load($("#root-pane"), 
                        triggerHandlerFactory($("#content"), {
                            "feed-trigger": "feed",
                            "create-trigger": "create"
                        })).done(function() {
                            $("#feed-trigger").trigger("click");
                        });
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
