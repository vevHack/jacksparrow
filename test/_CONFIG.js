module.exports = {
    server: "http://localhost:8080",
    url: function() {
        return [this.server].concat(
                Array.prototype.slice.apply(arguments)).join("");
    },

    testUser: {
        id: 5,
        username: "foo",
        email: "foo@bar.com",
        password: "test"
    },
    invalidUser: {
        id: 0
    }

};
