var jks = jks || {};
jks.following = jks.following || (function() {
    "use strict";

    return function(user) {
        function fetchData(params) {
            return $.getJSON("/api/user/following", 
                $.extend({user:user}, params));
        }

        return jks.postList("following", fetchData, jks.common.nop);
    };
}());
