var jks = jks || {};
jks.register = jks.register || (function() {
    "use strict";

    var validated = {};
    var trigger = {};
    var doRegister;

    function spinnerFactoryFactory(src) {
        var baseImg = $("<img />");
        var pending = [];

        $.fetch.img(src)
            .done(function(img) {
                baseImg = img;
                pending.forEach(function(img) {
                    img.replaceWith(baseImg.clone());
                });
            })
            .fail(jks.common.warn)
            .always(function() {pending = undefined});
        
        return function() {
            var img = baseImg.clone();
            if (typeof pending !== "undefined") {
                pending.push(img);
            }
            return img;
        };
    }

    var spinnerFactory = spinnerFactoryFactory("ajax-loader.gif");

    function attachValidator(input, name, ensureUnique) {
        var spinner, value, pendingXHR, deferred;
        var info = $('<span class="info" />').insertAfter(input);

        validated[name] = false;

        function validationFailed(reason) {
            pendingXHR = undefined;
            spinner.remove();
            info.html(reason);
            input.removeClass("validated").addClass("unvalidated");
            if (deferred) {
                deferred.reject();
                deferred = undefined;
            }
        }

        function validationSucceeded() {
            pendingXHR = undefined;
            spinner.remove();
            info.html("");
            input.removeClass("unvalidated").addClass("validated");
            validated[name] = value;
            if (deferred) {
                deferred.resolve();
                deferred = undefined;
            }
        }

        function ignoreAbortElseTodo(jqXHR, errorText) {
            console.warn(arguments);
            if ("abort".localeCompare(errorText) !== 0) {
                jks.common.throwTodo.apply(this, arguments);
            }
        }

        function onValidate(data) {
            var requestParams = {};
            if(data.validation.status.localeCompare("ok") === 0) {
                if (ensureUnique) {
                    requestParams[name] = value;
                    pendingXHR = $.get("/api/public/findUser", requestParams)
                        .done(onFind)
                        .fail(ignoreAbortElseTodo);
                } else {
                    validationSucceeded();
                }
            } else {
                validationFailed(data.validation.reason);
            }
        }

        function capitalize(s) {
            return [s.charAt(0).toUpperCase(), s.slice(1)].join("");
        }

        function onFind(data) {
            if(data.user) {
                validationFailed(
                    [capitalize(name), "already in use"].join(" "));
            } else {
                validationSucceeded();
            }
        }

        function onFocusOut() {
            var requestParams = {};
            if (!pendingXHR) {
                if (input.val().localeCompare(value) !== 0) {
                    value = input.val();
                    validated[name] = false;
                    spinner = spinnerFactory().insertAfter(input);
                    info.html("");
                    requestParams[name] = value;
                    pendingXHR = $.get("/api/public/validate", requestParams)
                        .done(onValidate)
                        .fail(ignoreAbortElseTodo);
                }
            }
        }

        /* http://stackoverflow.com/a/8719681/141220 */
        function isSpecialKey(k) {
            if (k == 20 /* Caps lock */
                || k == 16 /* Shift */
                || k == 9 /* Tab */
                || k == 27 /* Escape Key */
                || k == 17 /* Control Key */
                || k == 91 /* Windows Command Key */
                || k == 19 /* Pause Break */
                || k == 18 /* Alt Key */
                || k == 93 /* Right Click Point Key */
                || ( k >= 35 && k <= 40 ) /* Home, End, Arrow Keys */
                || k == 45 /* Insert Key */
                || ( k >= 33 && k <= 34 ) /*Page Down, Page Up */
                || (k >= 112 && k <= 123) /* F1 - F12 */
                || (k >= 144 && k <= 145)) { /* Num Lock, Scroll Lock */
                return true;
            }
        }

        function onKeydown(event) {
            if (isSpecialKey(event.which)) {
                return;
            }
            
            if (pendingXHR) {
                spinner.remove();
                pendingXHR.abort();
                pendingXHR = undefined;
            }
            input.removeClass("validated unvalidated");
            info.html("");
            delete validated[name];
            value = undefined;
        }

        input.on("focusout", onFocusOut); 
        input.on("keydown", onKeydown); 

        return function() {
            deferred = $.Deferred();
            onFocusOut();
            return deferred.promise();
        }
    }

    function prepopulateUsernameFactory(input) {

        function handler(event) {
            var emailInput, username;
        
            if (input.val().length === 0) {
                emailInput = $(event.target);
                username = emailInput.val().split("@")[0];
                if (username) {
                    input.val(username);
                } else {
                    emailInput.one("focusout", handler);
                }
            }
        }

        return handler;
    }

    function registerHandlerFactory(button) {

        function doRegisterChecklist() {
            var unvalidatedCount = 3;
            $.each(validated, function(key, value) {
                if (value) {
                    unvalidatedCount -= 1;
                } else {
                    trigger[key]().done(doRegisterChecklist);
                }
            });

            if (unvalidatedCount === 0) {
                doRegister();
            }
        }

        function doRegister() {
            var spinner = spinnerFactory().insertAfter(button);
            button.parents("form").find("input").attr("disabled", true);
            $.post("/api/public/register", validated)
                .done(function() {
                    spinner.remove();
                    console.log("XXX do login");
                });
        }

        return function (event) {
            doRegisterChecklist();
            event.preventDefault();
        };
    }

    return { 
        bindEvents: function(div) {
            var form = div.children("form");

            [
                {name: "email"}, 
                {name:"username"}, 
                {name:"password", onlyValidate: true}
            ].forEach(function(field) {
                trigger[field.name] = attachValidator(
                    form.find(["input[name=", field.name, "]"].join('"')),
                    field.name, !field.onlyValidate);
            });

            form.find('input[name="email"]').one("focusout", 
                prepopulateUsernameFactory(
                    form.find('input[name="username"]')));

            div.on("submit", registerHandlerFactory(
                form.find('input[type="submit"]')));
        }
    };

}());
