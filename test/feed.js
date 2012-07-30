var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe ("Authorized API Access:", function(){

    it("Feed Request should return OK status", function(done) {
        request({
                url: config.url("/api/auth/feed?user=", config.testUser.id),
                headers: {"Authorization":
                    ["Basic-Custom ", config.testUser.id, ":",
                        config.testUser.password].join("")}
            },
            common.shouldBe200JsonFactory(done));
    });
});