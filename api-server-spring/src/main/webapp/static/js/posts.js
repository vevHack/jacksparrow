var jks = jks || {};
jks.posts = jks.posts || (function() {
    "use strict";

    return function(user) {
        function fetchData(params) {
            return $.getJSON("/api/user/posts", $.extend({user:user}, params));
        }

        return jks.postList("posts", fetchData);
    };
}());
