var jks = jks || {};
jks.userList = jks.userList || (function() {
    "use strict";

    return function(userListType, fetchDataActual) {

        var showDetailTrigger;
        var root, userListTemplate;
        var serverTimestamp, newestTimestamp, oldestTimestamp;

        function fetchData(params) {
            var dfd = $.Deferred();
            fetchDataActual(params).done(function(data) {
                var userList = data[userListType];
                jks.fetchUser(userList.map(function(user) {return user.id}))
                    .done(function() {
                        data[userListType] = userList.map(jks.datacache.getUser);
                        dfd.resolve(data);
                    });
            });
            return dfd.promise();
        }

        function loadShowDetailTrigger() {
            showDetailTrigger = 
                $('<a id="show-detail-trigger" class="trigger"/>');
            showDetailTrigger.on("click", function() {
            /* XXX Show USer details
                showPostDetails(jks.datacache.getPost(
                    $(this).parent().data("id")));
                    event.preventDefault();
                    */
            });

            root.on("mouseenter", ".post", mouseenterPost);
            root.on("mouseleave", ".post", mouseleavePost);
        }


        function mouseenterPost(event) {
            showDetailTrigger.appendTo(
                $(event.currentTarget).toggleClass("current"));
        }

        function mouseleavePost(event) {
            $(event.currentTarget).toggleClass("current");
            showDetailTrigger.detach();
        }


        function showUserDetails(user) {
            $("#detail").html(JSON.stringify(user));
        }

        function updateSyncStatus(data) {
            if (typeof newestTimestamp === "undefined") {
                newestTimestamp = data.newest;
                oldestTimestamp = data.oldest;
            } else {
                if (newestTimestamp.localeCompare(data.newest) < 0) {
                    newestTimestamp = data.newest;
                }
                if (oldestTimestamp.localeCompare(data.oldest) > 0) {
                    oldestTimestamp = data.oldest;
                }
            }
        }

        function renderUserList(data) {
            var render = $(Mustache.render(userListTemplate, data));

            serverTimestamp = data.now;
            updateSyncStatus(data);

            return render;
        }

        function updateTimestamps() {
            jks.timestamper.setReference(Date.parse(serverTimestamp));
            root.find(".post").each(jks.timestamper.update);
        }

        function fetch() {
            var dfd = $.Deferred();
            $.when(
                  $.fetch.template(userListType)
                , fetchData()
                , $.fetch.js("timestamper")
                , $.fetch.js("fetchUser")
                , $.fetch.js("datacache")
                ).done(function() {
                    userListTemplate = arguments[0][0];
                    var data = arguments[1];
                    root = $('<div id="' + userListType + '" />');

                    if (data[userListType].length === 0) {
                        root.append('<span class="info">Nothing Yet</span>');
                        newestTimestamp = oldestTimestamp = serverTimestamp;
                        more = noMore;
                    } else {
                        root.append(renderUserList(data));
            //XXX            updateTimestamps();
                    }

                    loadShowDetailTrigger();

                    dfd.resolve(root);
                });
                return dfd.promise();
        }


        function update() {
            return fetchData({newerThan: newestTimestamp})
                .fail(jks.common.warn)
                .done(function(data) {
                    if (data[userListType].length !== 0) {
                        renderUserList(data).hide()
                            .prependTo(root).slideDown("slow");
                        updateTimestamps();
                    }
                });
        }

        function noMore() {
            return $.Deferred().resolve();
        }

        function getMore() {
            var spinner = jks.common.loaderAnimation().appendTo(root);
            return fetchData({olderThan: oldestTimestamp})
                .fail(jks.common.warn)
                .done(function(data) {
                    spinner.remove();
                    if (data[userListType].length !== 0) {
                        renderUserList(data).hide()
                            .appendTo(root).slideDown("slow");
                            updateTimestamps();
                    } else {
                        more = noMore;
                    }
                });
        }

        var more = getMore;

        return {
              fetch: fetch
            , update: update
            , more: function() { return more(); }
        };
    };
}());

