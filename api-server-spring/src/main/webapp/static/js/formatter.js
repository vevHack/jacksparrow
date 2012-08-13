var jks = jks || {};
jks.formatter = jks.formatter || (function() {
    "use strict";

    function formatUser(user) {
        return $.extend({ 
              name : user.username
            , permalink: ["", user.username].join("/")
        }, user);
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
