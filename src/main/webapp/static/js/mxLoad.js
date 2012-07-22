(function($) {
    $.mxLoad = (function(){
        var cache;

        cache = {};
        return function(url, done, fail, dataType) {
            var c = cache[url], deferred;
            if (typeof fail !== "function") {
                dataType = fail;
                if (typeof done !== "function") {
                    dataType = done;
                }
            }

            if (c && c.isLoading) {
                return c.done(done).fail(fail);
            } else if (c) {
                deferred = $.Deferred().done(function(){
                    done && done(c);
                });
                setTimeout($.proxy(deferred.resolve, this), 0);
                return deferred;
            } else {
                c = cache[url] = $.Deferred().done(done).fail(fail);
                c.isLoading = true;

                return $.ajax({
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
}(jQuery));
