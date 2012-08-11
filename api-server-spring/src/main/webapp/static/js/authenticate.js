var jks = jks || {};
jks.authenticate = jks.authenticate || (function() {
    "use strict";

    function preload() {
        $.fetch.template("register");
        $.fetch.js("register");
        $.fetch.img("ajax-loader.gif")
    }

    function fadeReplaceFactory(selector, withSelector) {
        return function() {
            $(selector).hide();
            $(withSelector).show();

            var temp;
            temp = selector;
            selector = withSelector;
            withSelector = temp;
        };
    }

    var toggleLoginRegister = fadeReplaceFactory("#login", "#register");

    var onShowRegister = (function() {
        var action = function () {
            $.when(
                $.fetch.template("register"),
                $.fetch.js("register")
            )
            .done(function() {
                var template = arguments[0][0];
                var registerDiv = $("#register");

                registerDiv
                    .prepend(Mustache.render(template))
                    .on("click", ".trigger", onShowLogin);
                jks.register.bindEvents(registerDiv);

            action = toggleLoginRegister;
            action();

            /* XXX Restore Focus even after multiple switches
            between login/register */
            $("#register").find('input[name="email"]').focus();
            });
            action = jks.common.nop;
        }

        return function(event) {
            action(event);
            event.preventDefault();
        };
    }());

    var onShowLogin = function(event) {
        jks.register.abort();
        toggleLoginRegister();
        event.preventDefault();
    }

    function load() {
        var authFetched = $.fetch.template("authenticate")
            .done(function(template) {
                $("body").html($(Mustache.render(template))
                    .filter("#register").hide().end());
                    $("#login").on("click", ".trigger", onShowRegister);
            })

        $.when(
            authFetched,
            $.fetch.template("login"),
            $.fetch.js("login")
        ).done(function(){
            var template = arguments[1][0];
            var loginDiv = $("#login");

            loginDiv
                .prepend(Mustache.render(template))
                .find('input[name="email_or_username"]').focus();
            jks.login.bindEvents(loginDiv);
        });

        preload();
    };

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.authenticate.load();
});
