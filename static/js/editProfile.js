var jks = jks || {};
jks.editProfile = jks.editProfile || (function() {
    "use strict";

    var root, userId, form;

    function update(event) {
        var usernameInput = form.find('input[name="username"]');
        var emailInput = form.find('input[name="email"]');
        var nameInput = form.find('input[name="name"]');
        var trigger = form.find('input[type="submit"]');
        var info = form.find(".info");

        var spinner = jks.common.spinnerFactory().insertAfter(trigger);
        form.attr("disabled", true);

        $.post("/api/user/editProfile", {
              username: usernameInput.val()
            , email: emailInput.val()
            , name: nameInput.val()
            }, "json")
            .always(function() {
                spinner.remove();
                form.attr("disabled", false);
            })
            .fail(function(jqXHR) {
                var error = JSON.parse(jqXHR.responseText).error;
                if (error.code !== 412) {
                    jks.common.warn();
                }
                info.text(error.message)
                    .addClass("unvalidated").removeClass("validated");
            })
            .done(function(data) {
                info.text("Updated!")
                    .addClass("validated").removeClass("unvalidated");
            })
            ;

        event.preventDefault();
    }

    function fetch() {
        var dfd = $.Deferred();
        $.fetch.template("editProfile").done(function(template) {
            root = $(Mustache.render(template, jks.datacache.getUser(userId)));
            form = root.find("form").on("submit", update);
            dfd.resolve(root);
        });
        return dfd.promise();
    }

    return function(userId_) {
        userId = userId_;
        return { fetch: fetch };
    };
}());

