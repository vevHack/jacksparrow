var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");
var ajaxWithCookieFactory = require("./_ajaxWithCookieFactory.js")

describe("Session", function() {
    
    before(common.isServerUp.bind(common));

    describe("Create", function() {

        function ajaxParametersForData(data) {
            return {
                type: "POST",
                url: config.url("/api/session/create"),
                data: data,
                dataType: "json"
            };
        }

        it("should set API Access Token cookie on valid credentials", 
            function(done) {
                var ajaxWithCookie = ajaxWithCookieFactory();
                ajaxWithCookie.go(ajaxParametersForData({
                    user: config.testUser.id, 
                    password: config.testUser.password
                }))
                    .done(function(data) {
                        data.should.have.property("session");
                        data.session.should.have.property("user");
                        data.session.user.should.equal(config.testUser.id);
                        data.session.should.have.property("access_token");
                        ajaxWithCookie.getCookie("API-ACT").should.equal(
                            data.session.access_token);
                    })
                    .fail(common.shouldNotFail)
                    .always(function(){done()});
            });

        [{ 
            field: "user",
            data: {user: config.invalidUser.id, password: "foo"},
            msg: "User does not exist"
        }, {
            field: "password",
            data: {user: config.testUser.id, password: "foo"},
            msg: "Incorrect password"
        }].forEach(function(testCase) {
            it("should not create session for invalid " + testCase.field, 
            function(done) {
                var ajaxWithCookie = ajaxWithCookieFactory();
                ajaxWithCookie.go(ajaxParametersForData(testCase.data))
                    .done(common.shouldNotSucceed)
                    .fail(common.shouldBeErrorFactory(401, testCase.msg))
                    .always(function(){done()});
            });
        });

    });

});
