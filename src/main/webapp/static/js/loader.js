var loader = loader || (function(){
    var cache;

    cache = {};
    return function(url, done, fail, dataType) {
        var c = cache[url];
        if (typeof fail !== "function") {
            dataType = fail;
        }
        if (c && c.isLoading) {
            c.done(done).fail(fail);
        } else if (c) {
            done && done(c);
        } else {
            c = cache[url] = $.Deferred().done(done).fail(fail);
            c.isLoading = true;

            $.ajax({
                url: url,
                cache: true,
                dataType: dataType
            })
                .done(function(data) {
                    cache[url] = data;
                    c.resolve.apply(this, arguments);
                })
                .fail(function() {
                    delete cache[url];
                    c.reject.apply(this, arguments);
                });
        }
    };
}());
