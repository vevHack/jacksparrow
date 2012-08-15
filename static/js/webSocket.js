var jks = jks || {};
jks.webSocket = jks.webSocket || (function() {
    "use strict";

    function host() {
        return document.URL.match("(.*:\/\/[^/]+)\/")[1];
    }

    function connect(feedListener, postListener) {
        var socket = io.connect(host());
        feedListener && socket.on("feed", feedListener);
        postListener && socket.on("post", postListener);
    }

    return {
        connect: connect
    };
}());

