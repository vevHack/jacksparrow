var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");
var $ = require("jQuery");

describe("Register", function() {

    function requestParamsFactory(postData) {
        return {
            method: "POST",
            url: config.url("/api/public/register"),
            form: postData
        };
    }

    /*
    function requestParamsFactory(postData) {
        return {
            method: "POST",
            url: config.url("/api/auth/create"),
            headers: {"Authorization": common.authHeader},
            form: postData
        };
    }
    */

    /*
    before(common.isServerUp.bind(common));
    */

    /*
    it("should not accept blank content", function(done) {
        request(
            requestParamsFactory({user:config.testUser.id, content:""}),
            common.shouldBeErrorFactory(412, "Content cannot be empty", done));
    });
    */

    function foo() {
        var dfd = $.Deferred();
        request(config.url("/api/ping"), 
                /*
            requestParamsFactory({
                username:"XXXrandom", 
                email: "foo@bar.com",
                password: "password"
            }),
            */
            function(error, response, body) {
                dfd.resolve(error, response, body);
            });
        return dfd.promise();
    }

                            /*
    shouldBe200JsonFactory: function(error, response, body) {
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
    };
 

    isServerUp: function(done) {
        request(config.url("/api/ping"), this.shouldBe200JsonFactory(done));
    },
    */
    it("should complete valid request", function(done) {
        foo().done(
            function(error, response, body) {
                console.log('test');
                done();
            }
            );
        /*
            function(error, 
            common.shouldBe200JsonFactory(function(done));
            */
    });

});
