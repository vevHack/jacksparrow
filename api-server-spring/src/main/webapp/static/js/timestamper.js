/* Inspired from
 * http://timeago.yarp.com/
 */
var jks = jks || {};
jks.timestamper = jks.timestamper || (function() {
    "use strict";

    var slowRefresh = { threshold: 48*60*60*1000, interval: 60*1000 };
    var fastRefresh = { threshold: 90*1000, interval: 5*1000 };

    function inWords(ms) {
        var seconds = Math.round(Math.abs(ms) / 1000);
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var months = days / 24;
        var years = months / 12;

        function fmt(value, threshold, suffix) {
            return value >= threshold && [Math.round(value), suffix].join(" ");
        }

        return (
            fmt(years, 1, "y") ||
            fmt(months, 1, "mo") ||
            fmt(days, 2, "d") ||
            fmt(hours, 1, "h") ||
            fmt(minutes, 1.5, "m") ||
            fmt(seconds, 0, "s")
            );
    }

    var serverReference, skewBetweenClientAndServer;

    function setReference(serverNow) {
        serverReference = serverNow;
        skewBetweenClientAndServer = (Date.now() - serverNow);
    }

    function update(idx, element) {
        element = $(element);
        var ms = Math.abs(
            (Date.now() - serverReference) - skewBetweenClientAndServer);
        var post = jks.datacache.getPost(element.data("id"));
        ms += serverReference - Date.parse(post.created_on);

        element.find(".timestamp").text(inWords(ms));

        if (ms < slowRefresh.threshold) {
            setTimeout(update.bind(this, idx, element), 
                (ms < fastRefresh.threshold) ? 
                    fastRefresh.interval : slowRefresh.interval);
        }
    }

    return {
        setReference: setReference,
        update: update
    };
}());
