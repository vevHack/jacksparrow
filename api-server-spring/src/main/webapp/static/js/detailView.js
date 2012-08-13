var jks = jks || {};
jks.detailView = jks.detailView || (function() {
    "use strict";

    var template = {};
    var root;

    function load(container) {
        root = container;
        return $.when(
            ["user", "post"].map(function(type) {
                return $.fetch.template([type, "Details"].join(""))
                    .done(function(template_) {
                        template[type] = template_;
                    });
            })
            , 
            $.fetch.js("datacache")
            ).done(function() {
                root.on("click", "#close-detail-trigger", hide);
            });
    }

    function show(type, id) {
        root.hide()
            .html(Mustache.render(template[type], jks.datacache.get(type, id)))
            .fadeIn();
    }

    function hide() {
        root.fadeOut(function() {root.html("")});
        root.trigger("detail-closed");
    }

    return {
          load: load
        , show: show
        , hide: hide
    };
}());
