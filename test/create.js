var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe("Create", function() {

    function requestParamsFactory(postData) {
        return {
            method: "POST",
            url: config.url("/api/auth/create"),
            headers: {"Authorization": common.authHeader},
            form: postData
        };
    }

    before(common.isServerUp.bind(common));

    it("should not accept blank content", function(done) {
        request(
            requestParamsFactory({user:config.testUser.id, content:""}),
            common.shouldBeErrorFactory(412, "Content cannot be empty", done));
    });

    it("should complete valid request", function(done) {
        request(
            requestParamsFactory({user:config.testUser.id, content:"hello"}),
            common.shouldBe200BlankFactory(done));
    });

});
