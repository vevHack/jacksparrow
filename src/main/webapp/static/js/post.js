(function() {

    $(function() {
        $.fetch.template("post").done(function(template) {
                $("body").html(Mustache.render(template));
            });
    });

}());

