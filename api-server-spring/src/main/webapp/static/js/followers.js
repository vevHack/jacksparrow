var jks = jks || {};
jks.followers = jks.followers || (function() {
    "use strict";

    return function(user) {
        function fetchData(params) {
            return $.getJSON("/api/user/followers", 
                $.extend({user:user}, params));
        }

        return jks.postList("followers", fetchData, jks.common.nop);
    };
}());
