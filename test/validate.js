var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");


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

    function request(data) {
        return $.getJSON(config.url("/api/validate"), data);
    }
    
    function shouldValidate(name, data) {
        it("should validate proper " + name, function(done) {
            request(data)
                .done(validationOk)
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    }

    function shouldNotValidate(name, data, reason) {
        it("should not validate bad " + name, function(done) {
            request(data)
                .done(validationErrorFactory(reason))
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    }

    [config.testUser.username, "me.myself&irene", 
        "FR∃∃(the)D0M", "FROMdie!", new Array(100+1).join("x")]
    .forEach(function(username) {
        shouldValidate("username " + username, {username: username}); 
    });

    /*
    [  
        {username: "foo/bar", reason: "Username cannot contain /"},
        {username: "f\\oobar", reason: "Username cannot contain \\"},
        {username: "foo@bar", reason: "Username cannot contain @"},
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
        {username: "", reason: "Username cannot be blank"},
    ]
    .forEach(function(testCase) { 
        shouldNotValidate(testCase.username, 
            {username: testCase.username}, testCase.reason);
    });


    shouldValidate("email", {email: config.testUser.email});


    [
        {email:"foo\\bar@.com", reason: "Invalid email address"},
        {   
            email:[new Array(100+1+1).join("x"), "@c.com"].join(""),
            reason: "Email cannot exceed 100 characters" 
        }
    ]
    .forEach(function(testCase) {
        shouldNotValidate("email " + testCase.email,
            {email: testCase.email}, testCase.reason);
    });

    shouldValidate("password", {password: config.testUser.password});
    shouldNotValidate("blank password", {password: ""}, 
        "Password cannot be blank");

    it("should fail when no argument is provided", 
        function(done) {
            request(data)
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(412,
                    "Require one and only one field for validation at a time"))
                .always(function(){done()});
        });

    it("should fail when multiple arguments are provided", 
        function(done) {
            request({
                username: config.testUser.username, 
                email: config.testUser2.email
            })
                .done(common.shouldNotSucceed)
                .fail(common.shouldBeErrorFactory(412,
                    "Require one and only one field for validation at a time"))
                .always(function(){done()});
        });

*/
});
