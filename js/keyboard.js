// This module handles keyboard interaction with the presentation.

Y.Plugin.UpstageKeyboard = Y.Base.create("upstage-keyboard", Y.Plugin.Base, [], {
    initializer: function (config) {
        var host = this.get("host");

        host.publish("keydown", {
            emitFacade: true
        });
        this.onHostEvent("keydown", Y.bind("keydown", this));

        Y.one(Y.config.doc).on("key", Y.bind("fire", host, "keydown"), "down:");
    },
    destructor: function (config) {
        Y.one(Y.config.doc).detach("key", Y.bind("fire", this.get("host"), "keydown"));
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
                host.fire("navigate", 1);
                break;
            case 35: // end
                host.fire("navigate", 9999);
                break;
            default:
                handled = false;
                break;
        }

        if (handled) {
            ev.halt();
        }
    }
}, {
    NS: "keyboard"
});
