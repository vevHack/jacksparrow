var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Feed", function(){

    before(common.isServerUp.bind(common));

    it("should return feed of authenticated user", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJsonPost(access_token, config.url("/api/user/feed"))
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.be.instanceof(Array);
                        data.feed.should.includeEql(config.testPost);
                        data.should.have.property("now");
                        should.exist(new Date(data.now));
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done();});
            });
    });

});
