var jks = jks || {};
jks.create = jks.create || (function() {
    "use strict";

    function preload() {
    }

    function attachKeyboardListener(field, output) {
        var limit = 140;
        var prevC = limit + 1;
        output.addClass("unvalidated");
        $(field).on("keyup", function() {
            var c = field.val().trim().length;
            output.text((c > limit) ?
                [c - limit, "extra characters"].join(" ") :
                [limit - c, "characters remaining"].join(" "));
            if ((c <= limit && prevC > limit) 
                || (c > limit && prevC <= limit)) {
                output.toggleClass("validated").toggleClass("unvalidated");
            }
            prevC = c;
        });
    }

    var selfDiv;

    function load(container) {
        var deferred = $.Deferred();
        $.when(
            $.fetch.template("create")
        )
            .fail(jks.common.warn)
            .done(function() {
                var template = arguments[0];
                var render = $(Mustache.render(template));

                container.append(
                    selfDiv = $('<div id="create" />').append(render).hide());

                attachKeyboardListener(selfDiv.find('textarea'), 
                    selfDiv.find('.info'));

                deferred.resolve(selfDiv);
            });

        preload();
        return deferred.promise();
    }

    return {
        load: load,
    };
}());

