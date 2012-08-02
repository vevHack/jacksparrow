var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var $ = require("jquery");

describe ("unfollow", function(){

    var unfollowUrl = config.url("/api/auth/unfollow");
    before(common.isServerUp.bind(common));

    it("should return OK status",function(done){
        common.authJsonPost({
            url: unfollowUrl,
            data: {user: config.testUser2.id}
        }, "json")
            .fail(common.shouldNotFail)
            .always(function(){done();});
    });

    function ErrorFactory(params, code) {
        return function (done) {
            common.authJsonPost(params)
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorCodeFactory(code))
                .always(function () {
                    done();
                });
        };
    }

    it("should return precondition failed", ErrorFactory({
        url:unfollowUrl,
        data:{user: config.invalidUser.id}
    }, 412));

    it("should return bad request error", ErrorFactory({url:unfollowUrl}, 400));

});