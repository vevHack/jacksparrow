var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var $ = require("jquery");

describe ("ID -> Username", function(){

    var idUnameUrl=config.url("/api/public/idtousername");

    before(common.isServerUp.bind(common));

    it("should return OK status", function(done) {
        common.authJsonPost({
            type: "GET",
            url: idUnameUrl,
            data: {id:config.testUser.id}
        })
            .fail(common.shouldNotFail)
            .always(function(){done();});

    });


    it("should not pass if user with the given id doesn't exist",
        function(done) {
            common.authJsonPost({
                type: "GET",
                url: idUnameUrl,
                data: {id:config.invalidUser.id}
            })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorCodeFactory(412))
                .always(function(){done();});

        });

});
