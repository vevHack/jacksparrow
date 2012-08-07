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
                    if (data[attribute].id === id) {
                        break;  
                    }
                }
                i.should.be.equal(len, 
                    [id, "not present in", data[attribute]].join(" "));
            }
        }

        var content = "here be dragons";
        var uid = config.testUser.id;
        common.createSession()
            .done(function(access_token) {
                common.authJsonPost(access_token, {
                    url: config.url("/api/post/create"), 
                    data: {content: content}
                })
                    .fail(common.shouldNotFail)
                    .done(function(data) {
                        var pid;
                        data.should.have.property("post");
                        data.post.should.have.property("id");
                        data.post.should.have.property("user");
                        data.post.user.should.have.property("id");
                        data.post.user.id.should.equal(uid);

                        pid = data.post.id;
                        $.when(
                            $.getJSON(config.url("/api/user/posts"), {user: uid})
                                .done(shouldBePresentFactory("posts", pid)),
                            common.authJson(access_token, 
                                config.url("/api/user/feed"))
                                .done(shouldBePresentFactory("feed", pid))
                        )
                            .fail(common.shouldNotFail)
                            .always(function(){done();});
                    });
            });
    });

});
