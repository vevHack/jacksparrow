var jks = jks || {};
jks.register = {};

(function(exports) {

    var onEmailBlur = function(event) {
        console.log(this);
        console.log(event.target);
    }

    var onSubmit = function(event) {
        var form = $(event.target);
        console.log(this);
        console.log(event.target);
        event.preventDefault();
    };

    var bindEvents = function(div) {
        var form = div.children("form");

        div.on("submit", onSubmit);
        form.on("blur", 'input[name="email"]', onEmailBlur);
    };

    exports.bindEvents = bindEvents;
}(jks.register));

