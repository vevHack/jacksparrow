var jks = jks || {};
jks.follow = jks.follow || (function() {
    "use strict";

    var following;

    var handler = (function() {
        var API = {"follow-trigger": "follow", "unfollow-trigger": "unfollow"};
        var opposite = {
              "follow-trigger": {
                id: "unfollow-trigger", title: "Unfollow", incr: 1
              }
            , "unfollow-trigger": {
                id: "follow-trigger", title: "Follow", incr: -1
            }
        };

        return function() {
            var id = this.id;
            var userId = $(this).data("id");
            var other = opposite[id];
            var that = $(this);

            $.post("/api/user/" + API[id], {user: userId}).done(function() {
                that.replaceWith(
                    $("<a />").attr("id", other.id).attr("title", other.title)
                    .addClass("trigger").data("id", userId));
                jks.common.incrementValue($("#stats-following"), other.incr);
            });

            event.preventDefault();
        };
    }());
    

    function load(me) {
        return $.getJSON("/api/user/following", {user: me.id})
            .done(function(data) {
                following = data.following.map(function(user) {
                    return user.id;
                });
                jks.datacache.addSetUserListener(setUserListener);
                $("body")
                    .on("click", "#follow-trigger", handler)
                    .on("click", "#unfollow-trigger", handler);
            });
    }

    function setUserListener(user) {
        var follows = doesFollow(user.id);
        $.extend(user, { doesFollow: follows, doesNotFollow: !follows });
    }

    function doesFollow(userId) {
        return following.indexOf(userId) !== -1;
    }

    return {
          load: load
    };
}());
