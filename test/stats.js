var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Stats", function(){

    before(common.isServerUp.bind(common));

    function request(user) {
        return $.getJSON(config.url("/api/user/stats"), {user: user.id});
    }

    it("should fail if user is invalid", function(done) { 
        request(config.invalidUser)
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, "User not found"))
            .always(function(){done()});
    });

    it("should succeed if user is valid", function(done) { 
        request(config.testUser)
            .done(function(data) {
                data.should.have.property("stats");
                data.stats.should.have.property("user");
                data.stats.user.should.equal(config.testUser.id)
                data.stats.should.have.property("posts");
                data.stats.should.have.property("followers");
                data.stats.should.have.property("following");
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });

});
