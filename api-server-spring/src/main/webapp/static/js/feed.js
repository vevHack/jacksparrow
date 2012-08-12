var jks = jks || {};
jks.feed = jks.feed || (function() {
    "use strict";

    function fetchData(params) {
        return $.getJSON("/api/user/feed", params);
    }

    function onRender(render, data) {
        jks.fetchUser(data.feed.map(function(post) { return post.user.id; }))
            .done(function() {
                render.find(".author").each(updatePostWithUserDetails);
            });
    }

    function updatePostWithUserDetails(idx, authorSpan) {
        authorSpan = $(authorSpan);
        var user = jks.datacache.getUser(authorSpan.data("id"));
        $('<a href="#"/>').appendTo(authorSpan)
            .text(user.name || user.username)
            .on("click", function() {
                showUserDetails(user);
                event.preventDefault();
            });
    }

    function showUserDetails(user) {
        $("#detail").html(JSON.stringify(user));
    }

    return jks.postList("feed", fetchData, onRender);
}());
