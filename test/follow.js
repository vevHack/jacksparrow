var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");


describe("Feature Follow", function(){

    before(common.isServerUp.bind(common));

    [
     {name:"#Followers", url:"/api/user/followers", property:"followers"},
     {name:"#Following", url:"/api/user/following", property:"following"}
    ].forEach(function(feature) {
        describe(feature.name, function() {
            it("should expect existing user", function(done) {
                $.getJSON(config.url(feature.url), 
                    { user: config.invalidUser.id })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(412, "User not found"))
                .always(function(){done()});
            });

            it("should return array of " + feature.property, function(done) {
                $.getJSON(config.url(feature.url), { user: config.testUser.id })
                .done(function(data) {
                    data.should.have.property(feature.property)
                    data[feature.property].should.be.an.instanceOf(Array);
                })
                .fail(common.shouldNotFail)
                .always(function(){done()});
            });
        });
    });

    var access_token;
    before(function(done) {
        common.createSession().done(function(token) {
            access_token = token;
            done();
        });
    });

    function request(url, user) {
        return common.authJsonPost(access_token, {
            url: config.url(url), 
            data: { user: user.id }
        });
    }


    [
        { name: "#Follow", url: "/api/user/follow" },
        { name: "#Unfollow", url: "/api/user/unfollow" }
    ].forEach(function(feature) {

        describe(feature.name, function() {

            it("should expect existing user", function(done) { 
                request(feature.url, config.invalidUser)
                    .done(common.shouldNotSucceed)
                    .fail(common.shouldBeErrorFactory(412, "User not found"))
                    .always(function(){done()});
            });
        });

    });


    describe("#Follow", function() {

        it("should not follow own-self", function(done) { 
            request("/api/user/follow", config.testUser)
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, 
                "User cannot follow own-self"))
            .always(function(){done()});
        });

        it("should fail if already following user", function(done) { 
            request("/api/user/follow", config.testUser2)
                .always(function() {
                    request("/api/user/follow", config.testUser2)
                        .done(common.shouldNotSucceed)
                        .fail(common.shouldBeErrorFactory(412, 
                            "Already following user"))
                        .always(function(){done()});
                });
        });

        it("should follow previously unfollowed user", function(done) { 
            request("/api/user/unfollow", config.testUser2)
                .always(function() {
                    request("/api/user/follow", config.testUser2)
                        .done(common.shouldBeBlank)
                        .fail(common.shouldNotFail)
                        .always(function(){done()});
                });
        });

    });

    describe("#Unfollow", function() {

        it("should fail if not following user", function(done) { 
            request("/api/user/unfollow", config.testUser2)
                .always(function() {
                    request("/api/user/unfollow", config.testUser2)
                        .done(common.shouldNotSucceed)
                        .fail(common.shouldBeErrorFactory(412, 
                            "Not following user"))
                        .always(function(){done()});
                });
        });

        it("should unfollow previously followed user", function(done) { 
            request("/api/user/follow", config.testUser2)
                .always(function() {
                    request("/api/user/unfollow", config.testUser2)
                        .done(common.shouldBeBlank)
                        .fail(common.shouldNotFail)
                        .always(function(){done()});
                });
        });

    });

});
