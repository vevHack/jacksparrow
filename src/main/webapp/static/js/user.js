(function() {

    $(function() {
        $.fetch.template("user").done(function(template) {
                $("body").html(Mustache.render(template));
            });
    });

}());

