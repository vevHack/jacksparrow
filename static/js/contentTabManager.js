var jks = jks || {};
jks.contentTabManager = jks.contentTabManager || (function() {
    "use strict";

    return function (content, tabList, userId) {
        var currentTab;
        var previousTrigger = $("<a />");
        var action = handle;
        var animDuration = "slow";

        function tabsFactory() {
            var tabs = {};
            tabList.forEach(function(js) {
                tabs[[js, "trigger"].join("-")] = {
                    js: js, 
                    factory: function() { return jks[js](userId) }
                };
            });
            return tabs;
        }

        var tabs = tabsFactory();

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
}());
