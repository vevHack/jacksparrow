var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");


describe("Register", function() {

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
        return $.post(config.url("/api/register"), data, "json");
    }

    it("should complete valid request", function(done) {
        request(generateRandomUser())
            .done(function(data, textStatus, jqXHR) {
                data.should.have.property("user");
                data.user.should.have.property("id");

            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });

    function preconditionShouldFail(override, msg, done) {
        request($.extend(generateRandomUser(), override))
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, msg))
            .always(function(){done()});
    }

    describe("#Username", function() {

        it("should not accept blank", function(done) {
            preconditionShouldFail({username: ""}, 
                "Username cannot be blank", done);
        });

        it("should not accept duplicate", function(done) {
            var username = config.testUser.username;
            preconditionShouldFail({username: username},
                ["Username", username, "already in use"].join(" "), done);
        });

        ["/", "\\"].forEach(function(c) {
            it("should not accept " + c, function(done) {
                preconditionShouldFail({username: ["test", c, "foo"].join("")}, 
                    "Username cannot contain " + c, done);
            });
        });

        it("should not be keyword", function(done) {
            preconditionShouldFail({username: "api"}, 
                "Username cannot be api", done);
        });

    });

    describe("#Email", function() {
        it("should not accept malformed", function(done) {
            preconditionShouldFail({email: "xy-test.com"}, 
                "Invalid email address", done);
        });

        it("should not accept duplicate", function(done) {
            var email = config.testUser.email;
            preconditionShouldFail({email: email},
                ["Email", email, "already in use"].join(" "), done);
        });
    });


    describe("#Password", function() {
        it("should not accept blank", function(done) {
            preconditionShouldFail({password: ""}, 
                "Password cannot be blank", done);
        });
    });

});
