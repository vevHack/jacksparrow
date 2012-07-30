var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var $ = require("jquery");

describe ("Feed", function(){

    var feedUrl=config.url("/api/auth/feed");
    before(common.isServerUp.bind(common));

    it("should return OK status", function(done) {
        common.authJsonPost({
            url: feedUrl,
            data: {user:config.testUser.id}
        })
            .fail(common.shouldNotFail)
            .always(function(){done();});

    });


    it("should not pass if callee and authorized user are different",
        function(done) {
        common.authJsonPost({
            url: feedUrl,
            data: {user:config.testUser2.id}
        })
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorCodeFactory(412))
            .always(function(){done();});

    });

});