var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Feed", function(){

    before(common.isServerUp.bind(common));

    it("should return feed of authenticated user", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                function keepFetchingTillFound(feed, id, start) {
                    var i;
                    for (i = 0; i < feed.length; i += 1) {
                        if (feed[i].id === id) {
                            done();
                            return;
                        }
                    }
                    common.authJson(access_token, {
                        url: config.url("/api/user/feed"),
                        data: { start: start }
                    })
                        .done(function(data) {
                            data.feed.should.not.be.empty; 
                            keepFetchingTillFound(data.feed, id, data.end);
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
                        data.should.have.property("start");
                        should.exist(Date.parse(data.start));
                        data.should.have.property("end");
                        should.exist(Date.parse(data.end));

                        keepFetchingTillFound(data.feed, 
                            config.testPost.id, data.end);
                    })
            });
    });

    it("should not return feeds previous to 'start'", function(done) {
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"),
                    data: { start: config.testPost.created_on }
                })
                    .done(function(data) {
                        data.should.have.property("feed");
                        data.feed.should.be.instanceof(Array);
                        data.feed.should.be.empty;
                        data.should.have.property("now");
                        data.should.not.have.property("start");
                        data.should.not.have.property("end");
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done();});
            });
    });

    it("should return feeds just previous to 'start'", function(done) {
        var start = new Date(Date.parse(config.testFeed.added_on) + 1)
                        .toISOString();
        common.createSession(config.testUser)
            .done(function(access_token) {
                common.authJson(access_token, {
                    url: config.url("/api/user/feed"), 
                    data: { start: start }
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
