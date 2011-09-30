// This module handles keyboard interaction with the presentation.
function UpstageKeyboard (config) {
    UpstageKeyboard.superclass.constructor.apply(this, arguments);
}

UpstageKeyboard.NS = "keyboard";

UpstageKeyboard.NAME = "upstage-keyboard";

Y.extend(UpstageKeyboard, Y.Plugin.Base, {
    initializer: function (config) {
        Y.one(Y.config.doc).on("key", Y.bind("keydown", this), "down:");
    },
    keydown: function (ev) {
        var host = this.get("host");

        Y.log("upstage-keyboard: " + ev.type + ": " + ev.keyCode);

        // Unblank the screen for all keys except B.
        if (ev.keyCode != 66) host.fire("blank:off");

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
                host.fire("position", 1);
                break;
            case 35: // end
                host.fire("position", 9999);
                break;
            case 66: // B
                host.fire("blank");
                break;
        }
    }
});

Y.Plugin.UpstageKeyboard = UpstageKeyboard;
