var $ = require("jquery");
var should = require("should");
var config = require("./config");
var ajaxWithCookieFactory = require("./ajaxWithCookieFactory")

function ajaxWithCookieRequestAsUser(asUser) {
    var ajaxWithCookie = ajaxWithCookieFactory();
    var deferred = $.Deferred();
    ajaxWithCookie.go({
        type: "POST",
        url: config.url("/api/session/create"),
        data: { user: asUser.id, password: asUser.password }
    })
    .fail(this.shouldNotFail)
    .done(function() {
        deferred.resolve(ajaxWithCookie);
    });
    return deferred.promise();
}


module.exports = {

    logArguments: function() {
        console.log(arguments);
    },

    shouldNotSucceed: function(data, textStatus, jqXHR) {
        jqXHR.status.should.not.equal(200);
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

    authAjax: function(token, options) {
        if (typeof options === 'string') {
            options = {url: options};
        }
        return $.ajax($.extend({ 
            headers: {"Authorization": ["API-ACT", token].join(" ")},
        }, options));
    },

    authJson: function(token, options) {
        if (typeof options === 'string') {
            options = {url: options};
        }
        return this.authAjax(token, $.extend(options, {dataType: "json"}));
    },

    authJsonPost: function(token, options) {
        if (typeof options === 'string') {
            options = {url: options};
        }
        return this.authJson(token, $.extend(options, {type: "POST"}));
    },

    isServerUp: function(done) {
        $.getJSON(config.url("/api/ping"))
            .fail(this.shouldNotFail)
            .always(function(){done()});
    },

    ajaxWithCookieRequest: function() { 
        return ajaxWithCookieRequestAsUser(config.testUser); 
    },

    createSession: function(user) {
        if (typeof user === 'undefined') {
            user = config.testUser;
        }
        var deferred = $.Deferred();
        $.ajax({
            type: "POST",
            url: config.url("/api/session/create"),
            data: { user: user.id, password: user.password },
            dataType: "json"
        })
            .fail(this.shouldNotFail)
            .done(function(data) {
                deferred.resolve(data.session.access_token);
            });
        return deferred.promise();
    }

};

