var jks = jks || {};
$.extend(jks, {register: {}});

var throwTodo = function() {
    throw {
        name: "todoException",
        message: "XXX"
    };
};

(function(exports) {
    var emailLastValue = "";
    var emailAjaxPending = false;
    var validated = {};

    var g_spinner = $("<img />");

    var onEmailBlur = function(event) {
        var email, emailValue, spinner, errorMsg;
        var onValidate, onFind;

        if (emailAjaxPending) {
            return;
        }

        email = $(event.target);
        emailValue = email.val();

        if (emailValue.localeCompare(emailLastValue) !== 0) {
            spinner = g_spinner.clone().insertAfter(email);
            $.get("/api/public/validate", {email: emailValue})
                .done(onValidate)
                .fail(throwTodo);
        }

        onValidate = function(data) {/*XXX*/
            console.log(arguments);
        }
    }


    var onSubmit = function(event) {
        var form = $(event.target);
        console.log(this);
        console.log(event.target);
        event.preventDefault();
    };

    var bindEvents = function(div) {
        var form = div.children("form");

        $.fetch.img("ajax-loader.gif")
            .done(function(img) {
                g_spinner = img;
            });

        div.on("submit", onSubmit);
        form.on("blur", 'input[name="email"]', onEmailBlur);
    };

    exports.bindEvents = bindEvents;
}(jks.register));

