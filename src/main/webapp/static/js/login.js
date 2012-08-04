var jks = jks || {};
jks.login = jks.login || (function() {
    "use strict";

    function loginHandlerFactory(form) {
        var spinner, info, button;

        button = form.find('input[type="submit"]');

        function initLogin() {
            var email_or_username, data;

            if (info) {
                info.html("");
            }
            spinner = jks.common.spinnerFactory().insertAfter(button);
            button.attr("disabled", true);

            email_or_username = 
                form.find('input[name="email_or_username"]').val();
            if (email_or_username.indexOf("@")

            $.post("/api/public/findUser", {
                password: form.find('input[type="password"]').val()
            })
                .done(loginSucceeded)
                .fail(loginFailed)
                .always(function() {
                    button.attr("disabled", false);
                    spinner.remove();
                });
        }

        function loginFailed(jqXHR) {
            var data = JSON.parse(jqXHR.responseText);
            if (data.error.code === 401) {
                info = info || $('<span class="info" />').insertAfter(button);
                info.html(data.error.message);
            } else {
                jks.common.warn(arguments);
            }
        }

        function loginSucceeded(data) {
            console.log(data);
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
