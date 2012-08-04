var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("FindUser", function() {

    before(common.isServerUp.bind(common));

    function request(data) {
        return $.post(config.url("/api/user/find"), data, "json");
    }

    function shouldFind(field, user) {
        it("should find existing user from " + field, function(done) {
            var data = {};
            data[field] = user[field];
            request(data)
                .done(function(data, textStatus, jqXHR) {
                    data.should.have.property("user");
                    data.user.should.have.property("id");
                    data.user.id.should.equal(user.id);
                })
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    };

    function shouldNotFind(field, data) {
        it("should not find user from non-existent " + field, function(done) {
            request(data)
                .done(function(data, textStatus, jqXHR) {
                    data.should.not.have.property("user");
                })
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    }

    shouldFind("username", config.testUser);
    shouldNotFind("username", {username: ["foo", Math.random()].join("")});

    shouldFind("email", config.testUser);
    shouldNotFind("email", {email: ["foo", Math.random(), "@bar.com"].join("")});


    it("should ignore when neither username nor email is provided", 
        function(done) {
            request({})
                .done(common.shouldBeEmptyJson)
                .fail(common.shouldNotFail)
                .always(function(){done()});
    });

    it("should match when both username nor email is provided", function(done) {
        request({
            username: config.testUser.username, 
            email: config.testUser.email
        })
            .done(function(data, textStatus, jqXHR) {
                data.should.have.property("user");
                data.user.should.have.property("id");
                data.user.id.should.equal(config.testUser.id);
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });

    it("should ignore when username and email of different users is provided", 
        function(done) {
            request({
                username: config.testUser.username, 
                email: config.testUser2.email
            })
            .done(common.shouldBeEmptyJson)
            .fail(common.shouldNotFail)
            .always(function(){done()});
        });

});
