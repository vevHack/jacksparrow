(function($) {
    "use strict";

    if ($.fetch) {
        return;
    }

    var images = {};

    $.fetch = {

        template:  function(template) {
            return $.ajax({
                url: ["/static/template/", template, ".mustache"].join(""),
                cache: true,
                dataType: "text"
            });
        },

        js:  function(js) {
            return $.ajax({
                url: ["/static/js/", js, ".js"].join(""),
                cache: true,
                dataType: "script"
            });
        },

        img: function(src) {
            var deferred, promise;
            src = ["/static/img/", src].join("");

            if (images[src]) {
                return images[src];
            }

            promise = (deferred = $.Deferred()).promise();
            $("<img />")
                .on("load", function(event) {
                    images[src] = promise;
                    deferred.resolve($(event.target));
                })
                .on("error", function(event) {
                    deferred.reject($(event.target));
                })
                .attr("src", src);
            return deferred.promise();
        }

    };

}(jQuery));
