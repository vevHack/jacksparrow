var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe("Authorization", function() {
    
    before(common.isServerUp.bind(common));

    describe("#Public API", function() {
        it("should not require authorization", function(done) {
            request(
                config.url("/api/public/followers?user=", config.testUser.id), 
                common.shouldBe200JsonFactory(done));
        });
    });

    describe("#Authorized API", function() {

        it("should require authorization", function(done) {
            request(
                config.url("/api/auth/feed?user=", config.testUser.id), 
                common.shouldBeErrorFactory(401, 
                    "No 'Authorization' header", done));
        });

        it("should have format 'Authorization: Basic-Custom user:password'", 
            function(done) {
                request({
                    url: config.url("/api/auth/feed?user=", config.testUser.id), 
                    headers: {"Authorization": ""}
                },
                common.shouldBeErrorFactory(401, 
                    "Malformed 'Authorization' header", done));
            });


        it("should expect Authorization type Basic-Custom", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": "Basic 0:foo"}
                },
                common.shouldBeErrorFactory(401, 
                    "Expect Authorization type 'Basic-Custom'", done));
        });

        it("should reject invalid user", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.invalidUser.id, ":test"].join("")}
                },
                common.shouldBeErrorFactory(401, "Invalid credentials", done));
        });

        it("should reject invalid password", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.testUser.id, ":", 
                        config.testUser.password, "foo"].join("")}
                },
                common.shouldBeErrorFactory(401, "Invalid credentials", done));
        });

        it("should authenticate valid user", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": common.authHeader}
                },
                common.shouldBe200JsonFactory(done));
        });

    });

});
