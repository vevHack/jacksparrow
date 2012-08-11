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
                me = data.user;
                return $.when(
                    $.fetch.template("index"),
                    $.fetch.js("dashboard"),
                    $.fetch.js("root-pane")
                );
            }, function() { return $.Deferred() })
                .fail(jks.common.warn)
                .done(function() {
                    var template = arguments[0][0];

                    $("body").html(Mustache.render(template));
                    
                    /* XXX merge with jks.datacache ?? */
                    var userDisplayData = 
                        { displayName: me.name || me.username };

                    jks.dashboard.load($("#dashboard"), userDisplayData);

                    var triggerHandler = triggerHandlerFactory($("#content"), {
                        "feed-trigger": "feed"
                    });
                    jks.rootPane.load(
                        $("#root-pane"), userDisplayData, triggerHandler)
                        .done(function() {
                //XXX            $("#feed-trigger").trigger("click");
                        });
                });

        preload();
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.index.load();
});
