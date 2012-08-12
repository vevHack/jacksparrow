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
             
            if (newTab.div) {
                newTabLoaded.resolve();
            } else {
                spinner = jks.common.loaderAnimation().prependTo(content);
                $.fetch.js(newTab.js)
                    .fail(jks.common.warn)
                    .done(function() {
                        $.extend(newTab, newTab.factory());
                        newTab.fetch().done(function(div) {
                            spinner.remove();
                            content.append(div.hide());
                            newTab.div = div;
                            newTabLoaded.resolve();
                        });
                    });
            } 

            $.when(currentTabHidden, newTabLoaded).done(function() {
                newTab.div.fadeToggle(animDuration, function() {
                    currentTab = newTab;
                    action = handle;
                });
            });
        }

        jks.common.notifyOnScrollToBottom(function() {
            return currentTab && currentTab.more();
        });

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
                      $.fetch.template("index")
                    , $.fetch.js("dashboard")
                    , $.fetch.js("root-pane")
                    , $.fetch.js("postList")
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

                    var tabs = {
                        "feed-trigger": { 
                            js: "feed", 
                            factory: function() { return jks.feed; }
                        }
                        ,
                        "posts-trigger": {
                            js: "posts",
                            factory: function() { return jks.posts(me.id); }
                        }
                    };
                    jks.rootPane.load(
                        $("#root-pane"), userDisplayData, 
                            triggerHandlerFactory($("#content"), tabs)
                    )
                        .done(function() {
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
    jks.common.attachWarnToFetchFailure();
    jks.index.load();
});
