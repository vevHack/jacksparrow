(function() {

    function preload() {
        $.fetch.template("register");
        $.fetch.template("users");
    }

    var onRegisterClick = (function() {
        var action;

        function firstTime() {
            $.fetch.template("register").done(function(template) {
                $("#register").append(Mustache.render(template));
                action = hide;
            });
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

        action = firstTime;
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
                    $("#users").append(Mustache.render(arguments[0][0],
                        { users:arguments[1][0] }));
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
        $.fetch.template("index")
            .done(function(template) {
                $("body").html(Mustache.render(template));
                $("#register").on("click", ".trigger", onRegisterClick);
                $("#users").on("click", ".trigger", onUsersClick);
            });
    });
}());

