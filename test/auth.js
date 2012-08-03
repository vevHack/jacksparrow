var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var ajaxWithCookieFactory = require("./_ajaxWithCookieFactory.js")


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
            var ajaxWithCookie = ajaxWithCookieFactory();
            ajaxWithCookie.go({
                type: "POST",
                url: config.url("/api/session/create"),
                data: {
                    user: config.testUser.id, 
                    password: config.testUser.password
                }
            })
                .fail(common.shouldNotFail)
                .done(function() {
                    ajaxWithCookie.go(apiRequiringAuthorization)
                        .fail(common.shouldNotFail)
                        .always(function(){done()});
                    });
        });

    });

});
