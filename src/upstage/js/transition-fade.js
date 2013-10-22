// This module overrides the default transition event handler
// and provides a fade transition instead.

// Is the transition currently running?
var running = false;

// We need a way do this and `AsyncQueue` works nicely.
var queue = new Y.AsyncQueue;

// Helper to stop the `AsyncQueue`.
function shutdown () {
    running = false;
    queue.stop();
}

// Override the transition event.
Y.Upstage.on("transition", function (ev) {

    if (running) {
        // A transition is already in progress.
        // Run Upstage's default transition behavior
        // by reverting our styles and not calling
        // ev.preventDefault. Finally, tell the
        // current transitions to halt.
        Y.all(".slide").setStyles({
            "opacity" : "1",
            "display" : "none"
        });
        return shutdown();
    }

    // Otherwise, let's do our own thing.

    ev.preventDefault();
    running = true;

    // Get slides A and B.
    var prev = ev.details[0],
        next = ev.details[1];

    // First step: fade out the `prev` slide.
    queue.add(function () {
        // Run the next function after transition completes:
        queue.pause();
        // We use AsyncQueue just for the stop() ability.
        prev.transition({
            duration : 0.2,
            easing : "ease-out",
            opacity : 0
        }, Y.bind(queue.run, queue));
    });

    // Second step: fade in the `next` slide.
    queue.add(function () {
        queue.pause();
        next.setStyles({
            "opacity" : "0",
            "display" : "block"
        });
        next.transition({
            duration : 0.2,
            easing : "ease-out",
            opacity : 1
        }, Y.bind(queue.run, queue));
    });

    // Third step: hide the `prev` slide.
    queue.add(function () {
        // Hide the previous slide completely.
        // This prevents a transparent slide
        // from getting in the way of elements
        // on the current slide.
        prev.setStyles({
            "display" : "none",
            "opacity" : "1"
        });
    });

    // We're done.
    queue.add(shutdown);

    // Get to it.
    queue.run();

});
