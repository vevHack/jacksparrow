(function() {

    function preload() {
        $.fetch.template("register");
        $.fetch.template("users");
    }

    var onRegisterClick = (function() {
        var action;

        function firstTime() {
            $.fetch.template("register").done(function(template) {
                $("#register").append($(Mustache.render(template)).hide())
                show();
                action = hide;
            });
            action = pending;
        }

        function hide() {
            $("#register >form").hide("slow", function() {
                action = show;
            });
        }

        function show() {
            $("#register >form").show("slow", function() {
                action = hide;
            });
        }

        function pending() {
            $("#info").hide()
                .html(
                    $("<span>The goodies are on their way..., Please wait.<span>"))
                .show("slow", function() {
                    setTimeout($.proxy(function() {
                        this.hide("slow");
                    }, $(this)), 2000)
                });
        }

        return function () {
            action();
            return false;
        }
    }());

    var onUsersClick = (function() {
        var action;

        function firstTime() {
            $.when(
                $.fetch.template("users"),
                $.get("/users")
            ).done(function () {
                    $("#users").append($(Mustache.render(arguments[0][0],
                        { users:arguments[1][0] })).hide());
                    show();
                    action = hide;
                });
        }

        function hide() {
            $("#users >ul").hide("slow", function() {
                action = show;
            });
        }

        function show() {
            $("#users >ul").show("slow", function() {
                action = hide;
            });
        }

        action = firstTime;
        return function () {
            action();
            return false;
        }
    }());

    $(function() {
        $.fetch.template("index").done(function(template) {
                preload();
                $("body").html(Mustache.render(template));
                $("#register").on("click", ".trigger", onRegisterClick);
                $("#users").on("click", ".trigger", onUsersClick);
            });
    });
}());

