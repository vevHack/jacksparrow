var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var $ = require("jquery");

describe ("unfollow", function(){

    var unfollowUrl=config.url("/api/auth/unfollow");
    before(common.isServerUp.bind(common));

    it("should return OK status",function(done){
        common.authJsonPost({
            url: unfollowUrl,
            data: {user: config.testUser2.id}
        }, "json")
            .fail(common.shouldNotFail)
            .always(function(){done();});
    });

    it("should return precondition failed", function(done){
        common.authJsonPost({
            url: unfollowUrl,
            data: {user: config.invalidUser.id}
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(412))
            .always(function(){done();});
    });

    it("should return bad request error", function(done){
        common.authJsonPost({
            url: unfollowUrl
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(400))
            .always(function(){done();});
    });

});