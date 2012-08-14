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
        window.addEventListener("DOMNodeInserted", function(event) {
            $(event.target).find("*").andSelf().filter(".profile").each(
                function(idx, img) {
                    img = $(img);
                    setImage(img, img.data("id"));
                });
        }, false);
    }

    return {
        attachGlobalListener: attachGlobalListener
    };
}());

