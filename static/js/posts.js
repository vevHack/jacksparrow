var jks = jks || {};
jks.posts = jks.posts || (function() {
    "use strict";

    return function(user) {
        function fetchData(params) {
            return $.getJSON("/api/user/posts", $.extend({user:user}, params));
        }

        var posts = jks.postList("posts", fetchData);
        $("body").bind("jacksparrow.socket.posts", posts.update);
        return posts;
    };
}());
