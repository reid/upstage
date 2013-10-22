// This module handles gesture-based interaction with the presentation.

var Upstage = Y.Upstage;

function UpstageGesture (config) {
    UpstageGesture.superclass.constructor.apply(this, arguments);
}

UpstageGesture.NS = "gesture";

UpstageGesture.NAME = "upstage-gesture";

UpstageGesture.ATTRS = {
    gestureEventHandle: {
        value: null
    },
    // Pixel distance for considering gesture as a swipe.
    swipeDistance: {
        value: 10
    },
    // Milliseconds for considering tap as held.
    tapHoldThreshold: {
        value: 500
    },
    // Milliseconds for discarding a text selection as a gesture.
    forceGestureThreshold: {
        value: 300
    }
};

Y.extend(UpstageGesture, Y.Plugin.Base, {
    initializer: function (config) {
        Y.log("Binding gesturemovestart.", "info", "upstage-gesture");
        // TODO Work with the host's srcNode?
        this.set("gestureEventHandle",
            Y.one("body").on("gesturemovestart",
                Y.bind("gesture", this)
            )
        );
        this._publishEvents();
    },
    destructor: function () {
        Y.one("body").detach(this.get("gestureEventHandle"));
        this.set("gestureEventHandle", null);
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
    getSelection: function () {
        var userSelection = "",
            selectedText,
            win = Y.config.win,
            doc = Y.config.doc;

        if (win.getSelection) {
            userSelection = win.getSelection();
        } else if (doc.selection) {
            userSelection = doc.selection.createRange();
        }

        selectedText = userSelection;
        if (userSelection.text) {
            selectedText = userSelection.text;
        }

        return selectedText.toString();
    },
    gestureEnd: function (targetStart, ev) {
        var host = this.get("host"),
            xStart = targetStart.getData("gestureX"),
            xEnd = ev.pageX,
            swipeDistance = this.get("swipeDistance"),
            timeStart = targetStart.getData("gestureDate").getTime(),
            timeEnd = (new Date).getTime(),
            timeDelta = timeEnd - timeStart;

        if (this.getSelection() && (timeDelta > this.get("forceGestureThreshold"))) {
            // TODO: Deselect text if gesture was forced?
            Y.log("Text selection found and too slow, ignoring gesture.", "info", "upstage-gesture");
            return;
        }
        Y.log("Gesture accepted.", "info", "upstage-gesture");

        if ( (xStart - xEnd) > swipeDistance ) {
            host.fire("ui:swipeleft", targetStart);
        } else if ( (xEnd - xStart) > swipeDistance ) {
            host.fire("ui:swiperight", targetStart);
        } else {
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

        var target = ev.currentTarget;

        if (ev._event && ev._event.type === "touchstart") {
            // Swiping with one finger will scroll the viewport on touch devices.
            // Prevent scrolling with preventDefault.
            // This will also disable text selection, but it's better than jitter
            // while navigating the deck.
            // TODO: Only preventDefault on gesturemove, iif primary movement on the Y axis?
            Y.log("Preventing default for touchstart.", "info", "upstage-gesture");
            ev.preventDefault();
        }

        // Set some data for later.
        target.setData("gestureX", ev.pageX);
        target.setData("gestureDate", new Date);

        Y.log("Gesture setup complete, waiting for gesturemoveend.", "info", "upstage-gesture");

        // Bind the `gestureEnd` handler just this once.
        target.once("gesturemoveend", Y.bind("gestureEnd", this, target));
    }
});

Y.Plugin.UpstageGesture = UpstageGesture;
