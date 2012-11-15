// This module handles keyboard interaction with the presentation.

Y.Plugin.UpstageKeyboard = Y.Base.create("upstage-keyboard", Y.Plugin.Base, [], {
    initializer: function (config) {
        var host = this.get("host");

        host.publish("keydown", {
            emitFacade: true
        });

        Y.one(Y.config.win).on("keydown", Y.bind("keydown", this));
    },
    destructor: function (config) {
        Y.one(Y.config.win).detach("keydown", Y.bind("keydown", this));
    },
    keydown: function (ev) {
        var host = this.get("host"),
            handled = true;

        Y.log(ev.type + ": " + ev.keyCode, "debug", "upstage-keyboard");

        var handled = true;

        switch (ev.keyCode) {
            case 32: // space bar
            case 34: // page down
            case 39: // right
            case 40: // down
                host.fire("warp", 1);
                break;
            case 33: // page up
            case 37: // left
            case 38: // up
                host.fire("warp", -1);
                break;
            case 36: // home
                host.fire("navigate", 1);
                break;
            case 35: // end
                host.fire("navigate", 9999);
                break;
            case 116: // F8 (Logitech R800 play button)
            case 27: // Escape (Logitech R800 play button)
                if (!this.get("playKeycode")) {
                    // The Logitech R800 alternates between
                    // the F8 and Escape keycodes. Capture the
                    // first key we get as the initial state.
                    this.set("playKeycode", ev.keyCode);
                }

                if (ev.keyCode === this.get("playKeycode")) {
                    // Go to beginning of show.
                    // Store the current slide state.
                    Y.log("return to first storing state for: " + ev.keyCode, "debug", "upstage-keyboard");
                    this.set("lastSlideBeforeReset", host.get("currentSlide"));
                    host.fire("navigate", 1);
                } else {
                    // When the R800's start button is pressed again,
                    // go back to the last slide before reset.
                    // This is to recover from accidental press
                    // of the start button during a presentation.
                    Y.log("return to lastSlideBeforeReset for: " + ev.keyCode, "debug", "upstage-keyboard");
                    host.fire("navigate", this.get("lastSlideBeforeReset"));
                }
                break;
            default:
                handled = false;
                break;
        }

        if (handled) {
            ev.halt();
        } else {
            host.fire("keydown", ev);
        }
    }
}, {
    NS: "keyboard",
    ATTRS: {
        playKeycode: {
            value: 116 // F8
        },
        lastSlideBeforeReset: {
            value: 1
        }
    }
});
