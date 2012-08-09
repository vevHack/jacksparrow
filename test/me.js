var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");
var ajaxWithCookieFactory = require("./util/ajaxWithCookieFactory")


describe("Me", function() {
    
    before(common.isServerUp.bind(common));

    it("should get self using Authentication Header", function(done) {
        common.createSession()
            .done(function(access_token) {
                common.authJson(access_token, config.url("/api/me"))
                    .done(function(data) {
                        data.should.have.property("user");
                        data.user.should.have.property("id");
                        data.user.should.have.property("username");
                        data.user.id.should.equal(config.testUser.id);
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done()});
            });
    });

});
