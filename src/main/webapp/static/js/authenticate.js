var jks = jks || {};

(function() {

    var nop = new Function("");

    function preload() {
        $.fetch.template("register");
        $.fetch.js("register");
        $.fetch.img("ajax-loader.gif")
    }

    function fadeReplaceFactory(selector, withSelector) {
    /* XXX ignore clicks ie disable triggers during anim? */
        return function() {
            var temp;
        /* XXX
            $(selector).fadeOut("fast", function() {
                $(withSelector).fadeIn("fast");
            });
            */
            $(selector).hide();
            $(withSelector).show();

            temp = selector;
            selector = withSelector;
            withSelector = temp;
        };
    }

    var toggleLoginRegister = fadeReplaceFactory("#login", "#register");

    var onShowRegister = (function() {
        var action;

        function firstTime() {
            $.when(
                $.fetch.template("register"),
                $.fetch.js("register")
                )
                .done(function() {
                    var template = arguments[0][0];
                    $("#register")
                        .prepend(Mustache.render(template))
                        .on("click", ".trigger", onShowLogin);
                    jks.register.bindEvents($("#register"));

                    action = toggleLoginRegister;
                    action();

                    /* XXX Restore Focus even after multiple switches
                       between login/register */
                    $("#register").find('input[name="email"]').focus();
                });
            action = nop;
        }

        action = firstTime;
        return function(event) {
            action(event);
            event.preventDefault();
        };
    }());

    var onShowLogin = function() {
        toggleLoginRegister();
        event.preventDefault();
    }

    var onLogin = function() {
        console.log("you clicked login");
        return false;
    };

/* TODO XXX HANDLE FAILURES */
    $(function() {
        var authFetched;

        authFetched = $.fetch.template("authenticate")
            .done(function(template) {
                $("body").html($(Mustache.render(template))
                    .filter("#register").hide().end());
                $("#login").on("click", ".trigger", onShowRegister);
            });

        $.when(
            authFetched,
            $.fetch.template("login")
        ).done(function(){
            var template = arguments[1][0];
            $("#login")
                .prepend(Mustache.render(template))
                .on("submit", onLogin)
                .find('input[name="email_or_username"]').focus();
        });

        preload();
    });
}());

