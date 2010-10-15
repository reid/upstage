// This is the core of the [Upstage](http://github.com/reid/upstage)
// presentation system. Upstage is built as a collection of modules
// on top of [YUI](http://developer.yahoo.com/yui/3/).

// If you'd like to build a slideshow, check out the
// [README](http://github.com/reid/upstage/blob/master/README.md).

// Upstage was written by [Reid Burke](http://github.com/reid)
// at Yahoo! Inc.
// It's free to use under the [BSD license](http://developer.yahoo.com/yui/license.html).

// Create a namespace: `Y.Upstage`.
Y.namespace("Upstage");
var Upstage = Y.Upstage;

// Upstage is an evented presentation system.
// Make `Y.Upstage` an `EventTarget`.
Y.augment(Upstage, Y.EventTarget);

// Fired by the presentation when everything is ready.
Upstage.on("start", function () {

    // Freeze `Y.UpstageL10N` into `Y.Upstage.L10N`.
    Y.mix(Upstage, {
        L10N : Y.UpstageL10N
    });

    // Give every slide a `#slide{n}` id.
    Y.all(".slide").each(function (node, idx) {
        idx++;
        node.set("id", "slide" + idx);
        node.setData("slide", idx);
    });

    // Navigate to slide 1.
    Upstage.fire("position", 1);

});

// Give a relative number of steps to navigate to.
Upstage.on("warp", function (rel, mouseEvent) {
    if (mouseEvent && mouseEvent.halt) mouseEvent.halt(); // prevent navigation to "#"

    var idx = Upstage.currentSlide + parseInt(rel, 10);

    Y.log("warp: to slide " + idx + " from slide " + Upstage.currentSlide);
    Upstage.fire("position", idx);
});

// Give the slide number you'd like to navigate to.
Upstage.on("position", function (next) {
    // Can't go earlier than the first slide.
    // Can't go further than the last slide.
    next = Math.max(1, next);
    next = Math.min(next, Y.all(".slide").size());
    Y.log("position: should the next slide be " + next);

    var previous = Upstage.currentSlide || 1;
    Upstage.currentSlide = parseInt(next, 10);

    if (previous != next) {
        Y.log("position: yes, firing transition and navigate");

        // Fired only when navigation is happening.
        // No default handlers.
        Upstage.fire("navigate", next);

        Upstage.fire("transition",
            Y.one("#slide" + previous),
            Y.one("#slide" + next)
        );
    }
});

// Moves from slide (node) A to B. May be overriden with `preventDefault`.
Upstage.publish("transition", {
    emitFacade : true,
    defaultFn : function (ev) {
        var prev = ev.details[0],
            next = ev.details[1];
        prev.setStyle("display", "none");
        next.setStyle("display", "block");
    }
});
