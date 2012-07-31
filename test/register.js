var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

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

    it("should complete valid request", function(done) {
        $.post("http://localhost:8080/api/public/register", 
            generateRandomUser(), "json")
        .done(function(data, textStatus, jqXHR) {
            data.should.have.property("user");
            data.user.should.have.property("id");
            data.user.should.have.property("accessToken");
        })
        /* XXX check that the user exists by calling another API */
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });

    function preconditionShouldFail(override, msg, done) {
        $.post("http://localhost:8080/api/public/register", 
                $.extend(generateRandomUser(), override), "json")
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
                ["Username", username, "already exists"].join(" "), done);
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
                ["Email", email, "already exists"].join(" "), done);
        });
    });


    describe("#Password", function() {
        it("should not accept blank", function(done) {
            preconditionShouldFail({password: ""}, 
                "Password cannot be blank", done);
        });
    });

});
