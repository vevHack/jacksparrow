var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");

module.exports = {

    shouldNotHappen: function(jqXHR, errorText, thrownError) {
        should.not.exist(thrownError);
        should.not.exist(JSON.parse(jqXHR.responseText));
    },

    dataShouldBeBlank: function(data, textStatus, jqXHR) {
        should.not.exist(data);
    },

    errorShouldBeFactory: function(code, msg) {
        return function(data, textStatus, jqXHR) {
            jqXHR.status.should.be(code);
            data.should.eql({
                error: {
                    code: code,
                    message: msg
                }
            });
        };
    },

    setAuthHeader: function(xhr) {
        xhr.setRequestHeader("Authorization", 
                ["Basic-Custom ", config.testUser.id, ":", 
                config.testUser.password].join(""));
    },

    isServerUp: function(done) {
        $.getJSON(config.url("/api/ping"))
            .fail(this.shouldNotHappen)
            .always(function(){done()});
    }
};

