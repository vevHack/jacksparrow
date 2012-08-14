var jks = jks || {};
jks.formatter = jks.formatter || (function() {
    "use strict";

    function formatUser(user) {
        user = $.extend({ permalink: ["", user.username].join("/") }, user);
        user.name = user.name || user.username;
        return user;
    }

    function formatPost(post) {
        return $.extend({
              created_on_readable: new Date(Date.parse(post.created_on))
            , permalink: [post.user.permalink, post.id].join("/")
        }, post);
    }

    return {
          formatUser: formatUser
        , formatPost: formatPost
    };
}());
