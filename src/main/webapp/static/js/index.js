define(["jquery-loader", "lib/mustache",
    "text!template/index.mustache"], function ($, Mustache, template) {
    $(function () {
        $('body').html(Mustache.render(template));
    });
});
