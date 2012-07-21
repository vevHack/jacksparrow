require.config({
    paths: {
        text: "lib/text",
        template: '../template'
    }
});

require(["jquery-loader", "index"], function($, index) {
    $(function() {
    });
});

