var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe ("Authorized API Access:", function(){


    it("Should create a post and return OK status", function(done) {
        request({
                method: 'POST',
                url: config.url("/api/auth/create"),
                headers: {"Authorization":common.authHeader},
                form:{content:"post from test framework"}
            },
            common.shouldBe200BlankFactory(done));
    });




});