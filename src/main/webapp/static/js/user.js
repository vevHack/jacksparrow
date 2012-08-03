(function() {

    var names=new Array();
    $(function() {
        $.fetch.template("user").done(function(template) {
            $.ajax({
                url: "/api/auth/feed",
                headers: {"Authorization": ["Basic-Custom ", 5,
                    ":", "test"].join("")},
                data: {user:5}
            }).done( function(feedStore) {
                    $("body").html(
                        Mustache.render(template,feedStore));
                    $.when.apply($,
                         feedStore.feeds.map(function(feed, index){
                            return $.ajax({
                                url: "api/public/idtousername",
                                data: {id: feed.user}
                            }).done(function(resdata){
                                    names.push(resdata);
                                    feedStore.feeds[index].username
                                        = resdata.username;
                                });}
                        )).done(function() {
                              $.fetch.template("feed").done(function(template){
                                  $("#post_container").append($(
                                      Mustache.render(template,
                                          feedStore)));
                              });

                        });
                });
            });
    });

}());

