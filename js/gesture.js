// This module handles gesture-based interaction with the presentation.

var Upstage = Y.Upstage;

// Pixel distance for considering gesture as a swipe.
var MIN_SWIPE = 10;

// Milliseconds for considering tap as held.
var MIN_HOLD = 500;

// Helper for event publishing.
function publish (name, event, value) {
    Upstage.publish(name, {
        emitFacade : true,
        defaultFn : Y.bind(Upstage.fire, Upstage, event, value)
    });
}

// Publish some gesture-related events.
publish("ui:tap", "warp", 1);
publish("ui:heldtap", "position", 1);
publish("ui:swipeleft", "warp", 1);
publish("ui:swiperight", "warp", -1);

// Shorthand for `Upstage.fire`.
var fire = Y.bind(Upstage.fire, Upstage);

// The gesture is over. Do something with it.
function gestureEnd (targetStart, ev) {

    var xStart = targetStart.getData("gestureX"),
        xEnd = ev.pageX;

    if ( (xStart - xEnd) > MIN_SWIPE ) {
        fire("ui:swipeleft", targetStart);
    } else if ( (xEnd - xStart) > MIN_SWIPE ) {
        fire("ui:swiperight", targetStart);
    } else {

        var timeStart = targetStart.getData("gestureDate").getTime(),
            timeEnd = (new Date).getTime(),
            timeDelta = timeEnd - timeStart;

        if ( timeDelta > MIN_HOLD ) {
            fire("ui:heldtap", timeDelta);
        } else {
            fire("ui:tap", timeDelta);
        }

    }

}

// The gesture has begun. Do we care?
function gesture (ev) {

    // Forget about taps or clicks on buttons or links.
    switch (ev.target.get("tagName").toUpperCase()) {
        case "A":
        case "INPUT":
        case "BUTTON":
        case "VIDEO":
        case "OBJECT":
            return;
    }

    // Otherwise, game on!

    ev.preventDefault();

    var target = ev.currentTarget;

    // Prevent text selection in IE.
    target.once("selectstart", function (ev) {
        ev.preventDefault();
    });

    // Set some data for later.
    target.setData("gestureX", ev.pageX);
    target.setData("gestureDate", new Date);

    // Bind the `gestureEnd` handler just this once.
    target.once("gesturemoveend", Y.bind(gestureEnd, this, target));

}

Upstage.on("start", function () {
    // When you make a gesture on a slide, we'll handle it.
    Y.one("body").delegate("gesturemovestart", gesture, ".slide");
});
