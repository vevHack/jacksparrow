var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Create", function() {

    before(common.isServerUp.bind(common));

    it("should not accept invalid content", function(done) {
        common.createSession()
            .done(function(access_token) {
                common.authJsonPost(access_token, {
                    url: config.url("/api/post/create"), 
                    data: {content: ""}
                })
                    .done(common.shouldNotSucceed)
                    .fail(common.shouldBeErrorFactory(412, 
                        "Content cannot be blank"))
                    .always(function(){done();});
                    });
    });

 
    it("should accept valid content", function(done) {

        function shouldBePresentFactory(attribute, id) {
            return function(data) {
                var i, len;
                data[attribute].should.be.instanceof(Array);
                len = data[attribute].length;
                for (i = 0; i < len; i += 1) {
                    if (data[attribute][i].id === id) {
                        break;  
                    }
                }
                i.should.not.be.equal(len, 
                    [id, "not present in", data[attribute]].join(" "));
            }
        }

        function shouldBePresentInPostsAndFeeds(pid, me, follower, done) {
            function checkInFeed(user) {
                var deferred = $.Deferred();
                common.createSession(user)
                    .done(function(access_token) {
                        common.authJson(access_token, 
                            config.url("/api/user/feed"))
                            .done(shouldBePresentFactory("feed", pid))
                            .done(deferred.resolve)
                            .fail(deferred.reject)
                    })
                    .fail(deferred.reject);
                return deferred.promise();
            }

            $.when(
                $.getJSON(config.url("/api/user/posts"), {user: me.id})
                    .done(shouldBePresentFactory("posts", pid)),
                checkInFeed(me),
                checkInFeed(follower)
            )
            .fail(common.shouldNotFail)
            .always(function(){done();});
        }

        var content = "here be dragons";
        /* testUser follows testUser2 */
        common.createSession(config.testUser2)
            .done(function(access_token) {
                common.authJsonPost(access_token, {
                    url: config.url("/api/post/create"), 
                    data: {content: content}
                })
                .fail(common.shouldNotFail)
                .done(function(data) {
                    data.should.have.property("post");
                    data.post.should.have.property("id");
                    data.post.should.have.property("user");
                    data.post.user.should.have.property("id");
                    data.post.user.id.should.equal(config.testUser2.id);

                    shouldBePresentInPostsAndFeeds(data.post.id, 
                        config.testUser2, config.testUser, done);
                });
        });
    });

});
