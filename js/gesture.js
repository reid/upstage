// This module handles gesture-based interaction with the presentation.

var Upstage = Y.Upstage;

function UpstageGesture (config) {
    UpstageGesture.superclass.constructor.apply(this, arguments);
}

UpstageGesture.NS = "gesture";

UpstageGesture.NAME = "upstage-gesture";

UpstageGesture.ATTRS = {
    // Pixel distance for considering gesture as a swipe.
    swipeDistance: {
        value: 10
    },
    // Milliseconds for considering tap as held.
    tapHoldThreshold: {
        value: 500
    }
};

Y.extend(UpstageGesture, Y.Plugin.Base, {
    initializer: function (config) {
        this.get("host").get("srcNode").on("gesturemovestart",
            Y.bind("gesture", this),
            this.get("host").get("srcNode"));
        this._publishEvents();
    },
    destructor: function () {
        this.get("host").get("srcNode").detach("gesturemovestart",
            Y.bind("gesture", this));
    },
    _publishEvents: function () {
        var plugin = this,
            host = plugin.get("host");

        // Helper for event publishing.
        function publish (name, event, value) {
            host.publish(name, {
                emitFacade: true
            });
            plugin.onHostEvent(name, Y.bind("fire", host, event, value));
        }

        // Publish some gesture-related events on the host.
        publish("ui:tap", "warp", 1);
        publish("ui:heldtap", "navigate", 1);
        publish("ui:swipeleft", "warp", 1);
        publish("ui:swiperight", "warp", -1);
    },
    gestureEnd: function (targetStart, ev) {
        var host = this.get("host"),
            xStart = targetStart.getData("gestureX"),
            xEnd = ev.pageX,
            swipeDistance = this.get("swipeDistance");

        if ( (xStart - xEnd) > swipeDistance ) {
            host.fire("ui:swipeleft", targetStart);
        } else if ( (xEnd - xStart) > swipeDistance ) {
            host.fire("ui:swiperight", targetStart);
        } else {

            var timeStart = targetStart.getData("gestureDate").getTime(),
                timeEnd = (new Date).getTime(),
                timeDelta = timeEnd - timeStart;

            if ( timeDelta > this.get("tapHoldThreshold") ) {
                host.fire("ui:heldtap", timeDelta);
            } else {
                host.fire("ui:tap", timeDelta);
            }
        }
    },
    gesture: function (ev) {
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
        target.once("gesturemoveend", Y.bind("gestureEnd", this, target));
    }
});

Y.Plugin.UpstageGesture = UpstageGesture;
