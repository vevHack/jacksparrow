var assert = require("assert");
var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON.js");

describe ("Authorized API Access:", function(){

    it("Follow should return OK status",function(done){
        request({
                method: 'POST',
                url: config.url("/api/auth/follow"),
                headers: {"Authorization":
                    ["Basic-Custom ", config.testUser.id, ":", config.testUser.password].join("")
                },
                form:{user:config.testUser2.id}
            },
            common.shouldBe200JsonFactory(done));
    });


});