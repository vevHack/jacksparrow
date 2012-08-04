var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("User Details", function(){

    before(common.isServerUp.bind(common));

    function request(user, fields) {
        return $.getJSON(config.url("/api/user/details"), 
            $.param({user: user.id, field: fields}, true));
    }

    it("should expect existing user", function(done) { 
        request(config.invalidUser, ["username"])
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, "User not found"))
            .always(function(){done()});
    });

    it("should reject fields that are not explicitly allowed", function(done) { 
        request(config.testUser, ["created_on"])
            .done(common.shouldNotSucceed)
            .fail(common.shouldBeErrorFactory(412, "Invalid detail created_on"))
            .always(function(){done()});
    });
   
    it("should return multiple fields for valid user", function(done) { 
        var user = config.testUser;
        request(user, ["username", "email"])
            .done(function(data) {
                data.should.have.property("user");
                data.user.should.eql({ 
                    id: user.id, 
                    username: user.username, 
                    email: user.email
                });
            })
            .fail(common.shouldNotFail)
            .always(function(){done()});
    });
    
});

