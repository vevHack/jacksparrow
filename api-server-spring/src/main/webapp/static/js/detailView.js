var jks = jks || {};
jks.detailView = jks.detailView || (function() {
    "use strict";

    var template = {};
    var me;
    var root, closeListener, paddingTop;

    function load(container) {
        root = container;
        paddingTop = parseInt(root.parent().css("padding-top"));

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
                root.on("click", "#close-detail-trigger", function() {
                    hide();
                    closeListener && closeListener();
                    event.preventDefault();
                });
            });
    }

    function alignTo(toDiv) {
        var height = root.height();
        var divTop = toDiv.offset().top;
        var divHeight = toDiv.height();
        var newTop = divTop - paddingTop - (height/2) + (divHeight/2);
        if (newTop < 0) {
            newTop = 0;
        }
        root.css("margin-top", newTop);
    }


    function show(type, div, closeListener_) {
        closeListener = closeListener_;
        var entity = jks.datacache.get(type, div.data("id"));
        root.hide()
            .html(Mustache.render(template[type], entity))
            .fadeIn();
        alignTo(div);
    }

    function hide() {
        root.fadeOut(function() {root.html("")});
    }

    return {
          load: load
        , show: show
        , hide: hide
    };
}());
