var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");
var ajaxWithCookieFactory = require("./util/ajaxWithCookieFactory")


describe("Authorization", function() {
    
    before(common.isServerUp.bind(common));

    describe("#Public API", function() {
        it("should not require authorization", function(done) {
            $.getJSON(
                config.url("/api/public/followers?user=", config.testUser.id))
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    });

    describe("#Authorized API", function() {

        var apiRequiringAuthorization = 
            config.url("/api/auth/feed?user=", config.testUser.id);

        it("should expect API Access Token", function(done) {
            $.getJSON(apiRequiringAuthorization)
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(
                        401, "Missing API Access Token"))
                .always(function(){done()});
        });

        it("should reject invalid API Access Token", function(done) {
            var ajaxWithCookie = ajaxWithCookieFactory();
            ajaxWithCookie.addCookie("API-ACT=banana");
            ajaxWithCookie.go(apiRequiringAuthorization)
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(401, 
                    "Invalid API Access Token"))
                .always(function(){done()});
        });

        it("should accept valid API Access Token", function(done) {
            common.authRequest().done(function(cjax) {
                cjax.go(apiRequiringAuthorization)
                    .fail(common.shouldNotFail)
                    .always(function(){done()});
            });
        });

    });

});
