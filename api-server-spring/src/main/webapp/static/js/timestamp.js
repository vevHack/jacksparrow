/* Inspired from
 * http://timeago.yarp.com/
 */
(function($) {
    "use strict";

    if ($.updateTS) {
        return;
    }

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
            fmt(months, 1, "m") ||
            fmt(days, 2, "d") ||
            fmt(hours, 1, "h") ||
            fmt(minutes, 1.5, "m") ||
            fmt(seconds, 0, "s")
            );
    }

    var serverReference, skewBetweenClientAndServer;

    function update() {
        var ms = Math.abs(
            (Date.now() - serverReference) - skewBetweenClientAndServer);
        ms += this.data("staleness");
        this.text(inWords(ms));

        if (ms < slowRefresh.threshold) {
            setTimeout(update.bind(this), (ms < fastRefresh.threshold) ? 
                fastRefresh.interval : slowRefresh.interval);
        }
        return this;
    };

    $.updateTimestamp = {
        setReference: function(serverNow) {
            serverReference = serverNow;
            skewBetweenClientAndServer = (Date.now() - serverNow);
            return this;
        }
    }

    $.fn.updateTimestamp = update;

}(jQuery));
