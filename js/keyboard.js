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
        var host = this.get("host");

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
            case 116: // F8 (Logitech R800 start button)
                host.fire("navigate", 1);
                break;
            case 35: // end
            case 27: // Escape (Logitech R800 stop button)
                host.fire("navigate", 9999);
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
    NS: "keyboard"
});
