(function($) {
    $.fetch = $.fetch || {

        template:  function(template) {
            return $.ajax({
                url: ["static/template/", template, ".mustache"].join(""),
                cache: true,
                dataType: "text"
            });
        },

        js:  function(js) {
            return $.ajax({
                url: ["static/js/", js, ".js"].join(""),
                cache: true,
                dataType: "script"
            });
        }
    };
}(jQuery));
