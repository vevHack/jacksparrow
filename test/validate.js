var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

describe("Validate", function() {

    before(common.isServerUp.bind(common));

    function validationOk(data) {
        data.should.eql({
            validation: {
                status: "ok"
            }
        });
    }

    function validationErrorFactory(reason) {
        return function(data) {
            data.should.eql({
                validation: {
                    status: "failed",
                    reason: reason
                }
            });
        };
    }

    [config.testUser.username, "me.myself&irene", 
        "FR∃∃(the)D0M", "FROMdie!", new Array(100+1).join("x")]
        .forEach(function(x) {
            it("should validate proper username " + x, function(done) {
                $.post("http://localhost:8080/api/public/validate", 
                    {username: x}, "json")
                .done(validationOk)
                .fail(common.shouldNotFail)
                .always(function(){done()});
            });
        });

    [   {username: "foo/bar", reason: "Username cannot contain /"},
        {username: "f\\oobar", reason: "Username cannot contain \\"},
        {username: "f  oobar", reason: "Username cannot contain whitespace"},
        {username: "foo\tb\nar", reason: "Username cannot contain whitespace"},
        {username: "api", reason: "Username cannot be api"},
        {username: "god", reason: "Username cannot be god"},
        {
            username: "foo\bbar", 
            reason: "Username cannot contain control character"
        },
        {username: "", reason: "Username cannot be blank"},
        {
            username: new Array(100+1+1).join("x"), 
            reason: "Username cannot exceed 100 characters"
        },
        ].forEach(function(x) {
            it("should not validate bad username " + x.username, 
                function(done) {
                    $.post("http://localhost:8080/api/public/validate", 
                        {username: x.username}, "json")
                        .done(validationErrorFactory(x.reason))
                        .fail(common.shouldNotFail)
                        .always(function(){done()});
                });
        });

    it("should validate proper email", function(done) {
        $.post("http://localhost:8080/api/public/validate", 
            {email: config.testUser.email}, "json")
        .done(validationOk)
        .fail(common.shouldNotFail)
        .always(function(){done()});
    });


    [   {email:"foo\\bar@.com", reason: "Invalid email address"},
        {   
            email:[new Array(100+1+1).join("x"), "@c.com"].join(""),
            reason: "Email cannot exceed 100 characters" 
        }]
        .forEach(function(x) {
            it("should not validate bad email " + x, function(done) {
                $.post("http://localhost:8080/api/public/validate", 
                    {email: x.email}, "json")
                .done(validationErrorFactory(x.reason))
                .fail(common.shouldNotFail)
                .always(function(){done()});
            });
        });

    it("should fail when neither username nor email is provided", 
        function(done) {
            $.post("http://localhost:8080/api/public/validate", {}, "json")
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(412,
                    "Require one and only one field for validation at a time"))
                .always(function(){done()});
        });

    it("should fail when both username nor email are provided", 
        function(done) {
            $.post("http://localhost:8080/api/public/validate", {
                    username: config.testUser.username, 
                    email: config.testUser2.email
                }, "json")
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(412,
                    "Require one and only one field for validation at a time"))
                .always(function(){done()});
        });

});
