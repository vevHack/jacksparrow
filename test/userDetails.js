var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("User Details", function(){

    before(common.isServerUp.bind(common));

    function request(users, fields) {
        return $.getJSON(config.url("/api/user/details"), 
            $.param({user: users, field: fields}, true));
    }

    it("should return blank if no existing user", function(done) { 
        request([config.invalidUser.id], ["username"])
            .done(function(data) { 
                data.should.have.property("users");
                data.users.should.be.instanceof(Array);
                data.users.should.be.empty;
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });

    it("should reject fields that are not explicitly allowed", function(done) { 
        request([config.testUser.id], ["created_on"])
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, "Invalid detail created_on"))
            .always(function(){done()});
    });
   
    it("should return multiple fields for valid user", function(done) { 
        var user = config.testUser;
        request([user.id], ["username", "email"])
            .done(function(data) {
                data.should.have.property("users");
                data.users.should.includeEql({ 
                    id: user.id, 
                    username: user.username, 
                    email: user.email
                });
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });
    
    it("should return details of multiple user, ignoring invalid ones", 
        function(done) { 
            var users = [config.testUser.id, config.invalidUser.id,
                config.testUser2.id];
            request(users, ["username", "email"])
                .done(function(data) {
                    data.should.have.property("users");
                    data.users.should.have.length(2);
                    var anyOneUser = config.testUser2;
                    data.users.should.includeEql({ 
                        id: anyOneUser.id, 
                        username: anyOneUser.username, 
                        email: anyOneUser.email
                    });
                })
                .fail(common.shouldNotFail)
                .always(function(){done()});
        });
    
});

