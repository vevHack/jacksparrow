var jks = jks || {};
jks.postDetails = jks.postDetails || (function() {
    "use strict";

    function format(postId) {
        var post = jks.datacache.getPost(postId);
        var user = jks.datacache.getUser(post.user.id);
        return {
              created_on: new Date(Date.parse(post.created_on))
            , permalink: ["", user.username, post.id].join("/")
        };
    }

    var template;

    function setTemplate(template_) { 
        template = template || template_; 
    }

    function show(postId) {
        $("#detail").html(Mustache.render(template, format(postId)));
    }

    return {
          setTemplate: setTemplate
        , show: show
    };
}());
