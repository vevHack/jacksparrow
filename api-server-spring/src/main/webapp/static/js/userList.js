var jks = jks || {};
jks.userList = jks.userList || (function() {
    "use strict";

    return function(userListType, fetchDataActual) {

        var root, userListTemplate;

        function fetchData(params) {
            var dfd = $.Deferred();
            fetchDataActual(params).done(function(data) {
                var userList = 
                    data[userListType].map(function(user) {return user.id});
                jks.fetchUser(userList).done(function() {
                    data[userListType] = userList.map(jks.datacache.getUser);
                    dfd.resolve(data);
                });
            });
            return dfd.promise();
        }

        function fetch() {
            var dfd = $.Deferred();
            $.when(
                  $.fetch.template(userListType)
                , fetchData()
                , $.fetch.js("fetchUser")
                , $.fetch.js("datacache")
                ).done(function() {
                    userListTemplate = arguments[0][0];
                    var data = arguments[1];
                    root = $('<div id="' + userListType + '" />');

                    if (data[userListType].length === 0) {
                        root.append('<span class="info">Nothing Yet</span>');
                    } else {
                        root.append(Mustache.render(userListTemplate, data));
                    }

                    jks.detailTrigger.attach(root, "user", jks.detailView);

                    dfd.resolve(root);
                });
                return dfd.promise();
        }

        return {
              fetch: fetch
        };
    };
}());

