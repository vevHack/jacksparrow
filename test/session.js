var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");
var ajaxWithCookieFactory = require("./util/ajaxWithCookieFactory")


describe("Session", function() {
    
    before(common.isServerUp.bind(common));

    function request(data) {
        return {
            type: "POST",
            url: config.url("/api/session/create"),
            data: data,
            dataType: "json"
        };
    }

    describe("#Create", function() {

        it("should set API Access Token cookie on valid credentials", 
            function(done) {
                var ajaxWithCookie = ajaxWithCookieFactory();
                ajaxWithCookie.go(request({
                    user: config.testUser.id, 
                    password: config.testUser.password
                }))
                    .done(function(data) {
                        data.should.have.property("session");
                        data.session.should.have.property("user");
                        data.session.user.should.have.property("id");
                        data.session.user.id.should.equal(config.testUser.id);
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
            code: 412,
            msg: "User not found"
        }, {
            field: "password",
            data: {user: config.testUser.id, password: "foo"},
            code: 401,
            msg: "Incorrect password"
        }].forEach(function(testCase) {
            it("should not create session for invalid " + testCase.field, 
            function(done) {
                var ajaxWithCookie = ajaxWithCookieFactory();
                ajaxWithCookie.go(request(testCase.data))
                    .done(common.shouldNotSucceed)
                    .fail(function() {
                        should.not.exist(ajaxWithCookie.getCookie("API-ACT"));
                    })
                    .fail(common.shouldBeErrorFactory(
                        testCase.code, testCase.msg))
                    .always(function(){done()});
            });
        });

    });

    describe("#Destroy", function() {

        var createRequest = request({ 
            user: config.testUser.id, password: config.testUser.password
        });

        it("should succeed when access_token is passed via cookie", 
            function(done) {
                var ajaxWithCookie = ajaxWithCookieFactory();
                ajaxWithCookie.go(createRequest)
                    .fail(common.shouldNotFail)
                    .done(function() {
                        ajaxWithCookie.go({
                            type: "POST",
                            url: config.url("/api/session/destroy")
                        })
                            .done(common.shouldBeBlank)
                            .done(function() {
                                ajaxWithCookie.getCookie("API-ACT").
                                    should.be.empty;
                            })
                            .fail(common.shouldNotFail)
                            .always(function(){done()});
                    });
            });

        it("should succeed when access_token is passed via Authorization header", 
            function(done) {
                $.ajax(createRequest)
                    .fail(common.shouldNotFail)
                    .done(function(data) {
                        var token = data.session.access_token;
                        function request(url) {
                            return {
                                type: "POST",
                                url: config.url(url),
                                headers: {"Authorization": 
                                    ["API-ACT", token].join(" ")}
                            };
                        }
                        $.ajax(request("/api/session/destroy"))
                            .fail(common.shouldNotFail)
                            .done(common.shouldBeBlank)
                            .done(function(data, textStatus, jqXHR) {
                                $.ajax(request("/api/user/feed"))
                                    .done(common.shouldNotSucceed)
                                    .fail(common.shouldBeErrorCodeFactory(401))
                                    .always(function(){done()});
                            });
                    });
            });

    });

});
