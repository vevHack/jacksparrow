var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe ("Authorized API Access:", function(){

    function shouldBe200JsonFactory(done) {
        return function(error, response, body) {
            should.not.exist(error);
            response.should.have.status(200);
            response.should.be.json;
            done();
        };
    }


    it("Feed Request should return OK status", function(done) {
        request({
            url: config.url("/api/auth/feed?user=", 5),
            headers: {"Authorization":
                ["Basic-Custom ", 5, ":test"].join("")}
        },
        common.shouldBe200JsonFactory(done));
    });

    it("Should create a post and return OK status", function(done) {
        request({
            method: 'POST',
            url: config.url("/api/auth/create"),
            headers: {"Authorization":common.authHeader},
            form:{content:"hellowww"}
            },
            common.shouldBe200BlankFactory(done));
    });


    it("Follow should return OK status",function(done){
        request({
            method: 'POST',
            url: config.url("/api/auth/follow"),
            headers: {"Authorization":
                ["Basic-Custom ", config.testUser.id, ":", config.testUser.password].join("")
            },
            form:{user:15}
        },
        shouldBe200JsonFactory(done));
    });

    it("unfollow should return OK status",function(done){
        request({
                method: 'POST',
                url: config.url("/api/auth/unfollow"),
                headers: {"Authorization":
                    ["Basic-Custom ", config.testUser.id, ":", config.testUser.password].join("")
                },
                form:{user:15}
            },
            shouldBe200JsonFactory(done));
    });



});