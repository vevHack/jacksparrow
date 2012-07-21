define(["lib/mustache",
    "text!template/ride.mustache"], function (Mustache, template) {
    var view = {
        title:"Joe",
        calc:function () {
            return 2 + 4;
        }
    };

    console.log(template);
    var output = Mustache.render(template, view);
    console.log(output);
    return output;
});