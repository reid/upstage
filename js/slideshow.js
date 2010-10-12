Y.namespace("Upstage");
var Upstage = Y.Upstage;

Y.augment(Upstage, Y.EventTarget);

Upstage.on("start", function () {

    // freeze L10N into Y.Upstage
    Y.mix(Upstage, {
        L10N : Y.UpstageL10N
    });

    // give every slide a #slide{n} id
    Y.all(".slide").each(function (node, idx) {
        idx++;
        node.set("id", "slide" + idx);
        node.setData("slide", idx);
    });

    // navigate to slide 1
    Upstage.fire("position", 1);

});

// warp: give a relative number of steps to navigate to
Upstage.on("warp", function (rel, mouseEvent) {
    if (mouseEvent && mouseEvent.halt) mouseEvent.halt(); // prevent navigation to "#"

    var idx = Upstage.currentSlide + parseInt(rel, 10);

    Y.log("warp: to slide " + idx + " from slide " + Upstage.currentSlide);
    Upstage.fire("position", idx);
});

// position: give the slide number you'd like to navigate to
Upstage.on("position", function (next) {
    // can't go earlier than the first slide
    // can't go further than the last slide
    next = Math.max(1, next);
    next = Math.min(next, Y.all(".slide").size());
    Y.log("position: should the next slide be " + next);

    var previous = Upstage.currentSlide || 1;
    Upstage.currentSlide = parseInt(next, 10);

    if (previous != next) {
        Y.log("position: yes, firing transition and navigate");
        Upstage.fire("navigate", next); // fired only when navigation is happening
        Upstage.fire("transition",
            Y.one("#slide" + previous),
            Y.one("#slide" + next)
        );
    }
});

// transition: moves from slide A to B. may be overriden with preventDefault.
Upstage.publish("transition", {
    emitFacade : true,
    defaultFn : function (ev) {
        var prev = ev.details[0],
            next = ev.details[1];
        prev.setStyle("display", "none");
        next.setStyle("display", "block");
    }
});
