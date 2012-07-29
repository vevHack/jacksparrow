var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

describe("FindUser", function() {

    before(common.isServerUp.bind(common));

    it("should find existing user from username", function(done) {
        $.post("http://localhost:8080/api/public/findUser", 
            {username: config.testUser.username}, "json")
        .done(function(data, textStatus, jqXHR) {
            data.should.have.property("user");
            data.user.should.have.property("id");
            data.user.id.should.equal(config.testUser.id);
        })
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });

    it("should not find user from non-existent username", function(done) {
        $.post("http://localhost:8080/api/public/findUser", 
            {username: ["foo", Math.random()].join("")}, "json")
        .done(function(data, textStatus, jqXHR) {
            data.should.not.have.property("user");
        })
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });

    it("should find existing user from email", function(done) {
        $.post("http://localhost:8080/api/public/findUser", 
            {email: config.testUser.email}, "json")
        .done(function(data, textStatus, jqXHR) {
            data.should.have.property("user");
            data.user.should.have.property("id");
            data.user.id.should.equal(config.testUser.id);
        })
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });

    it("should not find user from non-existent email", function(done) {
        $.post("http://localhost:8080/api/public/findUser", 
            {email: ["foo", Math.random(), "@bar.com"].join("")}, "json")
        .done(function(data, textStatus, jqXHR) {
            data.should.not.have.property("user");
        })
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });


    it("should ignore when neither username nor email is provided", 
        function(done) {
            $.post("http://localhost:8080/api/public/findUser", {}, "json")
                .done(common.shouldBeEmptyJson)
                .fail(common.shouldNotFail)
                .always(function(){done()});
    });

    it("should match when both username nor email is provided", function(done) {
        $.post("http://localhost:8080/api/public/findUser", {
                username: config.testUser.username, 
                email: config.testUser.email
            }, "json")
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
            $.post("http://localhost:8080/api/public/findUser", {
                username: config.testUser.username, 
                email: config.testUser2.email
            }, "json")
            .done(common.shouldBeEmptyJson)
            .fail(common.shouldNotFail)
            .always(function(){done()});
        });

});
