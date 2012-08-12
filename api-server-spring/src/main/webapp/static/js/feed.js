var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function fetchData(params) {
        return $.getJSON("/api/user/feed", params);
    }

    function onRender(render, data) {
        jks.fetchUser(data.feed.map(function(post) { return post.user.id; }))
            .done(function() {
                render.find(".user").each(updatePostWithUserDetails);
            });
    }

    function updatePostWithUserDetails(idx, userSpan) {
        userSpan = $(userSpan);
        var user = jks.datacache.getUser(userSpan.data("id"));
        $('<a href="#"/>').appendTo(userSpan)
            .text(user.name || user.username)
            .on("click", function() {
                showUserDetails(user);
                event.preventDefault();
            });
    }

    function userForDisplay(user) {
        return $.extend({name: user.username}, user);
    }

    function showUserDetails(user) {
        $.fetch.template("userDetails").done(function(template) {
            $("#detail").html(Mustache.render(template, userForDisplay(user)));
        });
    }

    return function() {
        return jks.postList("feed", fetchData, onRender);
    };
}());
