var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function fetchData(params) {
        return $.getJSON("/api/user/feed", params);
    }

    return function() {
        var feed = jks.postList("feed", fetchData);
        $("body").bind("jacksparrow.socket.posts", feed.update);
        $("body").bind("jacksparrow.socket.feed", feed.update);
        return feed;
    };
}());
