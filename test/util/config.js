module.exports = {
    server: "https://localhost:8080",
    url: function() {
        return [this.server].concat(
                Array.prototype.slice.apply(arguments)).join("");
    },

    testUser: {
        id: 5,
        username: "foo",
        email: "foo@bar.com",
        password: "test",
    },

    testUser2: {
        id: 6,
        username: "foo2",
        email: "foo2@bar.com",
        password: "test",
        access_token: 6
    },

    invalidUser: {
        id: 0
    },

    testPost: { 
        id: 8,
        user: { id: 5 },
        content: "pirates do tweet",
        created_on: "2012-08-04T17:26:44.472+0000" 
    },

    invalidPost: {
        id: 0
    },

    testFeed: {
        post: 8,
        added_on: "2012-08-04T17:28:20.730+0000"
    }

};
