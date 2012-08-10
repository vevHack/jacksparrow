var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Posts", function(){

    before(common.isServerUp.bind(common));

    function request(user) {
        return $.getJSON(config.url("/api/user/posts"), {user: user.id});
    }

    it("should expect existing user", function(done) { 
        request(config.invalidUser)
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, "User not found"))
            .always(function(){done()});
    });

    it("should return array of posts of given user", function(done) {
        request(config.testUser)
            .done(function(data) {
                data.should.have.property("posts");
                data.posts.should.be.instanceof(Array);
                data.posts.should.includeEql(config.testPost);
                data.should.have.property("now");
                should.exist(Date.parse(data.now));
            })
            .fail(common.shouldNotFail)
            .always(function(){done();});
    });

    it("should not return posts older than 'olderThan'", function(done) {
        $.getJSON(config.url("/api/user/posts"), {
            user: config.testUser.id,
            olderThan: config.testPost.created_on
        })
            .done(function(data) {
                data.should.have.property("posts");
                data.posts.should.be.instanceof(Array);
                data.posts.should.be.empty;
                data.should.have.property("now");
                data.should.not.have.property("newest");
                data.should.not.have.property("oldest");
            })
            .fail(common.shouldNotFail)
            .always(function(){done();});
    });

    it("should return posts older than perturbed 'olderThan'", function(done) {
        var olderThan = new Date(Date.parse(config.testFeed.added_on) + 1)
                        .toISOString();
        $.getJSON(config.url("/api/user/posts"), {
            user: config.testUser.id,
            data: { olderThan: olderThan }
        })
            .done(function(data) {
                data.should.have.property("posts");
                data.posts.should.includeEql(config.testPost);
            })
            .fail(common.shouldNotFail)
            .always(function(){done();});
    });

});
