var jks = jks || {};
jks.index = jks.index || (function() {
    "use strict";

    function contentTabManager(content, tabs) {
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

            jks.detailView.hide();

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
            var dfd = currentTab && currentTab.more && currentTab.more();
            return dfd || $.Deferred().resolve();
        });

        return function(event) {
            action(event);
            event.preventDefault();
        }
    }

    function load() {
        var me;

        function tabsFactory() {
            var tabs = {};
            ["feed", "posts", "followers", "following"].forEach(function(js) {
                tabs[[js, "trigger"].join("-")] = {
                    js: js, 
                    factory: function() { return jks[js](me.id); }
                };
            });
            return tabs;
        }

        return $.getJSON("/api/me")
            .fail(jks.common.handleUnauthenticated)
            .pipe(function(data) {
                me = data.user;
                return $.when(
                /* XXX Bad way to manage dependencies */
                      $.fetch.template("index")
                    , $.fetch.js("fetchUser")
                    , $.fetch.js("postList")
                    , $.fetch.js("userList")
                    , $.fetch.js("formatter")
                    , $.fetch.js("datacache")
                    , $.fetch.js("dashboard")
                    , $.fetch.js("rootPane")
                    , $.fetch.js("detailView")
                    , $.fetch.js("detailTrigger")
                    , $.fetch.js("follow")
                );
            }, function() { return $.Deferred() })
                .fail(jks.common.warn)
                .done(function() {
                    var template = arguments[0][0];
                    $("body").html(Mustache.render(template));

                    jks.datacache.setUser(me = jks.formatter.formatUser(me));
                    var tabs = contentTabManager($("#content"), tabsFactory());

                    $.when(
                            jks.dashboard.load($("#dashboard"), me)
                          , jks.rootPane.load($("#root-pane"), me, tabs)
                          , jks.follow.load(me)
                          , jks.detailView.load($("#detail"))
                    ).done(function() {
                        $("#feed-trigger").trigger("click");
                    });
                });
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.index.load();
});
