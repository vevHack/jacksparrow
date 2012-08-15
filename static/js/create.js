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

    function onSubmit(form, trigger, content, info) {
        var spinner = jks.common.spinnerFactory().insertBefore(trigger);
        content.attr("disabled", true);
        resetInfo(info);

        return $.post("/api/post/create", {content: content.val().trim()})
            .always(function() {
                content.attr("disabled", false);
                spinner.remove();
            })
            .done(function() {
                form[0].reset();
            })
            .fail(function(jqXHR) {
                var error = JSON.parse(jqXHR.responseText).error;
                if (error.code !== 412) {
                    jks.common.warn();
                }
                info.text(error.message);
            });
    }

    function fetch(submitDone, cancelDone) {
        var dfd = $.Deferred();
        $.fetch.template("create").done(function(template) {
            var render = $(Mustache.render(template));
            var form = render.find("form");
            var content = form.find("textarea");
            var info = form.find(".info");
            var submitTrigger = render.find("#create-submit-trigger");
            var cancelTrigger = render.find("#create-cancel-trigger");

            attachKeyboardListener(content, info);
            submitTrigger.click(jks.common.oneExecTrigger(function() {
                return onSubmit(form, submitTrigger, content, info)
                    .done(submitDone);
            }));
            cancelTrigger.click(jks.common.oneExecTrigger(cancelDone));

            dfd.resolve(render);
        });
        return dfd.promise();
    }

    return {
        fetch: fetch
    };
}());

