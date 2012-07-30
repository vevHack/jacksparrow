var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var $ = require("jquery");

describe ("unfollow:", function(){

    before(common.isServerUp.bind(common));

    it("should return OK status",function(done){
        $.ajax({
            type: "POST",
            url: config.url("/api/auth/unfollow"),
            headers: common.authHeader,
            data: {user: config.testUser2.id}
        }, "json")
            .fail(common.shouldNotFail)
            .always(function(){done();});

    });

    it("should return precondition failed", function(done){
        $.ajax({
            type: "POST",
            url: config.url("/api/auth/unfollow"),
            headers: common.authHeader,
            data: {user: config.invalidUser.id}
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(412))
            .always(function(){done();});

    });

    it("should return precondition failed", function(done){
        $.ajax({
            type: "POST",
            url: config.url("/api/auth/unfollow"),
            headers: common.authHeader
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(400))
            .always(function(){done();});

    });

});