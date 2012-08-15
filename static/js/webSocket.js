var jks = jks || {};
jks.webSocket = jks.webSocket || (function() {
    "use strict";

    function host() {
        return document.URL.match("(.*:\/\/[^/]+)\/")[1];
    }

    function connect() {
        var socket = io.connect(host());
        socket.on("feed", function() {
            $("body").trigger("jacksparrow.socket.feed");
        }, function() {
            $("body").trigger("jacksparrow.socket.posts");
        });
    }

    return {
        connect: connect
    };
}());

