var jks = jks || {};
jks.unknownUser = jks.unknownUser || (function() {
    "use strict";

    function load() {
        $.when(
            $.fetch.template("unknownUser").done(function(template) {
                $("body").html(Mustache.render(template));
            })
            ,
            $.fetch.js("authenticate")
            ).done(function(data) {
                jks.authenticate.load($("#authenticate"));
            });
    }

    return {
        load: load
    };
}());

$(function() {
    jks.common.attachWarnToFetchFailure();
    jks.unknownUser.load($("body"));
});
