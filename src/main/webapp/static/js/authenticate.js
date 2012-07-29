(function() {

    function preload() {
        $.fetch.template("register");
    }

    function fadeReplaceFactory(element, withElement) {
    /* XXX ignore clicks ie disable triggers during anim? */
        return function() {
        /* XXX
            element.fadeOut("fast", function() {
                withElement.fadeIn("fast");
            });
            */
            element.hide();
            withElement.show();
        };
    }

    var onShowRegister = (function() {
        var action;

        function firstTime() {
            $.fetch.template("register")
                .done(function(template) {
                    $("#register")
                        .prepend(Mustache.render(template));

                    $("#register").on("click", ".trigger", onShowLogin);
                    $("#register").on("submit", onRegister);

                    action = fadeReplaceFactory($("#login"), $("#register"));
                    action();
                });
        }

        action = firstTime;
        return function() {
            action();
            return false;
        };
    }());

    var onShowLogin = function() {
        var action = action || fadeReplaceFactory($("#register"), $("#login"));
        action();
        return false;
    }

    var onRegister = function() {
        console.log("you clicked register");
        return false;
    };

    var onLogin = function() {
        console.log("you clicked login");
        return false;
    };

/* TODO XXX HANDLE FAILURES */
    $(function() {
        var authFetched = $.fetch.template("authenticate")
            .done(function(template) {
                $("body").html(Mustache.render(template));
                $("#login").on("click", ".trigger", onShowRegister);
            });

        $.when(
            authFetched,
            $.fetch.template("login")
        ).done(function(){
            var template = arguments[1][0];
            $("#login")
                .prepend(Mustache.render(template))
                .on("submit", onLogin);
        });

        preload();
    });
}());

