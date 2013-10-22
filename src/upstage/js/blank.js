// This module provides an event that blanks the screen.

var Upstage = Y.Upstage;

function UpstageBlank (config) {
    UpstageBlank.superclass.constructor.apply(this, arguments);
}

UpstageBlank.NS = "blank";

UpstageBlank.NAME = "upstage-blank";

UpstageBlank.ATTRS = {
    background: {
        value: "#000"
    },
    keycodes: {
        value: [
            66, // B
            190 // . (Logitech R800 blank button)
        ]
    },
    curtain: {
        value: null
    }
};

Y.extend(UpstageBlank, Y.Plugin.Base, {
    initializer: function (config) {
        this._createCurtain();
        var curtain = this.get("curtain");
        var plugin = this;
        this.onHostEvent("keydown", function (ev) {
            var keycode = ev.details[0].keyCode;
            if (Y.Array.some(plugin.get("keycodes"), function (value) {
                return value === keycode;
            })) {
                plugin.drop(!plugin.get("dropped"));
                ev.halt();
            } else {
                plugin.drop(false);
            }
        });
    },
    destructor: function () {
        this.get("curtain").remove(true);
    },
    drop: function (hide) {
        this.set("dropped", hide);
        this.get("curtain").setStyle("display", hide ? "block" : "none");
    },
    _createCurtain: function () {
        var div = Y.Node.create("<div></div>");

        div.setStyles({
            background : this.get("background"),
            position : "absolute",
            top : 0,
            left : 0,
            width : "100%",
            height : "100%",
            zIndex : "100",
            display : "none"
        });

        // Unblank the screen when the curtain is clicked.
        div.on("click", Y.bind("drop", this, false));

        Y.one("body").append(div);

        this.set("curtain", div);
    }
});

Y.Plugin.UpstageBlank = UpstageBlank;
