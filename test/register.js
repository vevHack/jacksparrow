var $ = require("jquery");
var should = require("should");
var config = require("./_CONFIG.js");
var common = require("./_COMMON2.js");

describe("Register", function() {

    before(common.isServerUp.bind(common));

    it("should complete valid request", function(done) {
        var makeUnique = Math.random();
        $.post(("http://localhost:8080/api/public/register"), {
            username: "foo" + makeUnique,
            email: ["foo", makeUnique, "@bar.com"].join(""),
            password: "foo"
        })
        .done(function(data, textStatus, jqXHR) {
            data.should.have.property("user");
            data.user.should.have.property("id");
        })
        /* XXX check that the user exists by calling another API */
        .fail(common.shouldNotHappen)
        .always(function(){done()});
    });

});
