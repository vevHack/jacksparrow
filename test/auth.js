var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

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

        it("should require authorization", function(done) {
            $.getJSON(
                config.url("/api/auth/feed?user=", config.testUser.id))
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(
                        401, "No 'Authorization' header"))
                .always(function(){done()});
        });

        it("should have format 'Authorization: Basic-Custom user:password'", 
            function(done) {
            $.ajax({
                url: config.url("/api/auth/feed?user=", config.testUser.id),
                headers: {"Authorization": ""},
                dataType: "json"
                })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(
                            401, "Malformed 'Authorization' header"))
                .always(function(){done()});
        });

        it("should expect Authorization type Basic-Custom", function(done) {
            $.ajax({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": "Basic 0:foo"},
                dataType: "json"
                })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(
                    401, "Expect Authorization type 'Basic-Custom'"))
                .always(function(){done()});
        });

        it("should reject invalid user", function(done) {
            $.ajax({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.invalidUser.id, ":test"].join("")},
                dataType: "json"
                })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(401, "User does not exist"))
                .always(function(){done()});
        });

        it("should reject invalid password", function(done) {
            $.ajax({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.testUser.id, ":", 
                        config.testUser.password, "foo"].join("")},
                dataType: "json"
                })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(401, "Incorrect password"))
                .always(function(){done()});
        });

        it("should authenticate valid user", function(done) {
            common.authGetJson(
                config.url("/api/auth/feed?user=", config.testUser.id))
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });

    });

});
