(function() {

    var names=new Array();
    $(function() {
        $.fetch.template("user").done(function(template) {
            $.ajax({
                url: "/api/auth/feed",
                headers: {"Authorization": ["Basic-Custom ", 5,
                    ":", "test"].join("")},
                data: {user:5}
            }).done( function(responseData) {
                    $("body").html(
                        Mustache.render(template,responseData));
                    $.when(
                        responseData.feeds.map(function(feed, index){
                                return $.ajax({
                                    type: "POST",
                                    url: "api/public/idtousername",
                                    data: {id: feed.user}
                                }).done(function(resdata){
                                        names.push(resdata);
                                        responseData.feeds[index].username
                                            = resdata.username;
                                    });}
                        )).done(function() {
                              $.fetch.template("feed").done(function(template){
                                  $("div").append($(
                                      Mustache.render(template,
                                          responseData)));
                              });

                        });
                });
            });
    });

}());

