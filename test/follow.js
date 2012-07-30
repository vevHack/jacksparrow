var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");
var $ = require("jquery");
var common2 = require("./_COMMON2.js");

describe ("Follow", function(){

    it("should return OK status",function(done){
        request({
                method: 'POST',
                url: config.url("/api/auth/follow"),
                headers: {"Authorization":
                    ["Basic-Custom ", config.testUser.id, ":", config.testUser.password].join("")
                },
                form:{user:config.testUser2.id}
            },
            common.shouldBe200JsonFactory(done));
    });

    it("should fail on missing argument", function(done) {
        common2.authJson({
            type: "POST",
            url: config.url("/api/auth/follow"),
            form: {}
        })
            .done(common2.shouldNotSucceed)
            .fail(common2.shouldBeErrorCodeFactory(400))
            .always(function(){done()});
    });

});