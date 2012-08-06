/* Inspired from
 * http://timeago.yarp.com/
 */
(function($) {
    "use strict";

    if ($.updateTimestamp) {
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

    var reference = null;

    $.timestamp = {
        setReference: function(reference_) {
            reference = reference_;
            return this;
        }
    };

    function update() {
        var ms = (Date.now() - reference);
        ms = ms < 0 ? 0 : ms;
        ms += this.data("staleness");
        this.text(inWords(ms));

        if (ms < slowRefresh.threshold) {
            setTimeout(update.bind(this), (ms < fastRefresh.threshold) ? 
                fastRefresh.interval : slowRefresh.interval);
        }
    };

    $.fn.updateTS = update;

}(jQuery));
