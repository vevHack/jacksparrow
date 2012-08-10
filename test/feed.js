var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Feed", function(){

    before(common.isServerUp.bind(common));

    it("should return feed of authenticated user", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                function keepFetchingTillFound(feed, id, olderThan) {
                    var i;
                    for (i = 0; i < feed.length; i += 1) {
                        if (feed[i].id === id) {
                            done();
                            return;
                        }
                    }
                    common.authJson(access_token, {
                        url: config.url("/api/user/feed"),
                        data: { olderThan: olderThan }
                    })
                        .done(function(data) {
                            data.feed.should.not.be.empty; 
                            keepFetchingTillFound(data.feed, id, data.oldest);
                        })
                        .fail(function() {
                            common.shouldNotFail.apply(arguments);
                            done();
                        });
                };

                common.authJson(access_token, config.url("/api/user/feed"))
                    .fail(common.shouldNotFail)
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.be.instanceof(Array);
                        data.should.have.property("now");
                        should.exist(Date.parse(data.now));
                        data.should.have.property("newest");
                        should.exist(Date.parse(data.newest));
                        data.should.have.property("oldest");
                        should.exist(Date.parse(data.oldest));

                        keepFetchingTillFound(data.feed, 
                            config.testPost.id, data.oldest);
                    })
            });
    });

    it("should not allow both olderThan and newerThan", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"),
                    data: { 
                          olderThan: new Date().toISOString()
                        , newerThan: new Date().toISOString()
                    }
                })
                    .done(common.shouldNotSucceed)
                    .fail(common.shouldBeErrorFactory(412, 
                    "Cannot filter on both olderThan and newerThan timestamps"))
                    .always(function(){done();});
            });
    });

    it("should not return feeds older than 'olderThan'", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"),
                    data: { olderThan: config.testPost.created_on }
                })
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.be.instanceof(Array);
                        data.feed.should.be.empty;
                        data.should.have.property("now");
                        data.should.not.have.property("newest");
                        data.should.not.have.property("oldest");
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done();});
            });
    });

    it("should return feeds older than perturbed 'olderThan'", function(done) {
        var olderThan = new Date(Date.parse(config.testFeed.added_on) + 1)
                        .toISOString();
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"), 
                    data: { olderThan: olderThan }
                })
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.includeEql(config.testPost);
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done();});
            });
    });

});
