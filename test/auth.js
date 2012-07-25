var assert = require("assert");
var request = require("request");

var server = "http://localhost:8080";

describe("Authorization", function() {
    describe("#Basic Status", function() {
        it("should return 401 with custom error json when " 
        + "authorization headers are not present", function(done) {

            var url = server + "/api/auth/feed?user=0";
            request(url, function (error, response, body) {
                assert.ifError(error);
                assert.equal(response.statusCode, 401);
                done();
            });

        })
    })
});
