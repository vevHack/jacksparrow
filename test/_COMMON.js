var request = require("request");
var should = require("should");
var config = require("./_CONFIG.js");

module.exports = {

    shouldBe200BlankFactory: function(done) {
        return function(error, response, body) {
            should.not.exist(error);
            response.should.have.status(200);
            should.not.exist(body);
            done();
        };
    },

    shouldBe200JsonFactory: function(done) {
        return function(error, response, body) {
            should.not.exist(error);
            response.should.have.status(200);
            response.should.be.json;
            done();
        };
    },
 
    isServerUp: function(done) {
        request(config.url("/api/ping"), this.shouldBe200JsonFactory(done));
    },

    shouldBeErrorFactory: function(code, msg, done) {
        return function(error, response, body) {
            should.not.exist(error);
            response.should.have.status(code);
            response.should.be.json;
            JSON.parse(body).should.eql({
                error: {
                    code: code,
                    message: msg
                }
            });
            done();
        };
    },

    authHeader: {"Cookie": ["API-ACT", config.testUser.accessToken].join("=")}

};
