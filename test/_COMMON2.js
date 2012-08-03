var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");

module.exports = {

    logArguments: function() {
        console.log(arguments);
    },

    shouldNotSucceed: function(data, textStatus, jqXHR) {
        jqXHR.status.should.not.be(200);
        should.not.exist(data);
    },

    shouldNotFail: function(jqXHR, errorText, thrownError) {
        should.not.exist(thrownError);
        should.not.exist(JSON.parse(jqXHR.responseText));
    },

    dataShouldBeBlank: function(data, textStatus, jqXHR) {
        should.not.exist(data);
    },

    shouldBeEmptyJson: function(data, textStatus, jqXHR) {
        data.should.eql({});
    },

    shouldBeErrorCodeFactory: function(code) {
        return function(jqXHR, errorText, thrownError) {
            code.should.equal(jqXHR.status);
        };
    },

    shouldBeErrorFactory: function(code, msg) {
        return function(jqXHR, errorText, thrownError) {
            code.should.equal(jqXHR.status);
            JSON.parse(jqXHR.responseText).should.eql({
                error: {
                    code: code,
                    message: msg
                }
            });
        };
    },

    authHeader: {"Cookie": ["API-ACT", config.testUser.accessToken].join("=")},

    authJson: function(options) {
        if (typeof options === 'string') {
            options = {url: options};
        }
        return $.ajax($.extend({ 
                    "headers": this.authHeader,
                    "dataType": "json"
                }, options));
    },

    authJsonPost: function(options) {
        if (typeof options === 'string') {
            options = {url: options};
        }
        return this.authJson($.extend(options, {type: "POST"}));
    },

    isServerUp: function(done) {
        $.getJSON(config.url("/api/ping"))
            .fail(this.shouldNotFail)
            .always(function(){done()});
    }
};

