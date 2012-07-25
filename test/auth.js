var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./TEST_CONFIG.js");

describe("Authorization", function() {

    function shouldBe200JsonFactory(done) {
        return function(error, response, body) {
            should.not.exist(error);
            response.should.have.status(200);
            response.should.be.json;
            done();
        };
    }

    before(function(done) {
        request(config.url("/api/ping"), shouldBe200JsonFactory(done));
    });

    describe("#Public API", function() {
        it("should not require authorization", function(done) {
            request(
                config.url("/api/public/followers?user=", config.testUser.id), 
                shouldBe200JsonFactory(done));
        });
    });

    describe("#Authorized API", function() {

        function shouldRespondWithErrorFactory(code, msg, done) {
            return function(error, response, body) {
                should.not.exist(error);
                response.should.have.status(code);
                response.should.be.json;
                JSON.parse(body).should.eql({
                    error: {
                        code: code,
                        message: msg
                    }
                });
                done();
            };
        }

        it("should require authorization", function(done) {
            request(
                config.url("/api/auth/feed?user=", config.testUser.id), 
                shouldRespondWithErrorFactory(401, 
                    "No 'Authorization' header", done));
        });

        it("should have format 'Authorization: Basic-Custom user:password'", 
            function(done) {
                request({
                    url: config.url("/api/auth/feed?user=", config.testUser.id), 
                    headers: {"Authorization": ""}
                },
                shouldRespondWithErrorFactory(401, 
                    "Malformed 'Authorization' header", done));
            });


        it("should expect Authorization type Basic-Custom", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": "Basic 0:foo"}
                },
                shouldRespondWithErrorFactory(401, 
                    "Expect Authorization type 'Basic-Custom'", done));
        });

        it("should reject invalid user", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.invalidUser.id, ":test"].join("")}
                },
                shouldRespondWithErrorFactory(401, 
                    "Invalid credentials", done));
        });

        it("should reject invalid password", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.testUser.id, ":", 
                        config.testUser.password, "foo"].join("")}
                },
                shouldRespondWithErrorFactory(401, 
                    "Invalid credentials", done));
        });

        it("should authenticate valid user", function(done) {
            request({
                url: config.url("/api/auth/feed?user=", config.testUser.id), 
                headers: {"Authorization": 
                    ["Basic-Custom ", config.testUser.id, ":", 
                        config.testUser.password].join("")}
                },
                shouldBe200JsonFactory(done));
        });

    });

});
