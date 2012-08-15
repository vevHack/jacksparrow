var jks = jks || {};
jks.webSocket = jks.webSocket || (function() {
    "use strict";

    function host() {
        return document.URL.match("(.*:\/\/[^/]+)\/")[1];
    }

    function connect() {
        var socket = io.connect(host());
        socket.emit("token", document.cookie.match(".*=(.*)")[1]);
        socket.on("feed", function() {
            $("body").trigger("jacksparrow.socket.feed");
        });
        socket.on("post", function() {
            $("body").trigger("jacksparrow.socket.posts");
        });
    }

    return {
        connect: connect
    };
}());

