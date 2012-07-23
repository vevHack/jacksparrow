(function() {

    function preload() {
        $.fetch.template("register");
        $.fetch.template("users");
    }

    function onRegisterClick () {
        $.fetch.template("register").done(function(template) {
            $("#register").append(Mustache.render(template));
        });
        return false;
    }

    function onUsersClick() {
        $.when(
            $.fetch.template("users"),
            $.get("/users")
        ).done(function () {
                $("#users").append(Mustache.render(arguments[0][0],
                    { users:arguments[1][0] }));
            });
        return false;
    }

    $(function() {
        $.fetch.template("index").done(function(template) {
                preload();
                $("body").html(Mustache.render(template));
                $("#register").on("click", ".trigger", onRegisterClick);
                $("#users").on("click", ".trigger", onUsersClick);
            });
    });
}());

