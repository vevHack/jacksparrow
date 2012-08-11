var jks = jks || {};
jks.create = jks.create || (function() {
    "use strict";

    var prevC;

    function resetInfo(info) {
        prevC = Infinity;
        info.text("");
        info.removeClass("validated");
        info.addClass("unvalidated");
    }

    function attachKeyboardListener(field, info) {
        var limit = 140;
        resetInfo(info);

        $(field).on("keyup", function() {
            var c = field.val().trim().length;
            info.text((c > limit) ?
                [c - limit, "extra characters"].join(" ") :
                [limit - c, "characters remaining"].join(" "));
            if ((c <= limit && prevC > limit) 
                || (c > limit && prevC <= limit)) {
                info.toggleClass("validated").toggleClass("unvalidated");
            }
            prevC = c;
        });
    }

    function attachSubmitListener(form, trigger, content, info) {
        form.on("submit", function() {

            var spinner = jks.common.spinnerFactory().insertAfter(trigger);
            trigger.attr("disabled", true);
            content.attr("disabled", true);
            resetInfo(info);
            
            $.post("/api/post/create", {content: content.val().trim()})
                .always(function() {spinner.remove()})
                .done(function() {
                    form[0].reset();
                    $("#feed-trigger").trigger("click");
                })
                .fail(function(jqXHR) {
                    var error = JSON.parse(jqXHR.responseText).error;
                    if (error.code !== 412) {
                        jks.common.warn();
                    }
                    info.text(error.message);
                    content.attr("disabled", false);
                    trigger.attr("disabled", false);
                });

            event.preventDefault();
        });
    }

    var selfDiv;

    function load(container) {
        return $.fetch.template("create").done(function(template) {
            var render = $(Mustache.render(template));

            container.append(
                selfDiv = $('<div id="create" />').append(render).hide());

            var form = selfDiv.find("form");
            var content = form.find("textarea");
            var trigger = form.find('input[type="submit"]');
            var info = form.find(".info");

            attachKeyboardListener(content, info);
            attachSubmitListener(form, trigger, content, info);
        });
    }

    return {
        load: load,
    };
}());

