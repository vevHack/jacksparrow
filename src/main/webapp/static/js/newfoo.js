$(function() {
    var template;
    /*
    $.rloader([
        {src: "lib/mustache.js"},
        {src: "template/index.js", callback: function() {
            template;}
        },
        {event: "onready", func: function() {
            $("body").html(Mustache.render(template));
            */
    /*
    test case
    loader("static/js/lib/mustache.js", function() {
        console.log("mustache loaded");
        loader("static/template/index.mustache", function() {
            console.log("template loaded");
            loader("static/js/lib/mustache.js", function() {
                console.log("mustache loaded again");
            });
        });
    });
    */
    loader("static/js/lib/mustache.js", function() {
        console.log("mustache loaded: " + Mustache);
        loader("static/template/index.mustache", function(template) {
            console.log("template loaded: " + template);
            $("body").html(Mustache.render(template));
        }, 'text');
    });
});
