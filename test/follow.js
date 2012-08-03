var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common2 = require("./_COMMON2.js");

describe ("Follow", function(){

    /* XXX BAD TEST */
    it("should return OK status", function(done){
        common2.authJson({
            type: 'POST',
            url: config.url("/api/auth/follow"),
            form:{user:config.testUser2.id}
        })
            .done(common2.dataShouldBeBlank)
            .fail(common2.shouldNotFail)
            .always(function(){done()});
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
