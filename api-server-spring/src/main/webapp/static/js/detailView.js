var jks = jks || {};
jks.detailView = jks.detailView || (function() {
    "use strict";

    var postTemplate, userTemplate;

    function load(root) {
        return $.when(
              $.fetch.template("userDetails")
            , $.fetch.template("postDetails")
            , $.fetch.js("datacache")
            ).done(function() {
                userTemplate = arguments[0][0];
                postTemplate = arguments[1][0];
                root.on("click", "#close-detail-trigger", function() {
                    root.html("");
                });
            });
    }

    function show(postId) {
        var post = jks.datacache.getPost(postId);
        $("#detail").html(Mustache.render(postTemplate, post));
    }

    return {
          load: load
        , show: show
    };
}());
