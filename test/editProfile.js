var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Edit Profile", function() {

    before(common.isServerUp.bind(common));

    function generateRandomUser() {
        var makeUnique = Math.random();
        var prefix = "foo";
        return {
            username: prefix + makeUnique,
            email: [prefix, makeUnique, "@bar.com"].join(""),
            password: prefix
        };
    }

    function request(data) {
        return common.createSession()
                .pipe(function(access_token) {
                    return common.authJsonPost(access_token, {
                        url: config.url("/api/user/editProfile"), 
                        data: data
                    })
                });
    }

    function shouldMatchUser(data, user) {
        data.should.have.property("user");
        data.user.should.have.property("id");
        data.user.id.should.equal(user.id);
        data.user.should.have.property("username");
        data.user.username.should.equal(user.username);
        data.user.should.have.property("email");
        data.user.email.should.equal(user.email);
        data.user.should.have.property("name");
        data.user.name.should.equal(user.name);
    }

    function dataForUser(user) {
        return $.extend({name: user.username}, user);
    }

    it("should not change anything if the original values are passed", 
        function(done) {
            var user = dataForUser(config.testUser);
            request(user)
            .done(function(data, textStatus, jqXHR) {
                shouldMatchUser(data, user);
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
        });


        it("should change values", function(done) {
            var user = dataForUser(config.testUser);
            var modified = dataForUser(generateRandomUser());
            modified.id = user.id;
        request(modified)
            .fail(common.shouldNotFail)
            .done(function(data, textStatus, jqXHR) {
                shouldMatchUser(data, modified);
                request(user)
                    .fail(common.shouldNotFail)
                    .done(function(data, textStatus, jqXHR) {
                        shouldMatchUser(data, user);
                    }) 
                    .always(function(){done()});
            });
    });

    it("should fail on invalid values", function(done) {
        var user = dataForUser(config.testUser);
        user.email = config.testUser2.email;
        request(user)
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, 
                ["Email", user.email, "already in use"].join(" ")))
            .always(function(){done()});
    });

});
