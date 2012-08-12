var jks = jks || {};
jks.userDetails = jks.userDetails || (function() {
    "use strict";

    var template;
    function show(user) {
        $("#detail").html(Mustache.render(template, user));
    }

    return {
          setTemplate: function (t) { template = template || t; }
        , show: show
    };
}());
