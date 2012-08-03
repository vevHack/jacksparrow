var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common2 = require("./_COMMON2.js");

describe ("Follow", function(){

    var followUrl=config.url("/api/auth/follow");
    before(common.isServerUp.bind(common));

    it("should return OK status",function(done){
        common.authJsonPost({
            url: followUrl,
            data: {user:config.testUser2.id}
        }, "json")
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });


    it("should fail on missing argument", function(done) {
        common.authJsonPost({
            url: followUrl,
            data: {}
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(400))
            .always(function(){done()});
    });

    it("should fail on non-existing user-to-follow", function(done) {
        common.authJsonPost({
            url: followUrl,
            data: {user:config.invalidUser.id}
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(412))
            .always(function(){done()});
    });

});
