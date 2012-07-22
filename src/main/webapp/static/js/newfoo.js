var jacksparrow; /* our application namespace */
$(function(){
    jacksparrow = $.extend(jacksparrow || {}, {
        jsUrl: function(js) {
            return ["static/js/", js, ".js"].join("");
        },
        templateUrl: function(template) {
            return ["static/template/", template, ".mustache"].join("");
        }
    });
}());
$(function() {
    /*XXX: this block has dependency on above block*/
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

    $.mxLoad(jacksparrow.jsUrl("lib/mustache"), function() {
        console.log("mustache loaded: " + Mustache);
        $.mxLoad(jacksparrow.templateUrl("index"), function(template) {
            console.log("template loaded: " + template);
            //$("body").html(Mustache.render(template));
        }, 'text');
    });
    console.log('test');
});
