var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function fetchData(params) {
        return $.getJSON("/api/user/feed", params);
    }

    return function() {
        return jks.postList("feed", fetchData);
    };
}());
