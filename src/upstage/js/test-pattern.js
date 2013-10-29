// This module provides an event that draws SMPTE color bars.

var Upstage = Y.Upstage;

// HTML adapted from Brad Frost: http://codepen.io/bradfrost/details/atuGI
var TEST_PATTERN_HTML = '<div class="upstage-test-pattern-css upstage-tp">' +
    '   <div class="row a">' +
    '    <div class="gray-light"></div>' +
    '    <div class="yellow"></div>' +
    '    <div class="blue-light"></div>' +
    '    <div class="green"></div>' +
    '    <div class="pink"></div>' +
    '    <div class="red"></div>' +
    '    <div class="blue"></div>' +
    '  </div>' +
    '  <div class="row b">' +
    '    <div class="blue"></div>' +
    '    <div class="gray"></div>' +
    '    <div class="pink"></div>' +
    '    <div class="gray"></div>' +
    '    <div class="blue-light"></div>' +
    '    <div class="gray"></div>' +
    '    <div class="gray-light"></div>' +
    '  </div>' +
    '  <div class="row c">' +
    '    <div class="span-4">' +
    '      <div class="blue-dark"></div>' +
    '      <div class="white"></div>' +
    '      <div class="purple"></div>' +
    '      <div class="gray"></div>' +
    '    </div>' +
    '    <div class="triple">' +
    '      <div class="gray-dark"></div>' +
    '      <div class="gray-med"></div>' +
    '      <div class="gray-light-2"></div>' +
    '    </div>' +
    '    <div class="gray">' +
    '      <div class="test"><p>Upstage <span class="t"></span></p><p>Slide <span class="slide"></span></p></div>' +
    '     </div>' +
    '  </div>' +
    '</div>';

function UpstageTestPattern (config) {
    UpstageTestPattern.superclass.constructor.apply(this, arguments);
}

UpstageTestPattern.NS = "test-pattern";

UpstageTestPattern.NAME = "upstage-test-pattern";

UpstageTestPattern.ATTRS = {
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

Y.extend(UpstageTestPattern, Y.Plugin.Base, {
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
        this.onHostEvent("currentSlideChange", Y.bind(this.updateUI, this));
        plugin.drop(true);
    },
    destructor: function () {
        this.get("curtain").remove(true);
    },
    drop: function (hide) {
        if (hide) {
            this.set("start", new Date());
            this.updateUI();
            this.set("timeInterval", Y.later(1000, this, this.updateUI, null, true))
        } else {
            this.get("timeInterval").cancel();
        }
        this.set("dropped", hide);
        this.get("curtain").setStyle("display", hide ? "flex" : "none");
        this.get("host").get("boundingBox").setStyle("display", hide ? "none" : "block");
    },
    formatTime: function (ms) {
        var h = 0;
        var m = 0;
        var s = 0;

        s = ms / 1000 | 0;
        if (s > 59) {
            m = s / 60 | 0;
            s = s % 60;
        }
        if (m > 59) {
            h = h / 60 | 0;
            m = m % 60;
        }
        return Y.Array.map([h, m, s], function pad(digit) {
            digit += "";
            if (digit.length === 1) digit = "0" + digit;
            return digit;
        }).join(":");
    },
    elapsedTime: function () {
        var now = new Date(),
            start = this.get("start"),
            elapsed = now.getTime() - start.getTime();

        console.log(elapsed, this.formatTime(elapsed));

        return this.formatTime(elapsed);
    },
    updateUI: function () {
        this.get("curtain").one(".t").setHTML(this.elapsedTime());
        this.get("curtain").one(".slide").setHTML(this.get("host").get("currentSlide"));
    },
    _createCurtain: function () {
        var div = Y.Node.create(TEST_PATTERN_HTML);

        // Unblank the screen when the curtain is clicked.
        div.on("click", Y.bind("drop", this, false));
        Y.one("body").append(div);

        this.set("curtain", div);
    }
});

Y.Plugin.UpstageTestPattern = UpstageTestPattern;
