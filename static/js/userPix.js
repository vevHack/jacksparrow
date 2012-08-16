var jks = jks || {};
jks.userPix = jks.userPix || (function() {
    "use strict";

    function setImage(element, userId) {
        function show() { element.removeClass("invisible") }
        var size = element.width();
        if (size <= 48) {
            size = 48;
        }
        element
            .on("error", function() {
                element
                    .off("error")
                    .on("load", show)
                    .attr("src", "/static/img/anon.png");
            })
            .on("load", show)
            .attr("src", ["/api/userpix", 
                $.param({user: userId, size: size})].join("?"));
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

