var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

/* TODO XXX
describe("Access Token", function() {

    before(common.isServerUp.bind(common));

    [ 
        { credential: config.testUser.email, credential_name: "email"},
        { credential: config.testUser.username, credential_name: "username"}
    ].forEach(function(testCase) {
        it("should grant token to valid request using " 
            + testCase.credential_name, function(done) {
                $.post("http://localhost:8080/api/public/accessToken", { 
                    email_or_username: testCase.credential, 
                    password: config.testUser.password 
                }, "json")
                .done(function(data, textStatus, jqXHR) {
                    data.should.have.property("user");
                    data.user.should.have.property("id");
                    data.user.should.have.property("accessToken");
                })
                .fail(common.shouldNotFail)
                .always(function(){done()});
            });
    });


    [
     {   
         credential: ["foo", Math.random(), "@bar.com"].join(""), 
         credential_name: "email" 
     },
     {   
         credential: ["foo", Math.random()].join(""), 
         credential_name: "username"
     }
    ].forEach(function(testCase) {
        it("should not grant token to request using nonexistent " +
            testCase.credential_name, function(done) {
                var nonExistentUser = { password: "foo" };
                nonExistentUser.email_or_username = testCase.credential;
                $.post("http://localhost:8080/api/public/accessToken", 
                    nonExistentUser, "json")
                    .done(common.shouldNotSucceed)
                    .fail(common.shouldBeErrorFactory(401, 
                        ["No user having given", testCase.credential_name, 
                            "exists"].join(" ")))
                    .always(function(){done()});
            });
    });

});
*/
