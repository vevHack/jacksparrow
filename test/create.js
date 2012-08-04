var $ = require("jquery");
var should = require("should");
var config = require("./util/config");
var common = require("./util/common");

describe("Create", function() {

    before(common.isServerUp.bind(common));

/* XXX
    it("should not accept blank content", function(done) {
        request(
            requestParamsFactory({content:""}),
            common.shouldBeErrorFactory(412, "Content cannot be empty", done));
    });

    it("should complete valid request", function(done) {
        request(
            requestParamsFactory({content:"hello"}),
            common.shouldBe200BlankFactory(done));
    });

*/
});
