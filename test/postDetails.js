var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Post Details", function(){

    before(common.isServerUp.bind(common));

    function request(posts) {
        return $.getJSON(config.url("/api/post/details"), 
            $.param({post: posts}, true));
    }

    it("should ignore if no valid post", function(done) { 
        request([config.invalidPost.id])
            .done(function(data) { 
                data.should.have.property("posts");
                data.posts.should.be.instanceof(Array);
                data.posts.should.be.empty;
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });

    it("should return fields for valid post", function(done) { 
        var post = config.testPost;
        request([post.id])
            .done(function(data) {
                data.should.have.property("posts");
                data.posts.should.eql([config.testPost]);
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });
    
});

