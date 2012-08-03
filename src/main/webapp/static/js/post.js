(function() {

    $(function() {
        $.fetch.template("user").done(function(template){
            $.ajax({
                url: "/api/auth/posts",
                data: {user:5}
            }).done( function(posts) {
                    $("body").html(
                        Mustache.render(template,posts));
                    $.fetch.template("post").done(function(template) {
                        $("#post_container").html(Mustache.render(template));
                    });
            });

        });
    })

}());

