var jks = jks || {};

(function() {
    "use strict";

    function preload() {
        $.fetch.template("register");
        $.fetch.template("users");
    }

    function logout() {
        $.post("/api/session/destroy")
            .fail(jks.common.warn)
            .done(function() {
                window.location.replace("/");
            })
    }

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
                $("#logout").on("click", ".trigger", logout);
                $("#users").on("click", ".trigger", onUsersClick);
            });
    });
}());

