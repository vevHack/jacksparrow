var jks = jks || {};
jks.detailTrigger = jks.detailTrigger || (function() {
    "use strict";

    function attach(root, type, detailView) {
        var currentDiv, trigger;

        function cancelDetail() {
            currentDiv.removeClass("current");
            currentDiv = undefined;
        }

        function expandDetail(event) {
            var targetDiv = $(event.currentTarget).parent();
            if (currentDiv) {
                var lastId = currentDiv.data("id");
                cancelDetail();
                if (lastId === targetDiv.data("id")) {
                    detailView.hide();
                    return;
                }
            } 
            currentDiv = targetDiv;
            currentDiv.addClass("current");
            detailView.show(type, currentDiv, cancelDetail);
        }

        function mouseenterPost(event) {
            var targetDiv = $(event.currentTarget);
            trigger.appendTo(targetDiv);
            if (!currentDiv) {
                targetDiv.addClass("current");
            }
        }

        function mouseleavePost(event) {
            var targetDiv = $(event.currentTarget);
            if (!currentDiv) {
                targetDiv.removeClass("current");
            }
            trigger.detach();
        }

        trigger = $('<a id="show-detail-trigger" class="trigger"/>');
        trigger.click(expandDetail);

        root.on("mouseenter", ".entity", mouseenterPost);
        root.on("mouseleave", ".entity", mouseleavePost);
    }


    return {
        attach: attach
    };
}());
