var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Feed", function(){

    before(common.isServerUp.bind(common));

    it("should return feed of authenticated user", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                function keepFetchingTillFound(feed, id, from) {
                    var i;
                    for (i = 0; i < feed.length; i += 1) {
                        if (feed[i].id === id) {
                            done();
                            return;
                        }
                    }
                    common.authJson(access_token, {
                        url: config.url("/api/user/feed"),
                        data: { upto: from }
                    })
                        .done(function(data) {
                            data.feed.should.not.be.empty; 
                            keepFetchingTillFound(data.feed, id, data.from);
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
                        data.should.have.property("from");
                        should.exist(Date.parse(data.from));

                        keepFetchingTillFound(data.feed, 
                            config.testPost.id, data.from);
                    })
            });
    });

    it("should not return feeds before 'from'", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"),
                    data: { upto: config.testPost.created_on }
                })
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.be.instanceof(Array);
                        data.feed.should.be.empty;
                        data.should.have.property("from");
                        Date.parse(config.testPost.created_on)
                            .should.be.eql(Date.parse(data.from));
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done();});
            });
    });

    it("should return feeds just before 'from'", function(done) {
        var from = new Date(Date.parse(config.testFeed.added_on) + 1)
                        .toISOString();
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"), 
                    data: { upto: from }
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
