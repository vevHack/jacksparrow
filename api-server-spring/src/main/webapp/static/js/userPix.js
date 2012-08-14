var jks = jks || {};
jks.userPix = jks.userPix || (function() {
    "use strict";

    function setImage(element, userId) {
        function show() { element.removeClass("invisible") }
        element
            .on("error", function() {
                element
                    .off("error")
                    .on("load", show)
                    .attr("src", "/static/img/anon.png");
            })
            .on("load", show)
            .attr("src", ["/api/user/pix", 
                $.param({user: userId, size:element.width()})].join("?"));
    }

    function attachGlobalListener() {
    console.log("XXX");
        window.addEventListener("DOMContentLoaded", function(element) {
    console.log("foo");
    /*
            var element = $(element);
            if (element.hasClass("profile")) {
                setImage(element, element.data("id"));
            }
            */
        }, false);
    }

    return {
        attachGlobalListener: attachGlobalListener
    };
}());

