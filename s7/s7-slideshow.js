YUI.add("s7-slideshow", function (Y) {

    Y.namespace("S7");
    Y.augment(Y.S7, Y.EventTarget);

    Y.S7.on("start", function () {
        Y.all(".slide").each(function (node, idx) {
            node.set("id", "slide" + (idx+1));
        });
    });

    // many not be absolute
    Y.S7.on("warp", function (rel, mouseEvent) {
        if (mouseEvent && mouseEvent.halt) mouseEvent.halt(); // prevent navigation to "#"
        var idx = Y.S7.currentSlide + parseInt(rel, 10);
        Y.log("WARP! current: " + Y.S7.currentSlide); 
        Y.log("WARP! rel: " + rel); 
        Y.log("WARP! to: " + idx); 
        Y.S7.fire("position", idx);
    });

    Y.S7.on("position", function (next) {
        // can't go earlier than the first slide
        // can't go further than the last slide
        next = Math.max(1, next),
        next = Math.min(next, Y.all(".slide").size());
        Y.log("POSITION:REQUEST! will position to: " + next);

        var previous = Y.S7.currentSlide || 1;
        Y.S7.currentSlide = parseInt(next, 10);

        if (previous != next) {
            Y.S7.fire("transition",
                Y.one("#slide" + previous),
                Y.one("#slide" + next)
            );
            Y.S7.fire("navigate", next);
        }
    });

    Y.S7.publish("transition", {
        emitFacade : true,
        defaultFn : function (ev) {    
            var prev = ev.details[0],
                next = ev.details[1];
            prev.setStyle("display", "none");
            next.setStyle("display", "block");
        }
    });

}, "0.0.1", {
    requires : [
        "event-custom",
        "node"
    ]
});
