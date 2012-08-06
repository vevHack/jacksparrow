var jks = jks || {};
jks.login = jks.login || (function() {
    "use strict";

    function loginHandlerFactory(form) {
        var spinner, info, button;

        button = form.find('input[type="submit"]');

        function initLogin() {
            var email_or_username, findParams;

            if (info) {
                info.html("");
            }
            spinner = jks.common.spinnerFactory().insertAfter(button);
            button.attr("disabled", true);

            email_or_username = 
                form.find('input[name="email_or_username"]').val();
            findParams = {};
            findParams[ (email_or_username.indexOf("@") !== -1) ? 
                "email" : "username" ] = email_or_username;

            $.getJSON("/api/user/find", findParams)
                .fail(loginFailed)
                .done(function(data) {
                    $.post("/api/session/create", {
                        user: data.user.id,
                        password: form.find('input[type="password"]').val()
                    }, "json")
                        .fail(loginFailed)
                        .done(loginSucceeded);
                });
        }

        function loginFailed(jqXHR) {
            var data = JSON.parse(jqXHR.responseText);
            if ([401, 412].indexOf(data.error.code) !== -1) {
                info = info || $('<span class="info" />').insertAfter(button);
                info.html(data.error.message);
            } else {
                jks.common.warn(arguments);
            }
            button.attr("disabled", false);
            spinner.remove();
        }

        function loginSucceeded(data) {
            window.location.replace("/");
        }

        return function (event) {
            initLogin();
            event.preventDefault();
        };
    }

    return { 
        bindEvents: function(div) {
            var form = div.find("form");
            form.on("submit", loginHandlerFactory(form));
        }
    };

}());
