var Upstage = Y.Upstage,
    win = Y.config.win,
    HEIGHT = "height",
    WIDTH = "width";

function textfill(options) {

    function px(str) {
        return Number((str || "").replace(/px/, ""));
    }

    var text = this.one("p,span,h1,h2,h3,h4,h5,h6"),
        size = options.maxSize,
        maxHeight = px(this.getComputedStyle(HEIGHT)),
        maxWidth  = px(this.getComputedStyle(WIDTH)),
        winHeight = win.innerHeight,
        winWidth  = win.innerWidth,
        height,
        width;

    console.log(winHeight, maxHeight, winWidth, maxWidth);
    maxHeight = Math.min(winHeight, maxHeight);
    maxWidth  = Math.min(winWidth, maxWidth);

    do {
        text.setStyle("fontSize", size + "px");
        height = px(this.getComputedStyle(HEIGHT));
        width  = px(this.getComputedStyle(WIDTH));
        size -= 24;
    } while (
        (height > maxHeight || width > maxWidth) &&
        size > 6
    );

    return this;
}

/*! Adopted from yui3-debounce.
 * https://github.com/juandopazo/yui3-debounce/blob/022b1ff7b7bce836bfa9d76c89975b46b19e60ee/js/debounce.js
 * Copyright 2013 Juan Ignacio Dopazo, used under the MIT license. */
function debounce(ms, debouncedFn) {
    var timeout;

    return function () {
        var self = this,
            args = arguments;

        if (ms === -1) {
            debouncedFn.apply(self, args);
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
            debouncedFn.apply(self, args);
        }, ms);
    };
};

Y.Plugin.UpstageTextFill = Y.Base.create("upstage-text-fill", Y.Plugin.Base, [], {
    initializer: function () {
        this.textfill();
        this.set("resizeHandler", debounce(500, Y.bind("textfill", this)));

        Y.one(Y.config.win).on("resize", this.get("resizeHandler"));
    },
    destructor: function () {
        Y.one(Y.config.win).detach("resize", this.get("resizeHandler"));
    },
    textfill: function (node) {
        var maxSize = this.get("textFillMaxSize");

        this.get("host").get("contentBox").all("div.textfill").each(function (node) {
            textfill.call(node, {
                maxSize: maxSize
            });
        });
    }
}, {
    NS: "text-fill",
    ATTRS: {
        textFillMaxSize: {
            value: 500
        }
    }
});
